---
title: 'Testing FastAPI Endpoints Against a Real Postgres'
date: '2026-07-14'
status: published
privacy: public
lang: en
tags:
  - fastapi
  - postgresql
  - testing
  - pytest
  - testcontainers
  - sqlalchemy
  - alembic
  - asyncio
  - httpx
  - integration-testing
  - ci
  - backend
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  Why endpoint tests should run against a real Postgres instead of SQLite or a
  mocked repository, and how to make that fast: testcontainers provisioning,
  migrations instead of create_all, four isolation strategies with their
  trade-offs, async pytest traps, and a complete conftest.py — with every
  version-sensitive claim quarantined in its own section so the rest survives
  library churn.
---

> Provisioning, schema, isolation, async traps, and speed — with the version-sensitive parts quarantined so the rest keeps working. Verified against the ecosystem as of July 2026: every claim that depends on a library version lives in Part 14, together with a way to re-check it; everything before Part 14 is intended to survive version churn.

---

## The argument in one paragraph

If your application runs on Postgres, your tests should run on Postgres. The two common escapes — swapping in SQLite, or mocking the repository layer away — both produce green suites that certify nothing about the code path most likely to break in production. The historical justification was speed and setup friction. Both have largely evaporated: a session-scoped container with `fsync=off` costs a couple of seconds to start and single-digit milliseconds per test. What remains is a question about *what your test suite is evidence of*, and the honest answer is that endpoint tests exist to catch precisely the things a fake database cannot express.

---

## Part 1 — Why not SQLite

The objection is not a vague lack of realism. It is that the specific defects an endpoint test exists to catch are the ones SQLite structurally cannot represent.

**Your migrations never run.** Alembic against SQLite takes a different code path — batch mode, table rebuilds — from the DDL you deploy. A green migration suite on SQLite tells you nothing about whether `ALTER TABLE ... ADD COLUMN ... NOT NULL DEFAULT` will take an `ACCESS EXCLUSIVE` lock and stall a production table. If migrations are not exercised against the real engine, they are not tested.

**The type system is a different type system.** No `JSONB` and therefore none of its operators (`@>`, `?`, `#>>`) or GIN indexing; no native `ARRAY`, `UUID`, `ENUM`, `INET`, `INTERVAL`, `tsvector`, `citext`; no `NUMERIC` with real precision. Either your models avoid all of these — in which case Postgres is decorative — or the schema under test is not the schema you deploy.

**Constraints are advisory.** SQLite is dynamically typed outside `STRICT` tables, and foreign keys are off by default unless you issue `PRAGMA foreign_keys = ON` on every connection. A test can insert a row Postgres would reject outright. Check constraints, exclusion constraints, and deferrable constraints have no meaningful equivalent.

**There is no MVCC.** SQLite serialises writers at the database level. `SELECT ... FOR UPDATE`, `SKIP LOCKED`, advisory locks, isolation-level semantics, and deadlock behaviour are absent or fictional. Any concurrency test on SQLite is theatre.

**Semantics drift quietly.** Collation and case sensitivity, `NULL` ordering, `DISTINCT ON`, upsert corner cases, and the absence of a native date/time type all diverge in ways that produce subtly wrong assertions rather than loud failures.

The failure mode is not "the test breaks". It is "the test passes and means nothing", which is worse: it consumes the maintenance budget of a real test while providing the assurance of none.

SQLite in tests is defensible in exactly one case: when SQLite is what you run in production.

---

## Part 2 — Why not mock the repository

Mocking is not a cheap Postgres. It is a different test *level*, correct for some things and structurally incapable of others.

A mocked-repository endpoint test genuinely verifies routing, request validation, authentication and authorisation, error-to-status-code mapping, response serialisation, and orchestration between services. Keep those tests.

What it cannot verify, by construction, is everything the repository does: the SQL actually emitted, the ORM mapping, cascade behaviour, whether a unique violation surfaces as a 409 or an unhandled 500, transaction boundaries, whether the session is flushed before you read back a server-generated default, and whether the endpoint issues one query or forty-one.

The deeper problem is epistemic. A mock encodes *your belief* about the repository's behaviour. When the belief is wrong, the mock and the production code are wrong in the same direction, and the suite is green. You have built an internally coherent falsehood. This is the core of Fowler's objection in *Mocks Aren't Stubs*, and the motivation for **verified fakes**: if you use a fake repository, run a shared contract suite asserting identical behaviour against both the fake and the real Postgres-backed implementation. That keeps the fake honest — and it requires a real Postgres anyway. You do not eliminate the container; you relocate it.

