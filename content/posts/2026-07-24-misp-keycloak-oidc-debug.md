---
title: 'MISP + Keycloak OIDC Redirect Failure — K8s Debugging Playbook'
date: '2026-07-24'
status: published
privacy: public
lang: en
tags:
  - misp
  - keycloak
  - oidc
  - kubernetes
  - metallb
  - coredns
  - dns
  - debugging
  - sre
  - troubleshooting
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  A hypothetico-deductive debugging playbook for MISP breaking on Keycloak OIDC
  redirect in a Kubernetes cluster that uses MetalLB but has no DNS server for
  external hostnames. Walks the OIDC call chain from the confirmed DNS failure
  outward — hostAliases vs CoreDNS hosts plugin vs internal service URL — with
  ready-to-run kubectl one-liners for every phase, plus follow-on phases for
  TLS trust, PHP session loss, invalid_grant, and MetalLB hairpin issues.
---

# MISP + Keycloak OIDC Redirect Failure — K8s Debugging Playbook

## Playbook Metadata

| Field | Value |
|-------|-------|
| **Symptom** | MISP breaks on Keycloak redirect. Login loop after IdP authentication. |
| **Confirmed error** | `certmichelin/openid-connect-php exception.php line 2106` — `php_network_getaddresses: getaddrinfo: Temporary failure in name resolution` |
| **Root cause (confirmed)** | DNS resolution failure from inside the MISP pod. No DNS server in the cluster — MetalLB only. |
| **Infra** | Kubernetes, MetalLB (no cluster DNS for external hostnames), Keycloak + MISP exposed via MetalLB LB IPs |
| **Methodology** | Google SRE Ch.12 Effective Troubleshooting (hypothetico-deductive), Scoutflo events-first playbook structure |

---

## How to use this playbook

This playbook is designed for a human operator or an AI agent with `kubectl` access. Follow phases in order. Each phase has:

- **Goal**: what we're trying to establish
- **Commands**: exact commands to run (replace `<placeholders>`)
- **Expected output**: what you should see if the hypothesis holds
- **Decision**: what to do based on the result
- **Notes field**: write your actual output here for the record

Per Google SRE: take notes of every test result, including negative results. A test that shows something is NOT the problem is as valuable as finding the problem.

---

## Required context (fill in before starting)

```
MISP_NAMESPACE=<namespace>
MISP_WORKLOAD=<kind/name>             # e.g. deploy/misp, statefulset/misp, sts/misp-core
KEYCLOAK_NAMESPACE=<namespace>
KEYCLOAK_WORKLOAD=<kind/name>         # e.g. deploy/keycloak, statefulset/keycloak
KEYCLOAK_HOSTNAME=<external-hostname> # e.g. keycloak.example.org
KEYCLOAK_METALLB_IP=<IP>              # MetalLB LoadBalancer IP for Keycloak
MISP_HOSTNAME=<external-hostname>     # e.g. misp.example.org
MISP_METALLB_IP=<IP>                  # MetalLB LoadBalancer IP for MISP
KEYCLOAK_REALM=<realm-name>           # e.g. MISP, master
```

### StatefulSet vs Deployment

Every `kubectl exec` and `kubectl logs` command in this playbook targets a workload by short name. In this document that's written as `deploy/${MISP_DEPLOY}` for readability, but **substitute your actual workload kind** — `statefulset/<name>` (or `sts/<name>`) if MISP or Keycloak is deployed as a StatefulSet (common: MISP with persistent MySQL/files volume, Keycloak in HA mode).

Substitution map:

| Playbook writes | If Deployment | If StatefulSet |
|-----------------|---------------|----------------|
| `deploy/${MISP_DEPLOY}` | `deploy/misp` | `sts/misp` or `statefulset/misp` |
| `kubectl rollout restart deploy/X` | same | `kubectl rollout restart statefulset/X` |
| Pod targeting `-l app=X` | same | same (labels are workload-agnostic) |

