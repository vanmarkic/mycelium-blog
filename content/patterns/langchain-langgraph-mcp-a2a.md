---
title: 'LangChain, LangGraph, MCP & A2A — Document de Référence'
date: '2026-07-15'
status: published
privacy: public
lang: fr
tags:
  - langchain
  - langgraph
  - mcp
  - a2a
  - ai-agents
  - llm-orchestration
  - model-context-protocol
  - agent-to-agent
repos: []
skills: []
patterns:
  - ai-agent-orchestration
relatedTo: []
description: >-
  Vue d'ensemble de la pile agentique moderne : LangChain pour les briques
  applicatives, LangGraph pour l'orchestration par graphe, MCP pour l'accès
  aux outils, et A2A pour la communication inter-agents.
---

## Vue d'ensemble : la pile complète

```
Plus proche du code ◄──────────────────────────────────► Plus proche du réseau

LangChain          LangGraph            MCP                   A2A
(briques)         (orchestration)    (agent → outils)     (agent → agent)
in-process         in-process        protocole local      protocole réseau
ton code           ton graphe        JSON-RPC / stdio     JSON-RPC / HTTPS
```

| Couche | Technologie | Créateur | Rôle |
|--------|-------------|----------|------|
| Composants applicatifs | LangChain v1.0 | LangChain Inc. | Interfaces standardisées pour LLMs, prompts, mémoire, outils, retrieval |
| Orchestration d'agents | LangGraph v1.1 | LangChain Inc. | Machine à états finie pour agents — graphe orienté avec état typé |
| Accès aux outils | MCP (Model Context Protocol) | Anthropic → Linux Foundation | Protocole standardisé agent → outils/données externes |
| Communication inter-agents | A2A (Agent-to-Agent) | Google → Linux Foundation | Protocole standardisé agent → agent, cross-vendor, cross-framework |

---

## 1. Fondamentaux : l'appel LLM brut

Un appel à un LLM est un `POST` HTTP. Stateless par nature.

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [
      { role: "user", content: "Explique le event loop Node.js" }
    ]
  })
});
const data = await response.json();
// data.content[0].text → la réponse
```

**Propriétés fondamentales :**

- Aucune mémoire côté serveur — chaque requête est indépendante.
- Pour une conversation multi-tour, le client doit renvoyer tout l'historique dans le tableau `messages`.
- La fenêtre de contexte (en tokens) est finie — l'historique ne peut pas croître indéfiniment.

**Quatre problèmes émergent dès qu'on dépasse le cas trivial :**

1. **Mémoire** — accumuler, résumer, et tronquer l'historique pour respecter la fenêtre de contexte.
2. **Contexte externe (RAG)** — chercher dans des documents et injecter les passages pertinents dans le prompt.
3. **Composition d'étapes** — enchaîner : recherche → formatage du prompt → appel LLM → parsing de la sortie.
4. **Outils (Tools)** — permettre au modèle de déclencher des actions (requête SQL, recherche web, appel API).

---

## 2. LangChain — les briques

**Version stable :** v1.0 (octobre 2025, Python et JavaScript).

LangChain fournit une abstraction standardisée pour chaque brique de la pile LLM. L'architecture est modulaire : changer de modèle (Claude → GPT) ne touche pas le reste du code.

### 2.1 Interface Runnable et LCEL

Chaque composant implémente l'interface **Runnable** (`invoke(input) → output`). La composition se fait via l'opérateur `|` (LCEL — LangChain Expression Language) :

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("Explique {concept} en 3 phrases.")
model = ChatAnthropic(model="claude-sonnet-4-6")
parser = StrOutputParser()

chain = prompt | model | parser
result = chain.invoke({"concept": "le event loop"})
```

**Analogie Node.js :** `pipeline(readable, transform, writable)` dans les streams. Même principe de composition via interface commune. Différence : les streams gèrent du flux continu avec backpressure ; les chains LangChain traitent des unités discrètes.

### 2.2 Les six catégories de composants