There is a design cost too. Introducing a repository interface *solely* to enable mocking means paying for indirection, surrendering SQLAlchemy's unit-of-work and identity-map ergonomics, and forcing query-shaping requirements through an abstraction that leaks the moment someone needs a window function. That is a real price for a speedup testcontainers no longer charges you.

Mocks own one niche outright: **failure injection.** Connection timeouts, deadlocks, serialisation failures, and pool exhaustion are hard to induce against a live database and trivial to simulate with a double that raises `OperationalError`. Use them there.

### Where the lines fall

| Layer under test | Double | Why |
|---|---|---|
| Pure domain logic | None; no DB at all | They are functions. Call them. |
| Endpoint + persistence | **Real Postgres** | The only place migrations, constraints, SQL, and transaction boundaries are exercised. |
| Endpoint, DB-irrelevant (validation, auth, rate limiting) | Mocked repository | The database is noise; it slows the test and obscures the assertion. |
| DB failure paths (timeout, deadlock, pool exhaustion) | Mocked repository | Genuinely hard to induce against a live engine. |
| Third-party HTTP services | `respx` / mock transport | Never hit external services from a test suite. |

### Epistemic caveat

None of this rises above craft consensus. The empirical literature on test doubles is thin. Spadini et al. (*To Mock or Not To Mock*, MSR 2017) is an observational mining study of a small number of OSS projects; it finds mocking concentrated at external-dependency boundaries rather than at the database, which is consistent with the position above but does not establish it. I am not aware of any controlled study measuring escaped-defect rates for SQLite-versus-Postgres test backends. Treat the table as a reasoned position, not a demonstrated one.

---

## Part 3 — Provisioning

### 3.1 Testcontainers (default)

Ephemeral, no port conflicts, identical locally and in CI, version pinned in code rather than in a README. Startup is roughly 1–3 s on a warm image. Do it **once per session**, never per test.

The durable pattern is to ask testcontainers for a *driverless* URL and attach the driver yourself. `get_connection_url()` returns a psycopg2-flavoured SQLAlchemy URL by default; passing `driver=None` suppresses that, and you compose whichever dialect you need. This decouples your conftest from testcontainers' opinion about drivers, which has changed before and will change again.

```python
from testcontainers.postgres import PostgresContainer

with PostgresContainer(PG_IMAGE, driver=None) as pg:
    bare = pg.get_connection_url()          # postgresql://user:pass@host:port/db
```

### 3.2 An externally provided database

In CI, a `services:` block often beats testcontainers, because the runner has already warmed the image and there is no Docker-in-Docker overhead. Support both by reading the environment (see the appendix). One conftest, two environments, no branching in test code.

### 3.3 docker compose

Fine, and often what the team already has. The cost is out-of-band lifecycle management: someone will run the suite against a stale volume from three migrations ago and lose a morning. Make schema reset unconditional if you go this way.

### 3.4 A shared, long-lived database

No. Cross-developer interference, no clean-slate guarantee, and it makes migration bugs invisible.

### 3.5 Pin the major version to production

Test on the major version you deploy. Testing on one and shipping on another reintroduces exactly the class of bug you are here to eliminate. Postgres ships a new major roughly annually and supports each for five years; assume the pin needs bumping about once a year, and make it a single constant (Part 14).

---

## Part 4 — Schema: migrations, not `create_all`

`Base.metadata.create_all()` is faster and it is wrong, because it builds the schema your *models* describe, not the schema your *migrations* produce. Those drift, and the drift is silent until deploy. Running `alembic upgrade head` in the test session turns every test run into a migration test.

Two refinements worth adopting.

**Assert no schema drift.** After `upgrade head`, run Alembic's autogenerate comparison and fail on a non-empty diff. This catches "someone edited a model and forgot the migration" at test time.

```python
from alembic.autogenerate import compare_metadata
from alembic.migration import MigrationContext

def test_no_pending_migrations(sync_engine):
    with sync_engine.connect() as conn:
        diff = compare_metadata(MigrationContext.configure(conn), Base.metadata)
    assert diff == [], f"Models and migrations have diverged: {diff}"
```