**Two things change with a StatefulSet:**
1. **Pod names are ordinal and stable** (`misp-0`, `misp-1`, …) — you can target a specific replica with `kubectl exec misp-0 -n ${MISP_NAMESPACE}` when needed.
2. **`hostAliases` and DNS fixes apply to every pod in the set** — but a rollout of a StatefulSet is sequential (pod by pod), not parallel. Expect the fix to take longer to propagate across replicas, and if `podManagementPolicy: OrderedReady`, a wedged pod-0 blocks the rest.

**One thing that does NOT change:** DNS resolution behavior. CoreDNS, `/etc/resolv.conf`, and MetalLB hairpinning behave identically for pods regardless of their owning workload. The root cause and fixes in Phase 1–2 are the same.

---

## Phase 0 — Triage (stop the bleeding)

**Goal:** Ensure the system is still reachable and the failure isn't cascading.

> "Your first response in a major outage may be to start troubleshooting and try to find a root cause as quickly as possible. Ignore that instinct! Make the system work as well as it can under the circumstances." — Google SRE Ch.12

### 0.1 — Can users still access MISP at all?

```bash
curl -sI https://${MISP_HOSTNAME} | head -5
```

**Expected:** HTTP 200 or 302 redirect to login page. If timeout or connection refused, the problem is bigger than OIDC.

### 0.2 — Is the Keycloak UI accessible?

```bash
curl -sI https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM} | head -5
```

**Expected:** HTTP 200 with JSON realm metadata.

### 0.3 — Emergency workaround (if login is completely blocked)

If OIDC is the only auth method and nobody can log in, disable it temporarily:

```bash
# Exec into the MISP pod and switch to mixed auth or disable OIDC
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  grep -q 'OidcAuth.Oidc' /var/www/MISP/app/Config/config.php && echo 'OIDC is active'
"
```

If using Docker env vars, set `OIDC_MIXEDAUTH=true` and restart the pod. This keeps OIDC available but also shows a local login form.

If config.php is directly editable:

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  sed -i \"s/'auth' => array('OidcAuth.Oidc')/'auth' => array()/\" /var/www/MISP/app/Config/config.php
"
```

**Note:** This is a temporary measure. Document that you did this.

---

## Phase 1 — Confirm the hypothesis: DNS resolution failure

**Goal:** Prove that the MISP pod cannot resolve the Keycloak hostname.

This is the primary hypothesis based on the error log: `php_network_getaddresses: getaddrinfo: Temporary failure in name resolution`.

### 1.1 — Test DNS resolution from inside the MISP pod

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  getent hosts ${KEYCLOAK_HOSTNAME} || echo 'DNS_FAILED'
"
```

**Expected if hypothesis is correct:** `DNS_FAILED`
**Expected if hypothesis is wrong:** An IP address line (e.g. `10.0.0.5  keycloak.example.org`)

**Record result:**
```
# RESULT:
```

### 1.2 — Check what DNS server the pod is using

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- cat /etc/resolv.conf
```

**Expected:** Points to CoreDNS ClusterIP (typically `10.96.0.10` or similar). No external DNS entries.

**Record result:**
```
# RESULT:
```

### 1.3 — Check if CoreDNS is running

```bash
kubectl get pods -n kube-system -l k8s-app=kube-dns
```

**Expected:** CoreDNS pods in `Running` state. If not, DNS is broken cluster-wide — separate problem.

### 1.4 — Test what CoreDNS can resolve

```bash
# Internal service name (should work)
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  nslookup kubernetes.default.svc.cluster.local
"

# External hostname (likely fails)
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  nslookup ${KEYCLOAK_HOSTNAME}
"