| Composant | Rôle | Analogie Node.js |
|-----------|------|------------------|
| **Models** | Interface standardisée vers les LLMs (OpenAI, Anthropic, etc.) | Adapter pattern |
| **Prompts** | Templates réutilisables avec variables | Template literal / string formatting |
| **Chains** | Composition d'étapes via LCEL | `pipeline()` sur streams |
| **Memory** | Persistance de l'historique conversationnel | Session store |
| **Tools** | Fonctions que le LLM peut invoquer | RPC / appels de fonction |
| **Retrievers** | Recherche dans des bases vectorielles / documents | Database query layer |

### 2.3 Ecosystem de packages

- `langchain-core` — abstractions fondamentales (Runnable, messages, prompts)
- `langchain-openai`, `langchain-anthropic`, etc. — intégrations par fournisseur
- `langchain` — package principal, factory functions (`create_agent`)
- `langgraph` — orchestration par graphe (voir section 3)
- `langsmith` — observabilité, tracing, évaluation

### 2.4 Tools : le mécanisme agent

Le LLM ne peut pas exécuter de code. Le mécanisme Tools fonctionne comme suit :

1. Tu déclares une liste de fonctions disponibles (nom, description, schéma des paramètres).
2. Le modèle peut répondre avec un **tool call** au lieu de texte.
3. **Ton code** exécute la vraie fonction et renvoie le résultat au modèle.
4. Le modèle intègre le résultat et formule sa réponse finale.

```
User :      "Combien a-t-on facturé en mars ?"
LLM :       → tool_call: search_invoices({month: "mars"})
Ton code :  → exécute la requête SQL → résultat: 47 300€
LLM :       "En mars, vous avez facturé 47 300€."
```

**Séparation fondamentale : le modèle raisonne sur quoi appeler ; ton code exécute.**

---

## 3. LangGraph — l'orchestration par graphe

**Version stable :** v1.1 (2026, Python 3.10+).

### 3.1 Le problème que LangGraph résout

Un agent, c'est une boucle formalisée (pattern **ReAct** — Reason + Act) :

```python
while True:
    response = llm.invoke(messages)
    if response.has_tool_calls:
        result = execute_tool(response.tool_call)
        messages.append(result)
        continue
    return response.text  # terminaison
```

Cette boucle linéaire ne suffit pas quand il faut brancher conditionnellement, réessayer avec des paramètres modifiés, pauser pour validation humaine, ou paralléliser des appels d'outils. Un `while` loop ne peut pas exprimer ça proprement.

LangGraph rend le flux de contrôle **déclaratif** en le modélisant comme un **graphe orienté** — une machine à états finie où le LLM est le moteur de décision.

### 3.2 Les quatre primitives