**Test the downgrade path only if you rely on it.** `upgrade head` → `downgrade base` → `upgrade head`. Most teams do not actually rely on downgrades; if you do not, delete the downgrade bodies rather than pretending.

**Driver-URL friction.** Alembic's `command.upgrade` runs synchronously, so it wants a sync driver URL even when the app uses asyncpg. Keep one helper (appendix) rather than scattering `.replace()` calls. An async `env.py` is possible but buys little here.

---

## Part 5 — Isolation: the core problem

Every test must start from a known state. Four mechanisms, with real trade-offs.

### 5.1 Transaction rollback with SAVEPOINT — fast, conditional

Open a connection, begin a transaction, bind the session to that connection, run the test, roll back. Nothing touches disk.

The complication is that your endpoint calls `session.commit()`, which naively commits the outer transaction and destroys isolation. SQLAlchemy 2.x solves this with `join_transaction_mode="create_savepoint"`: the session's `commit()` releases a SAVEPOINT rather than committing the outer transaction, and the outer `rollback()` discards everything.

```python
conn = await engine.connect()
trans = await conn.begin()
maker = async_sessionmaker(
    bind=conn,
    expire_on_commit=False,
    join_transaction_mode="create_savepoint",
)
```

(If you find a blog post using an `after_transaction_end` event listener to re-open a nested transaction, that is the SQLAlchemy 1.4-era recipe. It is obsolete.)

**This works only if every write goes through the session you injected.** It silently under-tests, and sometimes deadlocks, when:

- an endpoint constructs its own session or engine (a repository calling `sessionmaker()` internally);
- work is dispatched to `BackgroundTasks` or `asyncio.create_task`, which runs on a *different* connection, cannot see your uncommitted data, and may block on locks your test's open transaction holds;
- the code uses `LISTEN`/`NOTIFY`, advisory locks, or explicit transaction control;
- the assertion depends on real commit visibility across connections.

Before building a suite on this fixture, grep for `sessionmaker(`, `create_engine`, `create_async_engine`, `create_task(`, and `BackgroundTasks`. If they appear in the code under test, those tests need a different strategy.

### 5.2 TRUNCATE after each test — slower, honest

Real commits, real cross-connection visibility, no lies. One `TRUNCATE` naming all tables in a single statement is far cheaper than one per table, and much cheaper than `DELETE`.

```sql
TRUNCATE TABLE "a", "b", "c" RESTART IDENTITY CASCADE;
```

A sane compromise: rollback isolation for the bulk of the suite, and a `@pytest.mark.commits` marker selecting a TRUNCATE-based fixture for the handful of tests that need real commit semantics.

### 5.3 Template databases — fast reset, full realism

Postgres clones a database by file copy:

```sql
CREATE DATABASE test_w1 TEMPLATE test_template;
```

Migrate once into `test_template`, then clone per xdist worker (or even per test, for a small schema). The clone is physical and fast, and the result is fully real — real commits, real concurrency, no shared state. Constraints: `CREATE DATABASE` cannot run inside a transaction block (you need an `AUTOCOMMIT` connection), and **no session may be connected to the template** at clone time, which means disposing pools carefully.

This is the strongest option for parallel suites, and the fiddliest.

### 5.4 Drop and recreate the schema per test

Correct, and far too slow. Reserve for migration tests.

---

## Part 6 — The HTTP client

### 6.1 `httpx.AsyncClient` + `ASGITransport`

In-process, no socket, no server, and — crucially — the same event loop as your database pool.

```python
transport = ASGITransport(app=app)
async with AsyncClient(transport=transport, base_url="http://test") as client:
    r = await client.post("/widgets", json={"name": "gadget"})
```

Always use the explicit `transport=` form. The `AsyncClient(app=...)` shortcut was deprecated in httpx 0.27; treat it as gone.

**The lifespan trap.** `ASGITransport` does **not** run your application's lifespan. If your `@asynccontextmanager async def lifespan(app)` is where you create the engine, warm a cache, or register a broker, none of it happens, and you get baffling `None` attributes on `app.state`. Two fixes:

```python
# A: asgi-lifespan
from asgi_lifespan import LifespanManager
async with LifespanManager(app):
    ...

# B: drive it directly
async with app.router.lifespan_context(app):
    ...
```