# Public hostname for comparison (should work if CoreDNS forwards to public DNS)
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  nslookup google.com
"
```

**Decision tree:**

| Internal | Keycloak | google.com | Diagnosis |
|----------|----------|------------|-----------|
| OK | FAIL | OK | Keycloak hostname is internal-only, not in public DNS. CoreDNS can't resolve it. → **Go to Phase 2** |
| OK | FAIL | FAIL | CoreDNS has no upstream forwarder at all. → **Fix CoreDNS forwarding first** |
| OK | OK | OK | DNS works. Hypothesis is wrong. → **Go to Phase 3 (other causes)** |
| FAIL | FAIL | FAIL | CoreDNS is broken. → **Fix CoreDNS before proceeding** |

**Record results:**
```
# Internal:
# Keycloak:
# google.com:
# Diagnosis:
```

### 1.5 — Check CoreDNS configuration

```bash
kubectl -n kube-system get configmap coredns -o yaml
```

**Look for:** The `forward` directive. Typical default: `forward . /etc/resolv.conf` or `forward . 8.8.8.8 8.8.4.4`. Neither of these know about your internal MetalLB hostnames.

**Record result:**
```
# Forward directive:
```

---

## Phase 2 — Fix: Make Keycloak hostname resolvable from MISP pod

**Goal:** The MISP pod must be able to resolve `${KEYCLOAK_HOSTNAME}` to an IP it can reach.

Choose ONE of the following approaches. They are listed from fastest/least invasive to most correct/most maintainable.

### Option A — hostAliases on the MISP Deployment (fastest, pod-scoped)

Writes directly to the pod's `/etc/hosts`. No cluster-wide impact.

```bash
kubectl patch deploy ${MISP_DEPLOY} -n ${MISP_NAMESPACE} --type='json' -p='[
  {
    "op": "add",
    "path": "/spec/template/spec/hostAliases",
    "value": [
      {
        "ip": "'${KEYCLOAK_METALLB_IP}'",
        "hostnames": ["'${KEYCLOAK_HOSTNAME}'"]
      }
    ]
  }
]'
```

**Verify:** Wait for the pod to restart, then:

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  getent hosts ${KEYCLOAK_HOSTNAME}
"
```

**Expected:** Returns `${KEYCLOAK_METALLB_IP}  ${KEYCLOAK_HOSTNAME}`

**Limitation:** Only fixes it for the MISP pod. Any other pod that needs to reach Keycloak by hostname needs the same patch.

### Option B — CoreDNS hosts plugin (cluster-wide, recommended)

Adds static DNS records to CoreDNS so every pod in the cluster can resolve MetalLB hostnames.

**Step 1 — Edit the CoreDNS ConfigMap:**

```bash
kubectl -n kube-system edit configmap coredns
```

**Step 2 — Add a `hosts` block BEFORE the `kubernetes` block:**

```
.:53 {
    errors
    health
    ready
    hosts {
        ${KEYCLOAK_METALLB_IP}  ${KEYCLOAK_HOSTNAME}
        ${MISP_METALLB_IP}      ${MISP_HOSTNAME}
        fallthrough
    }
    kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
    }
    forward . 8.8.8.8 8.8.4.4
    cache 30
    loop
    reload
    loadbalance
}
```

**Critical:** The `fallthrough` after `hosts` is mandatory. Without it, CoreDNS stops processing after the hosts block and `*.svc.cluster.local` resolution breaks.

**Step 3 — Restart CoreDNS:**

```bash
kubectl rollout restart -n kube-system deploy/coredns
```

**Step 4 — Verify from the MISP pod:**

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  nslookup ${KEYCLOAK_HOSTNAME}
"
```

**Expected:** Resolves to `${KEYCLOAK_METALLB_IP}`.

**Advantage:** Every pod in the cluster can now resolve your MetalLB services. Add new entries as you add services.

### Option C — Internal service URL (if Keycloak is on the same cluster)

Point MISP's `provider_url` at Keycloak's Kubernetes service name directly, bypassing external DNS and MetalLB entirely.

**Step 1 — Find Keycloak's internal service:**

```bash
kubectl get svc -n ${KEYCLOAK_NAMESPACE}
```

**Step 2 — Update MISP's OIDC config to use the internal URL:**

```php
'provider_url' => 'http://keycloak-service.${KEYCLOAK_NAMESPACE}.svc.cluster.local:8080/realms/${KEYCLOAK_REALM}/',
'issuer' => 'https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/',
```

The `issuer` must remain the public URL because Keycloak signs tokens with that issuer, and the OIDC library validates it. The `provider_url` is where MISP fetches the discovery document and exchanges tokens — this can be internal.

**Caveat:** If Keycloak's internal service only listens on HTTPS, you need TLS trust configured inside the MISP pod too. If it listens on HTTP internally (common with TLS-terminating ingress), this is simpler.

---

## Phase 3 — Verify: Test the full OIDC flow after DNS fix

**Goal:** Confirm that fixing DNS resolved the OIDC redirect failure.

### 3.1 — Test server-side connectivity to Keycloak token endpoint

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  curl -sv https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration 2>&1 | head -30
"
```