| Primitive | Rôle |
|-----------|------|
| **State** | Objet typé (`TypedDict`) partagé par tous les nodes. Chaque node le lit et le modifie. |
| **Nodes** | Fonctions (appel LLM, exécution d'outil, logique métier). Chaque node reçoit le state et retourne des mises à jour. |
| **Edges** | Transitions entre nodes. Peuvent être inconditionnelles ou conditionnelles. |
| **Conditional Edges** | Branchements basés sur le contenu du state (ex : "le LLM a-t-il demandé un tool call ?"). |

### 3.3 Graphe d'un agent ReAct

```
        ┌───────────┐
        │   START   │
        └─────┬─────┘
              ▼
        ┌───────────┐
        │   agent   │ ← appelle le LLM
        └─────┬─────┘
              ▼
         has tool call?
        /            \
      yes             no
      /                \
┌──────────┐     ┌──────────┐
│  tools   │     │   END    │
└─────┬────┘     └──────────┘
      │
      └──────► back to agent
```

### 3.4 Reducers — gestion des conflits d'état

Deux nodes parallèles qui modifient le même champ du state → race condition. Les **reducers** définissent comment les mises à jour se fusionnent :

```python
from typing import Annotated
from langgraph.graph import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]  # concat, jamais écraser
    user_id: str                              # écrasement classique
```

`add_messages` dit : "quand un node retourne des messages, concatène-les à la liste." Même principe que les reducers Redux.

### 3.5 Checkpoints — persistance et reprise

À chaque transition entre nodes, l'état complet est sauvegardé dans un **checkpointer** :

```python
from langgraph.checkpoint.sqlite import SqliteSaver

graph = builder.compile(
    checkpointer=SqliteSaver("agent.db"),
    interrupt_before=["execute_dangerous_action"]
)
```

Trois capacités :

- **Reprise après crash** — le graphe reprend au dernier node complété.
- **Time travel** — revenir à un état antérieur et rejouer.
- **Human-in-the-loop** — le graphe se met en pause, attend une validation, puis reprend.

### 3.6 Patterns multi-agents

| Pattern | Description |
|---------|-------------|
| **Superviseur** | Un agent "manager" qui délègue à des agents spécialisés (workers) |
| **Swarm** | Agents qui se transfèrent le contrôle entre eux de manière décentralisée |
| **Hiérarchique** | Superviseur de superviseurs pour des workflows complexes |

---

## 4. MCP (Model Context Protocol) — agent vers outils

**Créateur :** Anthropic (donné à la Linux Foundation, décembre 2025).
**Adoption :** 97M+ téléchargements mensuels SDK, supporté par OpenAI, Google, Microsoft, AWS.

### 4.1 Rôle

MCP standardise la connexion **verticale** d'un agent vers ses outils et sources de données. Sans MCP, chaque intégration (base de données, API, système de fichiers) nécessite du code d'intégration spécifique. MCP fournit un protocole commun.

### 4.2 Architecture

```
┌──────────────────────────┐
│          Host            │  (application LLM : Claude Desktop, IDE)
│  ┌────────────────────┐  │
│  │      Client        │  │  (gère la session)
│  └────────┬───────────┘  │
└───────────┼──────────────┘
            │ JSON-RPC 2.0
            ▼
┌──────────────────────────┐
│        Server            │  (outil ou source de données)
│  - Resources (données)   │
│  - Tools (actions)       │
│  - Prompts (templates)   │
└──────────────────────────┘
```

**Transport :** JSON-RPC 2.0 sur stdio (local) ou HTTP + SSE (distant).

### 4.3 Direction

L'agent est client, le serveur MCP expose des outils. **La relation est unidirectionnelle :** le serveur MCP n'invoque jamais l'agent.

---

## 5. A2A (Agent-to-Agent) — agent vers agent

**Créateur :** Google (avril 2025, donné à la Linux Foundation, juin 2025).
**Adoption :** 150+ organisations, v1.0 publiée, production chez Microsoft Azure, AWS Bedrock, Salesforce, SAP.

### 5.1 Rôle

A2A standardise la communication **horizontale** entre agents autonomes, potentiellement construits avec des frameworks, vendors, et organisations différents. C'est l'équivalent de REST/OpenAPI pour les microservices, mais pour les agents IA.

### 5.2 Les quatre concepts fondamentaux

| Concept | Rôle | Analogie |
|---------|------|----------|
| **Agent Card** | Document JSON publié à une URL, décrivant les capacités, skills, endpoint, et exigences d'authentification de l'agent. | Contrat OpenAPI / service descriptor |
| **Task** | Unité de travail avec ID unique et cycle de vie (`submitted → working → input-required → completed / failed / canceled`). | Ticket, work item |
| **Message** | Échange au sein d'une Task. Rôle `user` ou `agent`, contient des **Parts** (TextPart, FilePart, DataPart). | Message dans une queue |
| **Artifact** | Livrable produit par l'agent distant. Immutable une fois généré. | Résultat d'un job |

### 5.3 Flux complet

```
Agent Client                                Agent Distant
    │                                            │
    │  1. GET /.well-known/agent.json            │
    │  ──────────────────────────────────────►    │  Découverte (Agent Card)
    │  ◄──────────────────────────────────────    │
    │                                            │
    │  2. OAuth 2.0 / API Key                    │
    │  ◄────────────────────────────────────►    │  Authentification
    │                                            │
    │  3. tasks/send (JSON-RPC over HTTPS)       │
    │  ──────────────────────────────────────►    │  Crée une Task
    │                                            │
    │  4. Task status: "working"                 │
    │  ◄──────────────────────────────────────    │  SSE ou webhook
    │                                            │
    │  5. Task status: "input-required"          │
    │  ◄──────────────────────────────────────    │  L'agent distant
    │  6. tasks/send (info supplémentaire)       │     demande plus d'info
    │  ──────────────────────────────────────►    │
    │                                            │
    │  7. Task status: "completed" + Artifacts   │
    │  ◄──────────────────────────────────────    │  Résultat final
    │                                            │
```

### 5.4 Spécifications techniques

- **Transport :** HTTPS + JSON-RPC 2.0
- **Streaming :** Server-Sent Events (SSE)
- **Notifications async :** webhooks (push notifications)
- **Auth :** OAuth 2.0, API keys, OpenID Connect (aligné OpenAPI)
- **Sécurité :** TLS 1.3, Agent Cards signées (JWS / RFC 7515)
- **Méthodes JSON-RPC :** `tasks/send`, `tasks/sendSubscribe`, `tasks/get`, `tasks/cancel`, `tasks/pushNotification/set`, etc.

---

## 6. MCP vs A2A — couches complémentaires

```
┌─────────────────┐    A2A (HTTPS)    ┌─────────────────┐
│  Agent Ventes   │◄────────────────►│  Agent Support  │
│                 │                   │                 │
│  ┌───┐  ┌───┐  │                   │  ┌───┐  ┌───┐  │
│  │MCP│  │MCP│  │                   │  │MCP│  │MCP│  │
│  └─┬─┘  └─┬─┘  │                   │  └─┬─┘  └─┬─┘  │
│    ▼      ▼    │                   │    ▼      ▼    │
│  CRM    Email  │                   │ Tickets  KB    │
└─────────────────┘                   └─────────────────┘
```

| Dimension | MCP | A2A |
|-----------|-----|-----|
| **Direction** | Verticale (agent → outils) | Horizontale (agent → agent) |
| **Relation** | Client-serveur, unidirectionnelle | Peer-to-peer, bidirectionnelle |
| **Unité d'échange** | Appel de fonction (tool call) | Task avec cycle de vie |
| **Découverte** | Configuration locale / registre de serveurs | Agent Card publique à URL connue |
| **Qui contrôle ?** | L'agent appelle l'outil | Un agent délègue à un pair autonome |
| **Analogie** | Syscall / appel de bibliothèque | Communication inter-microservices |

**Règle de choix :** un agent + outils externes = MCP. Plusieurs agents autonomes qui collaborent = A2A. Les deux se combinent dans un système multi-agents.

---

## 7. Glossaire rapide

| Terme | Définition |
|-------|------------|
| **Agent** | Boucle LLM + tools : le modèle raisonne, agit, observe, et décide s'il a terminé |
| **ReAct** | Pattern Reason + Act — le modèle alterne raisonnement et actions |
| **RAG** | Retrieval-Augmented Generation — injecter des documents pertinents dans le prompt |
| **LCEL** | LangChain Expression Language — composition via opérateur `\|` |
| **Runnable** | Interface commune LangChain : `invoke(input) → output` |
| **StateGraph** | Classe LangGraph pour construire un graphe orienté avec état typé |
| **Reducer** | Fonction qui définit comment les mises à jour d'état se fusionnent |
| **Checkpointer** | Mécanisme de persistance de l'état du graphe entre transitions |
| **Agent Card** | Document JSON A2A décrivant les capacités d'un agent |
| **Tool call** | Intention du modèle d'appeler une fonction — non exécutée par le modèle lui-même |