Many teams deliberately do *not* run lifespan in tests, because it constructs a production engine they are about to override. Both are defensible. What is not defensible is not knowing which you are doing.

### 6.2 `TestClient` (Starlette)

Fine for synchronous code. It runs lifespan only when used as a context manager (`with TestClient(app) as c:`); a bare `TestClient(app)` does not. It drives an async app in a worker thread with its own event loop, which is exactly the thing that generates cross-loop errors alongside a session-scoped async engine. For an async app, prefer `AsyncClient`.

### 6.3 A live server

`uvicorn` in a thread plus a real socket. Necessary for WebSockets under load, streaming, or proxy behaviour. Slow, and it makes `dependency_overrides` awkward because server and test live in different contexts. Reserve for a small smoke suite.

---

## Part 7 — Wiring the session in

```python
app.dependency_overrides[get_session] = lambda: session
...
app.dependency_overrides.clear()
```

Three rules.

- **Always clear the overrides in teardown.** A leaked override is a bug that manifests three files away.
- **Override the dependency, not the engine.** Monkeypatching a module-level engine works until something imports it early. Dependency injection is the seam FastAPI gives you.
- **`expire_on_commit=False` is load-bearing, not cosmetic.** With the default `True`, every attribute access after a commit triggers a refresh, which in async code raises `MissingGreenlet` outside an awaited context.

---

## Part 8 — Async traps, in the order you will hit them

**Cross-loop errors (`Task ... attached to a different loop`, `Future attached to a different loop`).** A session-scoped async engine created on one event loop, then used from another.

The subtle part, and the one most write-ups get wrong: pytest-asyncio has **two** loop-scope settings — one for fixtures, one for tests — and they default independently. Setting only the fixture scope to `session` leaves your *tests* on function-scoped loops, so a session-scoped engine still blows up. Set both:

```toml
asyncio_default_fixture_loop_scope = "session"
asyncio_default_test_loop_scope    = "session"
```

The consequence is that all async tests share one event loop for the whole session. That is what you want when a session-scoped engine and pool are in play, and it is the price of a shared engine. If you would rather keep per-test loop isolation, the alternative is a function-scoped engine: slower, simpler to reason about. Measure before assuming it matters.

**Connection pooling across loops.** Even with pinned scopes, pooled connections that outlive a test can bind to stale loop state. `poolclass=NullPool` on the test engine removes an entire class of intermittent, unreproducible failures, at the cost of one connect per checkout — about a millisecond against a local container. Take the trade.

**`MissingGreenlet`.** You touched a lazy-loaded relationship or an expired attribute outside an async context. Use explicit `selectinload`/`joinedload`, set `expire_on_commit=False`, and treat every occurrence as a signal that a query is under-specified rather than an error to suppress. Note also that greenlet is no longer installed with SQLAlchemy by default on the 2.1 line — the `sqlalchemy[asyncio]` extra is mandatory, and an install that omits it fails at import rather than at runtime.

**pytest-asyncio versus anyio.** Pick one. Running both in the same suite produces bewildering fixture-scope interactions. `anyio`'s backend fixtures are a reasonable alternative if you already depend on it.

---

## Part 9 — What to actually assert

Endpoint tests that only assert on the response body are testing your serialiser. Assert on both sides.

```python
async def test_create_widget_persists(client, session):
    r = await client.post("/widgets", json={"name": "gadget"})
    assert r.status_code == 201

    row = (await session.execute(select(Widget))).scalar_one()
    assert row.name == "gadget"
    assert row.created_at is not None      # server default actually fired
```

Things only a real Postgres gives you:

**Constraint violations map to the right status.** The single highest-value test the real database buys, and the one SQLite most reliably fails to reproduce.

```python
async def test_duplicate_name_returns_409(client):
    await client.post("/widgets", json={"name": "gadget"})
    r = await client.post("/widgets", json={"name": "gadget"})
    assert r.status_code == 409          # not a 500 from an unhandled IntegrityError
```

**Rollback on error.** If an endpoint writes two rows and the second fails, assert the first is gone. This tests your transaction boundary, which people get wrong constantly.

**Query counts (N+1 detection).** An N+1 does not fail a test; it degrades production. A query-count assertion is one of the few cheap ways to catch it first.