**Expected:** HTTP 200 with JSON discovery document. If you see `SSL certificate problem`, go to Phase 4. If you see `Connection refused`, the MetalLB IP is reachable but the port/service is wrong.

**Record result:**
```
# RESULT:
```

### 3.2 — Test from a browser

Open an incognito/private window (to avoid stale cookies):

1. Navigate to `https://${MISP_HOSTNAME}`
2. Should redirect to Keycloak login
3. Authenticate
4. Should redirect back to MISP and show the dashboard

If it still fails, check MISP logs:

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  tail -50 /var/www/MISP/app/tmp/logs/error.log
"
```

### 3.3 — Decision based on new error

| New error | Next phase |
|-----------|------------|
| `curl error 60: SSL certificate problem` | Phase 4 — TLS trust |
| `State is not set in session` | Phase 5 — PHP session |
| `invalid_grant` | Phase 6 — Code exchange |
| `Connection refused` / `Connection timed out` | Phase 7 — Network path |
| No error, but redirect loop continues | Phase 5 — PHP session |
| It works | Phase 8 — Cleanup and prevention |

---

## Phase 4 — TLS trust (if curl error 60)

**Goal:** Make the MISP pod trust Keycloak's TLS certificate.

### 4.1 — Diagnose what the TLS error is

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  echo | openssl s_client -connect ${KEYCLOAK_HOSTNAME}:443 \
    -servername ${KEYCLOAK_HOSTNAME} \
    -CAfile /etc/ssl/certs/ca-certificates.crt 2>/dev/null \
    | grep 'Verify return code'
"
```

**Expected if problem:** `Verify return code: 21 (unable to verify the first certificate)` or similar non-zero code.

### 4.2 — Check what PHP curl uses for CA trust

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  php -i 2>/dev/null | grep -iE 'curl.cainfo|openssl.cafile'
"
```

**Expected:** Both empty (no value). This means PHP curl uses the system bundle at `/etc/ssl/certs/ca-certificates.crt`.

### 4.3 — Fix: Mount your CA certificate

If Keycloak uses a self-signed cert or internal CA, create a K8s secret with the CA cert and mount it:

```bash
# Create secret from your CA cert file
kubectl create secret generic keycloak-ca \
  -n ${MISP_NAMESPACE} \
  --from-file=keycloak-ca.crt=/path/to/your/ca.crt
```

Then patch the MISP deployment to mount it and run `update-ca-certificates`:

```yaml
# Add to the deployment spec
volumes:
  - name: keycloak-ca
    secret:
      secretName: keycloak-ca
containers:
  - name: misp
    volumeMounts:
      - name: keycloak-ca
        mountPath: /usr/local/share/ca-certificates/keycloak-ca.crt
        subPath: keycloak-ca.crt
        readOnly: true
```

**Important:** One cert per file. Do NOT concatenate root + intermediate into one .crt file. `update-ca-certificates` silently skips bundles.

If the misp-docker image runs `update-ca-certificates` on startup (it does), the CA will be trusted on next pod restart. If not, add an init container:

```yaml
initContainers:
  - name: update-certs
    image: <same-misp-image>
    command: ["update-ca-certificates"]
    volumeMounts:
      - name: keycloak-ca
        mountPath: /usr/local/share/ca-certificates/keycloak-ca.crt
        subPath: keycloak-ca.crt
