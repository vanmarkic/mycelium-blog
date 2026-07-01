---
title: 'ArgoCD et Harbor : récupérer des charts Helm depuis un registry OCI'
date: '2026-07-01'
status: published
privacy: public
lang: fr
tags:
  - argocd
  - harbor
  - helm
  - oci
  - kubernetes
  - gitops
  - devops
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  Configurer ArgoCD pour aller chercher des charts Helm dans un registry OCI
  Harbor : déclaration du repository, référencement du chart, causes fréquentes
  d'échec de connexion et méthode de diagnostic.
---

## Le point de départ

> Comment ArgoCD peut-il aller chercher les charts Helm dans un registry Harbor ? Comment configurer ? Faut-il utiliser l'adresse `oci://` ? La connexion échoue.

Oui, `oci://` est correct pour un registry OCI Harbor. Voici la configuration.

## 1. Déclarer le repository OCI

Harbor expose les charts OCI à `harbor.example.com/<project>`. Le repo ArgoCD pointe sur le projet, pas sur le chart individuel.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: harbor-oci-repo
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  name: harbor-charts
  type: helm
  url: harbor.example.com/my-project   # PAS de oci:// ici, PAS de https://
  enableOCI: "true"
  username: robot$argocd
  password: <robot-token>
```

Points critiques :

- `enableOCI: "true"` est obligatoire et souvent la cause de l'échec.
- `url` = host + projet, sans le préfixe `oci://` et sans schéma. Le `oci://` s'utilise côté client Helm/CLI, mais dans le secret repository ArgoCD attend l'URL nue.
- `type: helm`.

## 2. Référencer le chart dans l'Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: harbor.example.com/my-project   # identique au secret, sans oci://
    chart: my-chart                            # nom du chart seul
    targetRevision: 1.2.3                       # version, pas de "latest" en OCI
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app
```

## Causes fréquentes d'échec de connexion

1. `enableOCI` absent ou à `false` — le plus courant.
2. Préfixe `oci://` laissé dans `url` / `repoURL` — ArgoCD le rejette ou double le schéma.
3. `targetRevision: latest` — non supporté en OCI, il faut une version explicite.
4. Robot account Harbor : le nom complet est `robot$<project>+<name>` ou `robot$<name>` selon la config Harbor ; vérifier les permissions `pull` sur le projet et sur les artefacts. Un robot sans droit `repository: pull` renvoie un 401/403.
5. TLS : si Harbor a un certificat self-signed, ajouter le CA dans le ConfigMap `argocd-tls-certs-cm` (clé = hostname), ou en dernier recours `insecure: "true"` dans le secret (à éviter en prod).
6. Version d'ArgoCD : le support OCI Helm est stable à partir de ~2.0, mais certains comportements (auth, discovery) ont changé jusqu'à 2.7+.

## Diagnostic

Pour isoler le problème (auth vs réseau vs config ArgoCD), teste d'abord en direct depuis le pod `repo-server` ou ta machine :

```bash
helm registry login harbor.example.com -u 'robot$my-project+argocd'
helm pull oci://harbor.example.com/my-project/my-chart --version 1.2.3
```

- Si `helm pull` échoue → problème Harbor / auth / réseau, pas ArgoCD.
- Si `helm pull` marche mais ArgoCD non → problème dans le secret repository (schéma dans l'URL ou `enableOCI`).

Le message d'erreur exact d'ArgoCD (`401`, `403`, `no such host`, `unsupported protocol scheme`, `manifest unknown`) pointe directement la cause.

> Note de version : sur ArgoCD 3.x, certains champs peuvent avoir évolué par rapport aux exemples ci-dessus. En cas de doute, croiser avec la doc de la version installée.

## Dans quel fichier YAML mettre tout ça ?

Ces manifests vont dans des fichiers séparés que l'on applique au cluster, **pas** dans un fichier de config d'ArgoCD lui-même. Ce sont des ressources Kubernetes standard.

### Option A — Application directe (le plus simple)

Deux fichiers distincts, appliqués avec `kubectl` :

```bash
kubectl apply -f harbor-repo-secret.yaml
kubectl apply -f my-app-application.yaml
```

- `harbor-repo-secret.yaml` → le Secret (partie 1)
- `my-app-application.yaml` → l'Application (partie 2)

On peut aussi tout mettre dans un seul fichier en les séparant par `---` :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: harbor-oci-repo
  namespace: argocd
# ... reste du secret
---
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
# ... reste de l'application
```

### Option B — Si l'on gère ArgoCD en GitOps (app-of-apps / Helm)

- Le Secret repository ne se met **jamais** en clair dans Git (il contient le token robot). Deux voies : soit l'ajouter via l'UI/CLI ArgoCD (`argocd repo add`), soit le chiffrer avec Sealed Secrets / External Secrets / SOPS et committer la version chiffrée.
- L'Application va dans le repo Git, dans le dossier que l'app-of-apps surveille (souvent `apps/` ou `applications/`).

### Ajout du repo sans YAML (alternative CLI)

Pour tester rapidement, la CLI crée le secret pour toi :

```bash
argocd repo add harbor.example.com/my-project \
  --type helm \
  --name harbor-charts \
  --enable-oci \
  --username 'robot$my-project+argocd' \
  --password '<robot-token>'
```

C'est souvent le plus rapide pour valider que la connexion passe avant de basculer en GitOps.

## En résumé

Le Secret et l'Application sont des ressources appliquées au cluster (namespace `argocd`), pas des entrées dans un fichier de configuration interne d'ArgoCD. Les trois pièges qui font échouer la connexion neuf fois sur dix : `enableOCI` oublié, préfixe `oci://` laissé dans l'URL, et `targetRevision: latest` au lieu d'une version explicite.