```python
@pytest.fixture
def query_counter(engine):
    count = 0
    def before(conn, cursor, statement, *args):
        nonlocal count
        count += 1
    event.listen(engine.sync_engine, "before_cursor_execute", before)
    yield lambda: count
    event.remove(engine.sync_engine, "before_cursor_execute", before)
```

Note the `engine.sync_engine` indirection: SQLAlchemy's event system hangs off the sync engine even for async ones.

**Concurrency.** `SELECT ... FOR UPDATE SKIP LOCKED`, optimistic locking, and idempotency keys require *two real connections*, so these tests cannot use the rollback fixture — they need committed data and independent sessions. This is exactly the class of test that mocks and SQLite render impossible.

**Migrations.** `upgrade head` every run, plus the drift assertion from Part 4.

---

## Part 10 — Data setup

Hand-rolled `Widget(name="x", owner_id=1, ...)` in every test is how suites become unmaintainable: add a `NOT NULL` column and forty tests break for no semantic reason.

Use factories — `factory_boy` with `SQLAlchemyModelFactory`, or `polyfactory`, which is Pydantic- and dataclass-aware and derives fields from types. The discipline matters more than the library:

- The factory supplies **every required field with a valid default**; the test overrides only what it asserts on. A pagination test should not mention email addresses.
- Prefer building through the **API or the domain layer** where feasible, so setup exercises real invariants. Insert directly only when you need a state the API cannot reach — which is itself worth noticing.
- Keep sequences deterministic and seed any randomness, or you will get a flake once a month that nobody can reproduce.

**Time.** `freezegun` patches Python, not Postgres. If a column uses `server_default=func.now()`, freezing time in the test has no effect on the value the database writes, which produces baffling near-miss failures. Either inject a clock and use Python-side defaults, or assert on ranges rather than exact instants. Decide deliberately; do not discover it.

---

## Part 11 — Speed

Realistic target for a few hundred endpoint tests: single-digit seconds, plus container start.

| Lever | Typical effect | Note |
|---|---|---|
| Session-scoped container | Removes N × ~2 s | The single biggest win. Non-negotiable. |
| `fsync=off`, `synchronous_commit=off`, `full_page_writes=off` | Large on commit-heavy suites | Catastrophic in production; correct for a throwaway container. |
| Data directory on tmpfs | Further large win on DDL-heavy work | `--tmpfs /var/lib/postgresql/data:rw` |
| Rollback isolation instead of TRUNCATE | ~1–5 ms per test | Only where semantically valid (Part 5.1). |
| `pytest-xdist` + per-worker database | Near-linear to core count | Each worker needs its **own** database. |
| Template-database cloning | Fast reset with full realism | The right answer for parallel suites. |
| Alembic once per session, not per test | Seconds → milliseconds | Pairs with template DBs. |

Those figures are order-of-magnitude, from experience, not benchmarked. If you are going to quote them, measure them on your schema.

**Parallelism requires per-worker databases.** Sharing one database across xdist workers reintroduces exactly the interference the isolation fixtures exist to prevent, and a TRUNCATE from one worker will destroy another's fixtures mid-test. Key off pytest-xdist's `worker_id` fixture and clone from a template.

---

## Part 12 — CI

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18          # match production
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports: ["5432:5432"]
    env:
      TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
    steps:
      - uses: actions/checkout@v4
      - run: pip install -e ".[test]"
      - run: pytest -n auto