```

### 4.4 — Verify TLS trust after fix

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  echo | openssl s_client -connect ${KEYCLOAK_HOSTNAME}:443 \
    -servername ${KEYCLOAK_HOSTNAME} \
    -CAfile /etc/ssl/certs/ca-certificates.crt 2>/dev/null \
    | grep 'Verify return code'
"
```

**Expected:** `Verify return code: 0 (ok)`

Then go back to **Phase 3.1** and re-test.

---

## Phase 5 — PHP session loss (if "State is not set in session" or silent redirect loop)

**Goal:** Determine why the OIDC state nonce is lost between redirect and callback.

### 5.1 — Check PHP session configuration

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  php -i 2>/dev/null | grep -E 'session\.(save_handler|save_path|cookie_secure|cookie_samesite|cookie_domain)'
"
```

**Record result:**
```
# save_handler:
# save_path:
# cookie_secure:
# cookie_samesite:
# cookie_domain:
```

### 5.2 — If using Redis sessions, test Redis connectivity

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  php -r \"
    \\\$r = new Redis();
    var_dump(\\\$r->connect('redis-host', 6379));
    echo 'Redis OK';
  \" 2>&1
"
```

### 5.3 — Check if session cookie is set with Secure flag behind TLS-terminating proxy

If MISP is behind an ingress that terminates TLS, PHP may see HTTP (not HTTPS) and set `Secure=false` on the session cookie. The browser then drops it on the HTTPS redirect back from Keycloak.

**Fix options:**

```bash
# Option A: Set session.cookie_secure in php.ini
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  echo 'session.cookie_secure = 1' >> /etc/php/8.3/fpm/conf.d/99-session.ini
  # or for apache mod_php:
  echo 'session.cookie_secure = 1' >> /etc/php/8.3/apache2/conf.d/99-session.ini
"

# Option B: Ensure the proxy sends X-Forwarded-Proto
# Check your ingress annotations or nginx config
```

### 5.4 — Workaround: Enable mixedAuth

```bash
# If using env vars
# Set OIDC_MIXEDAUTH=true in the deployment

# If using config.php directly:
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  grep -q 'mixedAuth' /var/www/MISP/app/Config/config.php && echo 'mixedAuth already set' || echo 'mixedAuth not configured'
"
```

