---
title: 'Calculateur de Loyer Bruxellois : Rendre la Grille Accessible'
date: '2025-12-18'
status: published
privacy: public
lang: fr
tags:
  - static-site-generation
  - react
  - next.js
  - typescript
  - tailwind-css
  - i18n
  - accessibility
repos:
  - loyer.brussels
skills: []
patterns:
  - static-site-generation
relatedTo:
  - 2025-11-03-credit-castor
  - 2025-11-03-loyer.brussels
  - 2025-11-03-mycelium-blog
  - 2025-11-14-3DSoundViz
  - 2025-11-14-credit-castor
  - 2025-11-14-lagendwa
  - 2025-11-14-loyer.brussels
  - 2025-11-14-mycelium-blog
  - 2025-11-14-womb
  - 2025-12-18-how-not-to-diet-en
description: >-
  Comment j'ai construit un calculateur de loyer de référence pour Bruxelles,
  avec internationalisation trilingue et accessibilité au cœur du projet.
---

## Introduction

À Bruxelles, chaque bail locatif doit respecter une grille de loyers de référence. Mais naviguer dans les documents officiels de la Région? C'est un labyrinthe bureaucratique. J'ai construit **loyer.brussels** — un calculateur web qui transforme cette complexité en 7 étapes simples.

En un mois, **121 commits** ont façonné cette application, avec 33% dédiés aux nouvelles fonctionnalités et une attention particulière à l'**internationalisation** et l'**accessibilité**.

## L'Histoire

### Contexte : Ce Que Je Construisais

Bruxelles impose des loyers de référence basés sur plusieurs critères : type de bien, superficie, équipements, performance énergétique, localisation. Les citoyens et propriétaires doivent pouvoir calculer ce loyer légal — mais les outils officiels sont soit inexistants, soit inutilisables sur mobile.

Mon objectif : un calculateur en 7 étapes qui fonctionne en français, néerlandais et anglais.

### Le Défi

Trois obstacles majeurs :

1. **L'internationalisation native** : Pas juste des traductions — chaque champ de formulaire, message d'erreur et info-bulle devait exister en trois langues.

2. **La persistance d'état** : Les utilisateurs abandonnent les formulaires longs. Je devais sauvegarder leur progression automatiquement.

3. **Les re-rendus infinis** : React et la gestion d'état complexe créaient des boucles de mise à jour. Le formulaire crashait le navigateur.

### Comment J'ai Résolu Ces Problèmes

**Architecture i18n avec next-intl**

```typescript
// Structure des routes localisées
// /fr/questionnaire, /nl/questionnaire, /en/questionnaire
export default function QuestionnaireLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

**Gestion d'état avec contexte global**

J'ai implémenté un `GlobalFormProvider` qui persiste les données dans le localStorage :

```typescript
const GlobalFormProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    // Restaurer depuis localStorage au chargement
    const saved = localStorage.getItem('rentCalculatorState');
    return saved ? JSON.parse(saved) : initialState;
  });

  // Auto-sauvegarde à chaque changement
  useEffect(() => {
    localStorage.setItem('rentCalculatorState', JSON.stringify(formData));
  }, [formData]);

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
```

**Résolution des re-rendus infinis**

Le bug était subtil : la fonction `updateData` acceptait des objets, mais React re-créait ces objets à chaque rendu, déclenchant une cascade de mises à jour.

```typescript
// AVANT (bug) : Object identity change → infinite loop
updateData({ propertyType: 'apartment' });

// APRÈS (fix) : Updater function pattern
updateData(prev => ({
  ...prev,
  propertyType: 'apartment'
}));
```

**Accessibilité WCAG**

J'ai ajouté des labels ARIA, des liens de navigation rapide, et optimisé les cibles tactiles pour mobile :

```typescript
<button
  aria-label={t('navigation.next')}
  className="min-h-[44px] min-w-[44px]" // Cible tactile minimum
>
  {t('common.next')}
</button>
```

### Ce Que J'ai Appris

1. **L'i18n doit être native, pas ajoutée**. Intégrer les traductions après coup multiplie le travail par trois.

2. **Les tests d'intégration révèlent les vrais bugs**. Les tests unitaires passaient, mais les tests E2E ont exposé le bug de re-rendu.

3. **L'accessibilité améliore l'UX pour tous**. Les améliorations WCAG ont aussi amélioré la navigation mobile.

4. **La persistance d'état est attendue en 2025**. Les utilisateurs s'attendent à reprendre où ils en étaient — c'est devenu un standard.

## Détails Techniques

**Stack** : Next.js 15, React, TypeScript, Tailwind CSS, next-intl, Supabase

**Fonctionnalités Clés** :
- Calculateur en 7 étapes
- Traductions FR/NL/EN
- Sauvegarde automatique de progression
- Export PDF du résultat
- Formulaire de contact intégré
- Déploiement sur Render

**Patterns Appliqués** :
- Static site generation pour les pages de contenu
- Client-side state management pour le formulaire
- Progressive enhancement pour fonctionner sans JavaScript

## Liens Mycelium

Ce projet se connecte à :
- **ui-testing** skill : Tests E2E systématiques pour chaque étape du formulaire
- **exhaustive-verification** : Vérification complète avant chaque déploiement