```

`TEST_DATABASE_URL` short-circuits the container fixture, so CI uses the service container and developers get testcontainers — from the same conftest.

Note the URL carries **no driver suffix**. The conftest attaches `+asyncpg` or `+psycopg` as needed. This is the same driverless-URL discipline as Part 3.1, and it is what stops driver churn from reaching your CI config.

`pg_isready` can report success before the database is genuinely ready to accept your connection in some configurations. Retry the first connect rather than assuming.

---

## Part 13 — Failure modes, collected

| Symptom | Cause | Fix |
|---|---|---|
| `Task/Future attached to a different loop` | Fixture and test loop scopes not *both* pinned | Set both `asyncio_default_fixture_loop_scope` and `asyncio_default_test_loop_scope` |
| Intermittent `InterfaceError: connection is closed` | Pooled connection outliving a loop | `poolclass=NullPool` on the test engine |
| `MissingGreenlet` on attribute access | Lazy load / expired attribute outside async context | `expire_on_commit=False`, explicit `selectinload` |
| ImportError / greenlet missing at startup | greenlet no longer auto-installs (SQLAlchemy 2.1+) | Install `sqlalchemy[asyncio]` |
| Test writes visible to the next test | Endpoint commits on its own session/engine | TRUNCATE isolation, not rollback |
| Test hangs, then times out | Background task blocked on a lock held by the test's open transaction | TRUNCATE isolation; never rollback + `create_task` |
| `app.state.x is None` | `ASGITransport` does not run lifespan | `LifespanManager` or `app.router.lifespan_context` |
| Duplicate insert returns 500, not 409 | Unhandled `IntegrityError` | You only found this because you tested on real Postgres. Point proven. |
| Frozen time has no effect on `created_at` | `server_default=now()` runs in Postgres, not Python | Python-side default, or assert on a range |
| Passes locally, fails in CI | Different Postgres major, or a stale local volume | Pin the version; never reuse a volume |
| Flaky ordering assertions | `SELECT` without `ORDER BY` | Postgres does not promise insertion order |

---

## Part 14 — The version surface

**This is the only part of the article expected to rot.** Everything above is structural. Below is the state of the ecosystem in **July 2026**, and what changes if it moves.

| Component | State, July 2026 | What it constrains here | If it moves |
|---|---|---|---|
| **PostgreSQL** | 18.4 stable; 19 in beta, GA expected around September/October 2026. 14 leaves support in November 2026. | The `PG_IMAGE` constant. | Bump one constant. Match production, not the newest. |
| **SQLAlchemy** | 2.0.x is the stable line; 2.1 is in beta. | `join_transaction_mode="create_savepoint"` (2.0+, unchanged in 2.1). | The isolation recipe is stable across 2.0 → 2.1. Two 2.1 changes matter: **greenlet no longer auto-installs** (so `sqlalchemy[asyncio]` is mandatory), and session autoflush becomes unconditional. |
| **pytest-asyncio** | 1.4.x. Requires pytest ≥ 8.4. The old `event_loop` fixture is **gone**, not merely deprecated. | Both loop-scope settings in Part 8. | Fixture loop scope currently defaults to the *fixture's* scope when unset, and warns; upstream intends to default it to `function`. Set both options explicitly and the change is a no-op for you. |
| **httpx** | 0.28.x. `AsyncClient(app=...)` deprecated since 0.27. | The explicit `ASGITransport` form. | Already on the non-deprecated form; nothing to do. |
| **testcontainers-python** | 4.14.x. Install via `testcontainers[postgres]`; the old `testcontainers-postgres` distribution is unsupported from 4.0. `driver=None` yields a driverless URL. | The `pg_url` fixture. | The driverless-URL pattern means driver churn never reaches your conftest. |
| **Alembic** | Stable; `command.upgrade` still synchronous. | The sync-URL helper. | If you move to an async `env.py`, drop the helper. |

### Re-verifying this yourself

Do not trust the table; it has a shelf life. Run this:

```bash
pip list --outdated | grep -Ei 'sqlalchemy|pytest-asyncio|httpx|testcontainers|alembic|asyncpg'
python -c "import sqlalchemy, httpx, pytest_asyncio; \
  print(sqlalchemy.__version__, httpx.__version__, pytest_asyncio.__version__)"
pytest -W error::DeprecationWarning -q
```

Running the suite with `-W error::DeprecationWarning` in CI is the single most effective future-proofing measure available. Deprecations are the ecosystem announcing, in advance and in writing, which of your assumptions is about to stop being true. Treat them as failures and Part 14 becomes something your CI maintains for you.

### Design rules that make version churn cheap

These are why the conftest below is shaped as it is.

1. **One constant per external version.** `PG_IMAGE` lives at the top of the conftest, not scattered through fixtures.
2. **Driverless URLs at every boundary.** Environment variables, testcontainers, and CI config carry no `+asyncpg`. Drivers are attached at the point of use, by one helper. Driver churn then touches one function.
3. **Two isolation fixtures, not one.** `session` (rollback) and `committing_session` (TRUNCATE). The first is an optimisation; the second is the semantically honest fallback. Tests declare which they need, so a change in the app's transaction handling relocates individual tests rather than breaking the suite.
4. **Configuration stated explicitly in `pyproject.toml`, even where it matches the current default.** Explicit settings are immune to default changes.
5. **Migrations as the schema source of truth**, with a drift assertion. The suite then catches model/migration divergence rather than encoding it.

---

## Appendix — Complete `conftest.py`

```python
import os
from collections.abc import AsyncIterator, Iterator