Setting `mixedAuth` to `true` prevents the auto-redirect to Keycloak on first visit. Instead, the login page loads first (establishing a PHP session), then the user clicks "Login with SSO". This avoids the session-not-initialized race condition (MISP #10391).

---

## Phase 6 — Code exchange failure (if "invalid_grant")

**Goal:** Determine why Keycloak rejects the authorization code.

### 6.1 — Check time synchronization

Authorization codes are time-bounded (default 60s in Keycloak). Clock skew between MISP and Keycloak pods causes `invalid_grant`.

```bash
# Check time on both pods
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- date
kubectl exec -it deploy/${KEYCLOAK_DEPLOY} -n ${KEYCLOAK_NAMESPACE} -- date
date  # your local machine for reference
```

**Expected:** All within a few seconds of each other.

### 6.2 — Check redirect_uri mismatch

The `redirect_uri` in the token exchange request must exactly match what was sent in the authorization request. Common mismatches: scheme (http vs https), trailing slash, port.

```bash
# Check what MISP is configured to send
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  grep -A5 'redirect_uri\|provider_url' /var/www/MISP/app/Config/config.php
"

# Check what Keycloak expects
# In Keycloak admin UI: Clients → <misp-client> → Valid Redirect URIs
```

### 6.3 — Check for code replay (redirect loop causing reuse)

If the browser is in a redirect loop, the authorization code gets sent multiple times. Keycloak invalidates a code after first use. Check Keycloak logs:

```bash
kubectl logs deploy/${KEYCLOAK_DEPLOY} -n ${KEYCLOAK_NAMESPACE} --tail=50 | grep -i "invalid\|error\|code"
```

---

## Phase 7 — Network path (if Connection refused/timed out after DNS works)

**Goal:** Determine if the MISP pod can reach the Keycloak MetalLB IP on the right port.

### 7.1 — Test raw TCP connectivity

```bash
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "
  timeout 5 sh -c 'echo > /dev/tcp/${KEYCLOAK_METALLB_IP}/443' 2>&1 && echo 'TCP OK' || echo 'TCP FAILED'
"
```

### 7.2 — Check for NetworkPolicy blocking egress

```bash
kubectl get networkpolicy -n ${MISP_NAMESPACE}
kubectl get networkpolicy -n ${MISP_NAMESPACE} -o yaml  # if any exist
```

**Look for:** Egress rules that might block traffic to MetalLB IPs.

### 7.3 — If using Cilium, check flow logs

```bash
# If hubble is available
hubble observe --namespace ${MISP_NAMESPACE} --type=drop
hubble observe --namespace ${MISP_NAMESPACE} --to-ip ${KEYCLOAK_METALLB_IP}
```

### 7.4 — Hairpin / loopback issue

MetalLB LoadBalancer IPs may not be reachable from inside the cluster (hairpinning). This depends on your CNI and MetalLB mode (L2 vs BGP).

```bash
# Test from a debug pod
kubectl run debug-dns --rm -it --image=busybox --restart=Never -- sh -c "
  wget -qO- --timeout=5 https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/ 2>&1 | head -5
"
```

If MetalLB L2 mode can't hairpin, Option C from Phase 2 (internal service URL) is the correct fix.

---

## Phase 8 — Cleanup, documentation, and prevention

**Goal:** Make the fix permanent, document what happened, and prevent recurrence.

### 8.1 — Make the fix persistent

If you used `hostAliases` or CoreDNS edits, ensure they're in your GitOps / Helm / Kustomize manifests, not just applied imperatively.

### 8.2 — Add a smoke test

Create a CronJob or monitoring probe that tests OIDC connectivity from inside the cluster:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: misp-oidc-connectivity-check
  namespace: ${MISP_NAMESPACE}
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: check
              image: curlimages/curl:latest
              command:
                - sh
                - -c
                - |
                  curl -sf https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration > /dev/null \
                    && echo "OIDC endpoint OK" \
                    || (echo "OIDC endpoint UNREACHABLE" && exit 1)
          restartPolicy: Never
  failedJobsHistoryLimit: 3
  successfulJobsHistoryLimit: 1
```

### 8.3 — Document the incident

```
## Post-incident summary

**Symptom:** MISP login via Keycloak OIDC fails with redirect loop.
**Error:** php_network_getaddresses: getaddrinfo: Temporary failure in name resolution
**Root cause:** No DNS records for MetalLB-exposed services. CoreDNS only resolves
  *.svc.cluster.local and forwards unknown queries to public DNS (8.8.8.8), which
  has no knowledge of internal hostnames.
**Fix applied:** [hostAliases / CoreDNS hosts plugin / internal service URL]
**Secondary issues encountered:** [TLS trust / session loss / none]
**Prevention:** [CoreDNS hosts entries in GitOps, connectivity smoke test CronJob]
**Time to resolution:** ___
**Date:** ___
```

---

## Appendix A — Quick reference: all diagnostic one-liners

```bash
# DNS resolution from MISP pod
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- getent hosts ${KEYCLOAK_HOSTNAME}

# Pod DNS config
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- cat /etc/resolv.conf

# CoreDNS config
kubectl -n kube-system get configmap coredns -o yaml

# OIDC discovery endpoint from MISP pod
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- curl -s https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration | head -5

# TLS verification from MISP pod
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- sh -c "echo | openssl s_client -connect ${KEYCLOAK_HOSTNAME}:443 -servername ${KEYCLOAK_HOSTNAME} -CAfile /etc/ssl/certs/ca-certificates.crt 2>/dev/null | grep 'Verify return code'"

# PHP session config
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- php -i 2>/dev/null | grep -E 'session\.(save_handler|save_path|cookie_secure)'

# PHP CA trust config
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- php -i 2>/dev/null | grep -iE 'curl.cainfo|openssl.cafile'

# MISP error log
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- tail -50 /var/www/MISP/app/tmp/logs/error.log

# MISP debug log
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- tail -50 /var/www/MISP/app/tmp/logs/debug.log

# MISP OIDC config
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- grep -A30 "'OidcAuth'" /var/www/MISP/app/Config/config.php

# Keycloak logs
kubectl logs deploy/${KEYCLOAK_DEPLOY} -n ${KEYCLOAK_NAMESPACE} --tail=50

# Time sync check
kubectl exec -it deploy/${MISP_DEPLOY} -n ${MISP_NAMESPACE} -- date; kubectl exec -it deploy/${KEYCLOAK_DEPLOY} -n ${KEYCLOAK_NAMESPACE} -- date

# NetworkPolicy check
kubectl get networkpolicy -n ${MISP_NAMESPACE} -o yaml

# MetalLB hairpin test
kubectl run debug-net --rm -it --image=curlimages/curl --restart=Never -- curl -svk https://${KEYCLOAK_HOSTNAME}/realms/${KEYCLOAK_REALM}/ 2>&1 | head -20
```

---

## Appendix B — Known MISP+Keycloak OIDC bugs (from GitHub)

| Issue | Summary | Status | Your risk |
|-------|---------|--------|-----------|
| MISP #10391 | "State is not set in session" when MISP is first app visited | Open, assigned | High — if Phase 5 is reached |
| MISP #9647 | Redirect loop, query params lost. Config had `'Sessioon'` typo | Closed unresolved | Medium — check for typos |
| MISP #10276 | Logs say "logged in" but GUI shows login form. Dual auth (mod_auth_openidc + OidcAuth) | Closed | Medium — don't mix auth methods |
| MISP #9550 | CurlClient.php proxy bug, ignores proxy settings | Fixed | Low — unless behind corp proxy on old MISP |
| misp-docker #235 | "Plugin OidcAuth could not be found" | Open | Low — different error than ours |

---

## Appendix C — OIDC call chain reference

```
[Browser]
  │
  ├─ GET https://misp.example.org/
  │  └─ 302 → /users/login
  │     └─ 302 → https://keycloak.example.org/realms/R/protocol/openid-connect/auth
  │              ?client_id=misp&redirect_uri=https://misp.example.org/users/login&state=XXXX
  │
  ├─ [User authenticates on Keycloak]
  │
  └─ 302 → https://misp.example.org/users/login?code=YYYY&state=XXXX
     │
     [MISP PHP — server-side, not visible to browser]
     │
     ├─ 1. Validate state from $_SESSION          ← fails if session lost (Phase 5)
     ├─ 2. Fetch .well-known/openid-configuration ← fails if DNS broken (Phase 1) ← YOU ARE HERE
     ├─ 3. POST to token endpoint (code → token)  ← fails if TLS broken (Phase 4)
     ├─ 4. Validate ID token (issuer, signature)
     ├─ 5. Extract user claims (email, roles, org)
     └─ 6. Create/update MISP user, set session
```

---

## Appendix D — Methodology notes

This playbook applies:

**Google SRE Ch.12 (Effective Troubleshooting):** Hypothetico-deductive method. We start with an observed symptom and a confirmed error message, form a hypothesis (DNS failure), test it with the simplest possible command (`getent hosts`), and branch based on the result. Each phase tests one hypothesis before moving to the next. Negative results are documented.

**"Divide and conquer":** The OIDC flow crosses 6 boundaries (browser → ingress → Keycloak → browser → ingress → MISP PHP → Keycloak token endpoint). We walk the stack from the confirmed failure point (step 2 in the call chain) outward, not from the user-visible symptom.

**"What touched it last":** Phase 0 asks about recent changes. The MetalLB-without-DNS setup is a pre-existing condition, not a recent change — this is likely a first-time OIDC setup, not a regression.

**Scoutflo events-first approach:** Each phase checks events and state before diving into configuration. Commands are ordered: observe → diagnose → fix → verify.

**IITF six-phase framework:** Identify (Phase 0-1) → Diagnose (Phase 1) → Resolve (Phase 2) → Verify (Phase 3) → Escalate to next layer if needed (Phase 4-7) → Prevent (Phase 8).
