---
title: "ObsiTask - Spécialiste Obsidian Tasks"
date: "2025-12-18"
status: published
privacy: public
lang: fr
tags: [claude-code, obsidian, task-management, productivity]
repos: []
skills: [obsitask]
patterns: []
relatedTo: []
description: "Skill Claude Code pour la création, édition et traitement par lots de tâches Obsidian avec syntaxe emoji"
---

## Vue d'ensemble

ObsiTask est un skill expert en gestion des tâches du plugin Obsidian Tasks. Il gère :
- Création de tâches individuelles et par lots avec syntaxe emoji
- Conversion entre formats (emoji ↔ Dataview)
- Déplacement/migration de tâches entre fichiers
- Édition en masse des attributs
- Validation de la syntaxe

**Communication :** Toujours en français avec tutoiement naturel.

## Référence du Format de Tâche

### Attributs de Date (Emoji)

| Emoji | Signification |
|-------|---------------|
| `📅` | Date d'échéance (deadline) |
| `⏳` | Date planifiée (quand travailler dessus) |
| `🛫` | Date de début (première date possible) |
| `✅` | Date de complétion |
| `➕` | Date de création |

### Niveaux de Priorité

| Emoji | Priorité |
|-------|----------|
| `⏫` | Maximale |
| `🔼` | Haute |
| (aucun) | Normale |
| `🔽` | Basse |
| `⏬` | Minimale |

### Récurrence

```
🔁 every day
🔁 every week on Monday
🔁 every month on the 1st
🔁 every 3 months
🔁 every year on January 1st
```

**Note :** La syntaxe de récurrence utilise l'anglais (exigence du plugin).

### Statuts de Tâche

```
- [ ]  Non commencée
- [x]  Terminée
- [/]  En cours
- [-]  Annulée
- [>]  Transférée
- [<]  Planifiée
```

## Convention d'Ordre des Emojis

Priorité → Début → Planifiée → Échéance → Récurrence → Création

```markdown
- [ ] ⏫ Nom de tâche 🛫 2025-11-18 ⏳ 2025-11-20 📅 2025-11-22 🔁 every week
```

## Exemples Contextualisés

### Tâches Administratives (Belgique/France)

```markdown
- [ ] ⏫ Déclaration TVA trimestrielle 📅 2025-12-20 🔁 every 3 months
- [ ] Renouvellement mutuelle 📅 2025-12-31 🔁 every year
- [ ] Paiement cotisations sociales 📅 2025-12-01 🔁 every 3 months
```

### Tâches Projet

```markdown
## Projet Site Web Client

- [ ] ⏫ Réunion de lancement 📅 2025-11-20
- [ ] 🔼 Recueil des besoins 🛫 2025-11-20 📅 2025-11-25
- [ ] Maquettes design 🛫 2025-11-25 📅 2025-11-30
- [ ] Phase d'implémentation 🛫 2025-12-01 📅 2025-12-15
```

### Vie Quotidienne

```markdown
- [ ] Courses Colruyt/Carrefour 🔁 every week on Saturday
- [ ] Contrôle technique voiture 📅 2025-12-10 🔁 every year
```

## Opérations avec MCP

### Lire les tâches

```
mcp__obsidian__get_vault_file(filename: "chemin/vers/taches.md")
```

### Ajouter des tâches

```
mcp__obsidian__append_to_vault_file(filename: "chemin/vers/taches.md", content: "...")
```

### Modifier une section

```
mcp__obsidian__patch_vault_file(
  filename: "chemin/vers/taches.md",
  targetType: "heading",
  target: "Tâches Travail",
  operation: "append",
  content: "- [ ] Nouvelle tâche"
)
```

## Conversion de Formats

### Emoji vers Dataview

```markdown
# Avant
- [ ] Tâche 📅 2025-11-25 🔼

# Après
- [ ] Tâche [due:: 2025-11-25] [priority:: high]
```

### Dataview vers Emoji

```markdown
# Avant
- [ ] Tâche [due:: 2025-11-25] [priority:: high]

# Après
- [ ] 🔼 Tâche 📅 2025-11-25
```

## Bonnes Pratiques

1. **Regrouper les tâches liées** sous des en-têtes
2. **Utiliser des tags** pour le contexte (#travail, #perso, #urgent)
3. **Respecter l'ordre emoji** dans les tâches complexes
4. **Toujours valider** le format date AAAA-MM-JJ
5. **Confirmer** les opérations destructives ou en masse

## Mycelium Links

Connexions :
- **obsidian-mcp-tools** : Serveur MCP pour l'intégration Obsidian
- **knowledge-converter** : Extraction de données pour les tâches projet