import pytest
from alembic import command
from alembic.config import Config
from httpx import ASGITransport, AsyncClient
from sqlalchemy import NullPool, text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from testcontainers.postgres import PostgresContainer

from app.db import Base, get_session
from app.main import app

# ---- The one version constant. Match production. --------------------------
PG_IMAGE = "postgres:18-alpine"

# Catastrophic in production; correct for a container whose data is disposable.
PG_FAST = (
    "postgres -c fsync=off -c synchronous_commit=off "
    "-c full_page_writes=off -c max_connections=200"
)


# ---- Driverless URLs everywhere; drivers attached here, once. --------------

def _with_driver(url: str, driver: str) -> str:
    """postgresql://... -> postgresql+{driver}://..."""
    scheme, _, rest = url.partition("://")
    base = scheme.split("+", 1)[0]          # strip any driver already present
    return f"{base}+{driver}://{rest}"


def async_url(url: str) -> str:
    return _with_driver(url, "asyncpg")


def sync_url(url: str) -> str:
    return _with_driver(url, "psycopg")     # Alembic runs synchronously


# ---- Provisioning ---------------------------------------------------------

@pytest.fixture(scope="session")
def pg_url() -> Iterator[str]:
    """A driverless postgresql:// URL, from CI or from a container."""
    if url := os.getenv("TEST_DATABASE_URL"):
        yield url
        return

    with PostgresContainer(PG_IMAGE, driver=None).with_command(PG_FAST) as pg:
        yield pg.get_connection_url()


# ---- Schema ---------------------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
def migrate(pg_url: str) -> None:
    cfg = Config("alembic.ini")
    cfg.set_main_option("sqlalchemy.url", sync_url(pg_url))
    command.upgrade(cfg, "head")


@pytest.fixture(scope="session")
async def engine(pg_url: str, migrate: None):
    eng = create_async_engine(async_url(pg_url), poolclass=NullPool)
    yield eng
    await eng.dispose()


# ---- Isolation: tests pick one --------------------------------------------

@pytest.fixture
async def session(engine) -> AsyncIterator[AsyncSession]:
    """Rollback isolation. Valid ONLY if every write uses this session."""
    conn = await engine.connect()
    trans = await conn.begin()

    maker = async_sessionmaker(
        bind=conn,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    async with maker() as s:
        yield s

    await trans.rollback()
    await conn.close()


@pytest.fixture
async def committing_session(engine) -> AsyncIterator[AsyncSession]:
    """Real commits. For background tasks, concurrency, LISTEN/NOTIFY."""
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as s:
        yield s

    tables = ", ".join(f'"{t.name}"' for t in Base.metadata.sorted_tables)
    async with engine.begin() as conn:
        await conn.execute(
            text(f"TRUNCATE TABLE {tables} RESTART IDENTITY CASCADE")
        )


# ---- Client ---------------------------------------------------------------

@pytest.fixture
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_session] = lambda: session
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c
    app.dependency_overrides.clear()
```

`pyproject.toml`:

```toml
[project.optional-dependencies]
test = [
    "pytest>=8.4",                 # required by pytest-asyncio 1.4+
    "pytest-asyncio>=1.4",
    "pytest-xdist",
    "httpx>=0.28",
    "testcontainers[postgres]>=4.14",
    "sqlalchemy[asyncio]>=2.0",    # the [asyncio] extra is mandatory from 2.1
    "asyncpg",
    "psycopg[binary]",             # Alembic runs sync
    "alembic",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
asyncio_default_fixture_loop_scope = "session"
asyncio_default_test_loop_scope = "session"
filterwarnings = [
    "error::DeprecationWarning",   # the ecosystem will tell you when this rots
]
markers = [
    "commits: requires real commit semantics (use committing_session)",
]
```

---

## Closing

The choice between a real Postgres, SQLite, and a mocked repository is not a choice about speed. It is a choice about what your test suite is evidence of. A mocked repository is evidence about your controller. SQLite is evidence about a database you do not run. A real Postgres, with migrations applied and constraints enforced, is evidence about the system you deploy.

Testcontainers made that evidence cheap. The remaining reasons to avoid it are habit and tutorial inertia.
