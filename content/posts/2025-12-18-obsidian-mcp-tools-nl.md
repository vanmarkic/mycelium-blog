---
title: 'Obsidian MCP Tools: Je Notities Verbinden met AI'
date: '2025-12-18'
status: published
privacy: public
lang: nl
tags:
  - test-driven-development
  - mcp
  - obsidian
  - typescript
  - open-source
repos:
  - obsidian-mcp-tools
skills: []
patterns:
  - test-driven-development
relatedTo:
  - 2025-11-03-claude-config
  - 2025-11-03-loyer.brussels
  - 2025-11-03-touchepas
  - 2025-11-14-3DSoundViz
  - 2025-11-14-claude-config
  - 2025-11-14-touchepas
  - 2025-12-18-how-not-to-diet-en
  - property-based-regression-testing
description: >-
  Hoe ik een MCP-server bouwde die Obsidian verbindt met Claude en andere
  AI-tools, met focus op robuuste tests en cross-platform ondersteuning.
---

## Inleiding

Stel je voor: je vraagt Claude om een samenvatting van al je projectnotities, en hij leest ze direct uit je Obsidian vault. Of je vraagt om een nieuwe taak toe te voegen aan je dagelijkse notitie. Dat is wat **Obsidian MCP Tools** mogelijk maakt.

De afgelopen maand hebben **49 commits** dit project gevormd, met een sterke focus op **test-driven development** en het oplossen van edge cases die ontstaan bij cross-platform implementaties.

## Het Verhaal

### Context: Wat Ik Aan Het Bouwen Was

Het Model Context Protocol (MCP) is een open standaard die AI-assistenten toestaat om te communiceren met externe tools. Obsidian, de populaire notitie-app, had al een Local REST API plugin — maar er was geen brug naar MCP.

Ik wilde die brug bouwen. Een MCP-server die:
- Notities kan lezen en schrijven
- Zoekfunctionaliteit biedt
- Obsidian-commando's kan uitvoeren
- Werkt op Windows, macOS en Linux

### De Uitdaging

Drie problemen maakten dit lastig:

1. **Padnormalisatie**: Elke OS behandelt paden anders. Windows gebruikt backslashes, Unix forward slashes. Symlinks introduceren nog meer complexiteit.

2. **API-versie compatibiliteit**: De Local REST API plugin evolueert. Sommige endpoints bestaan alleen in nieuwere versies.

3. **Configuratiepaden**: Claude Desktop slaat configuratie op verschillende locaties op per platform.

De grootste bug? **Dubbele pad-segmenten** na symlink-resolutie:

```typescript
// BUG: Na symlink resolutie werd "/vault/notes/notes/file.md"
// FIX: removeDuplicatePathSegments verwijdert de herhaling
```

### Hoe Ik Het Oploste

**Test-First Aanpak**

Elke bugfix begon met een falende test:

```typescript
describe('removeDuplicatePathSegments', () => {
  it('verwijdert opeenvolgende duplicaten', () => {
    expect(removeDuplicatePathSegments('/vault/notes/notes/file.md'))
      .toBe('/vault/notes/file.md');
  });

  it('behoudt de voorloop-slash', () => {
    expect(removeDuplicatePathSegments('/path/to/file'))
      .toBe('/path/to/file');
  });

  it('werkt met Windows-paden', () => {
    expect(removeDuplicatePathSegments('C:\\vault\\notes\\notes\\file.md'))
      .toBe('C:\\vault\\notes\\file.md');
  });
});
```

**Platform-Detectie**

De installatiepaden variëren per OS:

```typescript
const CONFIG_PATHS = {
  darwin: '~/Library/Application Support/Claude/claude_desktop_config.json',
  linux: '~/.config/Claude/claude_desktop_config.json',
  win32: '%APPDATA%\\Claude\\claude_desktop_config.json'
};
```

**Obsidian Command Execution**

Een nieuwe feature laat AI-tools Obsidian-commando's uitvoeren:

```typescript
// Voer een Obsidian-commando uit via de REST API
await executeCommand({
  commandId: 'daily-notes:goto-today',
  params: {}
});
```

### Wat Ik Geleerd Heb

1. **Integratie-tests zijn onmisbaar**. Unit tests vangen logica-bugs, maar alleen integratie-tests onthullen platform-specifieke problemen.

2. **Documentatie is een feature**. Ik schreef handleidingen voor niet-Claude MCP clients, externe installatie, en troubleshooting — elke handleiding voorkomt tientallen GitHub issues.

3. **Edge cases vermenigvuldigen zich**. Één bug (pad-normalisatie) had vertakkingen naar trailing slashes, dubbele segmenten, en symlink-resolutie.

4. **Versie-detectie voorkomt crash**. De API controleert nu welke endpoints beschikbaar zijn voordat ze worden aangeroepen.

## Technische Details

**Stack**: TypeScript, Bun, ArkType (schema validatie)

**Belangrijke Features**:
- Lezen/schrijven van vault bestanden
- Zoeken met regex en fuzzy matching
- Obsidian commando-executie
- Aangepaste HTTP/HTTPS poorten
- Cross-platform ondersteuning

**Getest Op**:
- macOS (Intel + Apple Silicon)
- Linux (Ubuntu, Arch)
- Windows 10/11

## Mycelium Links

Dit project verbindt met:
- **obsitask** skill: Taakbeheer in Obsidian met emoji-syntax
- **test-driven-development**: Elke feature begint met een falende test
