export const translations = {
  fr: {
    nav: {
      posts: 'Posts',
      skills: 'Skills',
      patterns: 'Patterns',
      graph: 'Graph',
      support: 'Support'
    },
    footer: {
      builtWith: 'Construit avec Astro, React et Claude Code',
      tagline: 'La connaissance grandit comme le mycélium, interconnectée sous la surface'
    },
    support: {
      title: 'Soutenez l\'écosystème !',
      subtitle: 'Votre soutien permet de maintenir ces outils open source et de créer de nouvelles solutions pour la communauté.',
      stats: {
        projects: 'Projets actifs',
        openSource: 'Open Source',
        madeIn: 'Made in BE'
      },
      mission: {
        title: 'Pourquoi soutenir ?',
        development: {
          title: 'Développement & Maintenance',
          desc: 'Gardez les outils actifs et à jour'
        },
        docs: {
          title: 'Documentation',
          desc: 'Tutoriels, guides et support communautaire'
        },
        innovation: {
          title: 'Innovation',
          desc: 'Nouvelles fonctionnalités et projets expérimentaux'
        },
        infrastructure: {
          title: 'Infrastructure',
          desc: 'Hébergement, domaines, outils de développement'
        }
      },
      projects: {
        title: 'Projets soutenus',
        subtitle: 'Chaque contribution aide à développer ces initiatives',
        clickForPerks: '→ Cliquez pour voir les contreparties',
        categories: {
          civicTech: 'Civic Tech',
          urbanPlanning: 'Urbanisme',
          blog: 'Blog Tech',
          ai: 'IA & Workflows',
          marketplace: 'Marketplace',
          media: 'Média',
          heritage: 'Patrimoine',
          music: 'Musique',
          events: 'Événements',
          housing: 'Logement',
          devTools: 'Dev Tools'
        }
      },
      modal: {
        whatYouSupport: 'Ce que vous soutenez',
        yourPerks: 'Vos contreparties',
        close: 'Fermer'
      },
      projectDetails: {
        stadiumCheck: {
          name: 'Stadium Check',
          desc: 'Vérification disponibilité stades',
          category: 'civicTech',
          support: [
            'API de vérification en temps réel',
            'Intégration multi-stades',
            'Notifications automatiques',
            'Code open source maintenu'
          ],
          perks: [
            'Accès prioritaire aux nouvelles fonctionnalités',
            'Support technique dédié',
            'Mentions dans les remerciements du projet',
            'Accès à la roadmap et aux décisions de développement'
          ]
        },
        monloyer: {
          name: 'monloyer.brussels',
          desc: 'Calculateur fourchette loyer - défense locataires',
          category: 'civicTech',
          support: [
            'Calculateur de loyer pour Bruxelles',
            'Base de données actualisée',
            'Outil de défense des locataires',
            'Collaboration avec le syndicat Wuune'
          ],
          perks: [
            'Documentation détaillée de l\'algorithme',
            'Accès aux données et méthodologie',
            'Participation aux mises à jour réglementaires',
            'Badge de contributeur affiché sur le site'
          ]
        },
        myceliumBlog: {
          name: 'Mycelium Blog',
          desc: 'Ce blog ! Workflows IA',
          category: 'blog',
          support: [
            'Workflows automatisés avec IA',
            'Graphe de connaissances interactif',
            'Agrégation multi-repos',
            'Patterns et best practices partagés'
          ],
          perks: [
            'Accès anticipé aux nouveaux posts',
            'Tutoriels exclusifs sur les workflows IA',
            'Votre nom dans la page "Contributeurs"',
            'Influence sur les sujets à couvrir'
          ]
        },
        claudeSkills: {
          name: 'Claude Code Skills',
          desc: 'Bibliothèque de skills pour Claude',
          category: 'ai',
          support: [
            'Skills réutilisables pour Claude Code',
            'Documentation complète',
            'Exemples et templates',
            'Intégration avec projets existants'
          ],
          perks: [
            'Accès aux skills premium',
            'Support prioritaire pour intégration',
            'Skills personnalisés sur demande',
            'Accès au serveur Discord privé'
          ]
        },
        creditCastor: {
          name: 'Credit Castor',
          desc: 'Calculateur habitat groupé - achat en division',
          category: 'housing',
          support: [
            'Outil de calcul pour projets d\'habitat groupé',
            'Simulations financières',
            'Aide à la structuration juridique',
            'Ressources et documentation'
          ],
          perks: [
            'Templates de documents juridiques',
            'Consultations techniques gratuites',
            'Réseau de contacts (notaires, architectes)',
            'Accès au groupe de travail habitat groupé'
          ]
        },
        deuxmains: {
          name: 'DeuxMains',
          desc: 'Marketplace locale solidaire',
          category: 'marketplace',
          support: [
            'Plateforme d\'échange locale',
            'Économie circulaire',
            'Zéro commission',
            'Focus communauté'
          ],
          perks: [
            'Visibilité premium pour vos annonces',
            'Badge "Supporter" sur votre profil',
            'Accès anticipé aux nouvelles catégories',
            'Participation aux décisions communautaires'
          ]
        },
        nationale4: {
          name: 'Nationale4',
          desc: 'Média indépendant belge',
          category: 'media',
          support: [
            'Journalisme d\'investigation indépendant',
            'Couverture des enjeux belges',
            'Liberté éditoriale totale',
            'Accessibilité gratuite des articles'
          ],
          perks: [
            'Accès aux articles en avant-première',
            'Newsletter exclusive avec analyses approfondies',
            'Invitation aux événements et conférences',
            'Reconnaissance publique comme mécène'
          ]
        },
        fermeDuTemple: {
          name: 'Ferme du Temple',
          desc: 'Écosystème restauration patrimoine',
          category: 'heritage',
          support: [
            'Préservation du patrimoine rural',
            'Lieu de rencontre et d\'événements',
            'Formations et ateliers',
            'Développement durable et écologique'
          ],
          perks: [
            'Invitations aux événements privés',
            'Ateliers et formations à tarif réduit',
            'Visite guidée exclusive du site',
            'Produits locaux et artisanaux en priorité'
          ]
        },
        womb: {
          name: 'Womb',
          desc: 'Musique thérapeutique pour introvertis',
          category: 'music',
          support: [
            'Sessions musicales thérapeutiques',
            'Environnement safe pour introvertis',
            'Exploration sonore collective',
            'Accessibilité et inclusion'
          ],
          perks: [
            'Accès prioritaire aux sessions',
            'Enregistrements audio des sessions',
            'Ateliers de découverte gratuits',
            'Réductions sur merchandising et événements'
          ]
        },
        lagendwa: {
          name: 'Lagendwa',
          desc: 'App festival open source',
          category: 'events',
          support: [
            'Application mobile pour festivals',
            'Code open source réutilisable',
            'Programmation en temps réel',
            'Carte interactive et notifications'
          ],
          perks: [
            'Votre logo dans l\'app',
            'Déploiement gratuit pour votre événement',
            'Support technique prioritaire',
            'Fonctionnalités custom sur demande'
          ]
        },
        claudeConfig: {
          name: 'Claude Config',
          desc: 'Gestionnaire de configs Claude Code',
          category: 'devTools',
          support: [
            'Gestionnaire de configurations Claude Code',
            'Partage et sync de configs',
            'Templates réutilisables',
            'Boost de productivité'
          ],
          perks: [
            'Accès au CLI premium',
            'Bibliothèque de configs partagées',
            'Support prioritaire',
            'Documentation et tutoriels exclusifs',
            'Votre nom dans le hall of fame des contributeurs'
          ]
        },
        threeDS: {
          name: '3DS (3dsoudviz)',
          desc: 'Visualisateur audio opensource pour VJ',
          category: 'creative',
          support: [
            'Visualisations audio en temps réel',
            'Outil opensource pour VJs et artistes',
            'Compatible navigateur web',
            'Effets visuels synchronisés au son'
          ],
          perks: [
            'Nouveaux effets visuels en priorité',
            'Templates de visualisation personnalisés',
            'Votre nom dans les crédits',
            'Support technique pour vos performances'
          ]
        }
      },
      donations: {
        title: 'Moyens de contribution',
        subtitle: 'Choisissez la plateforme qui vous convient',
        toSetup: 'À configurer prochainement',
        platforms: {
          githubSponsors: 'GitHub Sponsors',
          kofi: 'Ko-fi',
          buyMeACoffee: 'Buy Me a Coffee',
          patreon: 'Patreon',
          liberapay: 'Liberapay',
          paypal: 'PayPal',
          openCollective: 'Open Collective',
          bankTransfer: 'Virement bancaire'
        }
      },
      proBono: {
        title: 'Marketplace Pro Bono',
        subtitle: 'Connecter les associations belges avec des spécialistes IT bénévoles',
        desc: 'Une plateforme où les associations peuvent proposer leurs besoins IT et où les développeur·euses peuvent contribuer à des projets à impact social.',
        categories: {
          title: 'Services disponibles',
          webDev: {
            icon: '🌐',
            name: 'Développement Web',
            desc: 'Sites, apps, APIs'
          },
          mobile: {
            icon: '📱',
            name: 'Apps Mobile',
            desc: 'iOS, Android, React Native'
          },
          automation: {
            icon: '⚡',
            name: 'Automatisation',
            desc: 'Workflows, scripts, intégrations'
          },
          database: {
            icon: '🗄️',
            name: 'Bases de données',
            desc: 'Design, migration, optimisation'
          },
          infra: {
            icon: '☁️',
            name: 'Infrastructure',
            desc: 'Hébergement, CI/CD, DevOps'
          },
          training: {
            icon: '📚',
            name: 'Formation',
            desc: 'Documentation, tutoriels, support'
          }
        },
        cta: {
          associations: {
            title: 'Vous êtes une association ?',
            desc: 'Proposez votre projet IT et trouvez des bénévoles qualifié·es',
            button: 'Proposer un projet'
          },
          specialists: {
            title: 'Vous êtes spécialiste IT ?',
            desc: 'Découvrez les projets et proposez votre aide pro bono',
            button: 'Voir les projets'
          }
        },
        howItWorks: {
          title: 'Comment ça marche ?',
          step1: {
            title: 'Soumission',
            desc: 'L\'association décrit son besoin IT via GitHub'
          },
          step2: {
            title: 'Review',
            desc: 'Le projet est évalué et validé'
          },
          step3: {
            title: 'Match',
            desc: 'Les spécialistes proposent leur aide'
          },
          step4: {
            title: 'Collaboration',
            desc: 'Réalisation du projet ensemble'
          }
        },
        belgium: 'Focus Belgique 🇧🇪'
      },
      thanks: {
        title: 'Merci ! 🍄',
        message: 'Votre soutien fait grandir l\'écosystème mycelium. Chaque contribution, quelle que soit sa forme, aide à maintenir ces projets vivants et accessibles à tous.'
      }
    }
  },
  nl: {
    nav: {
      posts: 'Posts',
      skills: 'Skills',
      patterns: 'Patterns',
      graph: 'Graph',
      support: 'Steun'
    },
    footer: {
      builtWith: 'Gebouwd met Astro, React en Claude Code',
      tagline: 'Kennis groeit zoals mycelium, ondergronds verbonden'
    },
    support: {
      title: 'Steun het ecosysteem!',
      subtitle: 'Uw steun helpt deze open source tools te onderhouden en nieuwe oplossingen voor de gemeenschap te creëren.',
      stats: {
        projects: 'Actieve projecten',
        openSource: 'Open Source',
        madeIn: 'Made in BE'
      },
      mission: {
        title: 'Waarom steunen?',
        development: {
          title: 'Ontwikkeling & Onderhoud',
          desc: 'Houd de tools actief en up-to-date'
        },
        docs: {
          title: 'Documentatie',
          desc: 'Tutorials, gidsen en gemeenschapsondersteuning'
        },
        innovation: {
          title: 'Innovatie',
          desc: 'Nieuwe functies en experimentele projecten'
        },
        infrastructure: {
          title: 'Infrastructuur',
          desc: 'Hosting, domeinen, ontwikkeltools'
        }
      },
      projects: {
        title: 'Gesteunde projecten',
        subtitle: 'Elke bijdrage helpt deze initiatieven te ontwikkelen',
        clickForPerks: '→ Klik om de voordelen te zien',
        categories: {
          civicTech: 'Civic Tech',
          urbanPlanning: 'Stedenbouw',
          blog: 'Tech Blog',
          ai: 'AI & Workflows',
          marketplace: 'Marketplace',
          media: 'Media',
          heritage: 'Erfgoed',
          music: 'Muziek',
          events: 'Evenementen',
          housing: 'Huisvesting',
          devTools: 'Dev Tools'
        }
      },
      modal: {
        whatYouSupport: 'Wat u steunt',
        yourPerks: 'Uw voordelen',
        close: 'Sluiten'
      },
      projectDetails: {
        stadiumCheck: {
          name: 'Stadium Check',
          desc: 'Verificatie beschikbaarheid stadions',
          category: 'civicTech',
          support: [
            'Real-time verificatie API',
            'Multi-stadion integratie',
            'Automatische meldingen',
            'Onderhouden open source code'
          ],
          perks: [
            'Prioritaire toegang tot nieuwe functies',
            'Toegewijde technische ondersteuning',
            'Vermeldingen in projectdankwoord',
            'Toegang tot roadmap en ontwikkelingsbeslissingen'
          ]
        },
        monloyer: {
          name: 'monloyer.brussels',
          desc: 'Huurprijscalculator - huurdersverdediging',
          category: 'civicTech',
          support: [
            'Huurcalculator voor Brussel',
            'Bijgewerkte database',
            'Tool voor huurdersbescherming',
            'Samenwerking met vakbond Wuune'
          ],
          perks: [
            'Gedetailleerde documentatie van het algoritme',
            'Toegang tot gegevens en methodologie',
            'Deelname aan regelgevende updates',
            'Bijdragerbadge getoond op de site'
          ]
        },
        myceliumBlog: {
          name: 'Mycelium Blog',
          desc: 'Deze blog! AI Workflows',
          category: 'blog',
          support: [
            'Geautomatiseerde workflows met AI',
            'Interactieve kennisgraaf',
            'Multi-repo aggregatie',
            'Gedeelde patronen en best practices'
          ],
          perks: [
            'Vroege toegang tot nieuwe posts',
            'Exclusieve tutorials over AI workflows',
            'Uw naam op de "Bijdragers" pagina',
            'Invloed op te behandelen onderwerpen'
          ]
        },
        claudeSkills: {
          name: 'Claude Code Skills',
          desc: 'Skillbibliotheek voor Claude',
          category: 'ai',
          support: [
            'Herbruikbare skills voor Claude Code',
            'Volledige documentatie',
            'Voorbeelden en templates',
            'Integratie met bestaande projecten'
          ],
          perks: [
            'Toegang tot premium skills',
            'Prioritaire ondersteuning voor integratie',
            'Aangepaste skills op verzoek',
            'Toegang tot privé Discord server'
          ]
        },
        creditCastor: {
          name: 'Credit Castor',
          desc: 'Calculator cohousing - aankoop in verdeling',
          category: 'housing',
          support: [
            'Berekeningsinstrument voor cohousing projecten',
            'Financiële simulaties',
            'Hulp bij juridische structurering',
            'Bronnen en documentatie'
          ],
          perks: [
            'Templates van juridische documenten',
            'Gratis technische consultaties',
            'Netwerk van contacten (notarissen, architecten)',
            'Toegang tot cohousing werkgroep'
          ]
        },
        deuxmains: {
          name: 'DeuxMains',
          desc: 'Lokale solidaire marketplace',
          category: 'marketplace',
          support: [
            'Lokaal uitwisselingsplatform',
            'Circulaire economie',
            'Geen commissie',
            'Gemeenschapsfocus'
          ],
          perks: [
            'Premium zichtbaarheid voor uw advertenties',
            'Badge "Supporter" op uw profiel',
            'Vroege toegang tot nieuwe categorieën',
            'Deelname aan gemeenschapsbeslissingen'
          ]
        },
        nationale4: {
          name: 'Nationale4',
          desc: 'Onafhankelijke Belgische media',
          category: 'media',
          support: [
            'Onafhankelijke onderzoeksjournalistiek',
            'Berichtgeving over Belgische kwesties',
            'Volledige redactionele vrijheid',
            'Gratis toegang tot artikelen'
          ],
          perks: [
            'Toegang tot artikelen in preview',
            'Exclusieve nieuwsbrief met diepgaande analyses',
            'Uitnodiging voor evenementen en conferenties',
            'Publieke erkenning als mecenas'
          ]
        },
        fermeDuTemple: {
          name: 'Ferme du Temple',
          desc: 'Ecosysteem erfgoedrestauratie',
          category: 'heritage',
          support: [
            'Behoud van landelijk erfgoed',
            'Ontmoetings- en evenementenplaats',
            'Trainingen en workshops',
            'Duurzame en ecologische ontwikkeling'
          ],
          perks: [
            'Uitnodigingen voor privé-evenementen',
            'Workshops en trainingen met korting',
            'Exclusieve rondleiding op de site',
            'Prioriteit voor lokale en ambachtelijke producten'
          ]
        },
        womb: {
          name: 'Womb',
          desc: 'Therapeutische muziek voor introverten',
          category: 'music',
          support: [
            'Therapeutische muzieksessies',
            'Veilige omgeving voor introverten',
            'Collectieve geluidsverkenning',
            'Toegankelijkheid en inclusie'
          ],
          perks: [
            'Prioritaire toegang tot sessies',
            'Audio-opnames van sessies',
            'Gratis ontdekkingsworkshops',
            'Kortingen op merchandising en evenementen'
          ]
        },
        lagendwa: {
          name: 'Lagendwa',
          desc: 'Open source festival app',
          category: 'events',
          support: [
            'Mobiele app voor festivals',
            'Herbruikbare open source code',
            'Real-time programmering',
            'Interactieve kaart en meldingen'
          ],
          perks: [
            'Uw logo in de app',
            'Gratis deployment voor uw evenement',
            'Prioritaire technische ondersteuning',
            'Custom functies op verzoek'
          ]
        },
        claudeConfig: {
          name: 'Claude Config',
          desc: 'Claude Code configuratiebeheerder',
          category: 'devTools',
          support: [
            'Claude Code configuratiebeheerder',
            'Delen en synchroniseren van configs',
            'Herbruikbare templates',
            'Productiviteitsboost'
          ],
          perks: [
            'Toegang tot premium CLI',
            'Gedeelde configuratiebibliotheek',
            'Prioritaire ondersteuning',
            'Exclusieve documentatie en tutorials',
            'Uw naam in de hall of fame van bijdragers'
          ]
        },
        threeDS: {
          name: '3DS (3dsoudviz)',
          desc: 'Open source audio visualizer voor VJs',
          category: 'creative',
          support: [
            'Real-time audiovisualisaties',
            'Opensource tool voor VJs en artiesten',
            'Browser-compatibel',
            'Visuele effecten gesynchroniseerd met geluid'
          ],
          perks: [
            'Nieuwe visuele effecten als eerste',
            'Aangepaste visualisatie templates',
            'Uw naam in de credits',
            'Technische ondersteuning voor uw optredens'
          ]
        }
      },
      donations: {
        title: 'Bijdragemogelijkheden',
        subtitle: 'Kies het platform dat bij u past',
        toSetup: 'Binnenkort te configureren',
        platforms: {
          githubSponsors: 'GitHub Sponsors',
          kofi: 'Ko-fi',
          buyMeACoffee: 'Buy Me a Coffee',
          patreon: 'Patreon',
          liberapay: 'Liberapay',
          paypal: 'PayPal',
          openCollective: 'Open Collective',
          bankTransfer: 'Bankoverschrijving'
        }
      },
      proBono: {
        title: 'Pro Bono Marketplace',
        subtitle: 'Belgische verenigingen verbinden met vrijwillige IT-specialisten',
        desc: 'Een platform waar verenigingen hun IT-behoeften kunnen voorstellen en waar ontwikkelaars kunnen bijdragen aan projecten met sociale impact.',
        categories: {
          title: 'Beschikbare diensten',
          webDev: {
            icon: '🌐',
            name: 'Webontwikkeling',
            desc: 'Sites, apps, API\'s'
          },
          mobile: {
            icon: '📱',
            name: 'Mobiele Apps',
            desc: 'iOS, Android, React Native'
          },
          automation: {
            icon: '⚡',
            name: 'Automatisering',
            desc: 'Workflows, scripts, integraties'
          },
          database: {
            icon: '🗄️',
            name: 'Databases',
            desc: 'Design, migratie, optimalisatie'
          },
          infra: {
            icon: '☁️',
            name: 'Infrastructuur',
            desc: 'Hosting, CI/CD, DevOps'
          },
          training: {
            icon: '📚',
            name: 'Training',
            desc: 'Documentatie, tutorials, ondersteuning'
          }
        },
        cta: {
          associations: {
            title: 'Bent u een vereniging?',
            desc: 'Stel uw IT-project voor en vind gekwalificeerde vrijwilligers',
            button: 'Project voorstellen'
          },
          specialists: {
            title: 'Bent u IT-specialist?',
            desc: 'Ontdek projecten en bied uw pro bono hulp aan',
            button: 'Projecten bekijken'
          }
        },
        howItWorks: {
          title: 'Hoe werkt het?',
          step1: {
            title: 'Indiening',
            desc: 'De vereniging beschrijft haar IT-behoefte via GitHub'
          },
          step2: {
            title: 'Beoordeling',
            desc: 'Het project wordt geëvalueerd en gevalideerd'
          },
          step3: {
            title: 'Match',
            desc: 'Specialisten bieden hun hulp aan'
          },
          step4: {
            title: 'Samenwerking',
            desc: 'Samen het project realiseren'
          }
        },
        belgium: 'Focus België 🇧🇪'
      },
      thanks: {
        title: 'Bedankt! 🍄',
        message: 'Uw steun laat het mycelium ecosysteem groeien. Elke bijdrage, in welke vorm dan ook, helpt deze projecten levend en toegankelijk te houden voor iedereen.'
      }
    }
  },
  en: {
    nav: {
      posts: 'Posts',
      skills: 'Skills',
      patterns: 'Patterns',
      graph: 'Graph',
      support: 'Support'
    },
    footer: {
      builtWith: 'Built with Astro, React, and Claude Code',
      tagline: 'Knowledge grows like mycelium, interconnected beneath the surface'
    },
    support: {
      title: 'Support the ecosystem!',
      subtitle: 'Your support helps maintain these open source tools and create new solutions for the community.',
      stats: {
        projects: 'Active projects',
        openSource: 'Open Source',
        madeIn: 'Made in BE'
      },
      mission: {
        title: 'Why support?',
        development: {
          title: 'Development & Maintenance',
          desc: 'Keep the tools active and up-to-date'
        },
        docs: {
          title: 'Documentation',
          desc: 'Tutorials, guides, and community support'
        },
        innovation: {
          title: 'Innovation',
          desc: 'New features and experimental projects'
        },
        infrastructure: {
          title: 'Infrastructure',
          desc: 'Hosting, domains, development tools'
        }
      },
      projects: {
        title: 'Supported projects',
        subtitle: 'Each contribution helps develop these initiatives',
        clickForPerks: '→ Click to see perks',
        categories: {
          civicTech: 'Civic Tech',
          urbanPlanning: 'Urban Planning',
          blog: 'Tech Blog',
          ai: 'AI & Workflows',
          marketplace: 'Marketplace',
          media: 'Media',
          heritage: 'Heritage',
          music: 'Music',
          events: 'Events',
          housing: 'Housing',
          devTools: 'Dev Tools'
        }
      },
      modal: {
        whatYouSupport: 'What you support',
        yourPerks: 'Your perks',
        close: 'Close'
      },
      projectDetails: {
        stadiumCheck: {
          name: 'Stadium Check',
          desc: 'Stadium availability verification',
          category: 'civicTech',
          support: [
            'Real-time verification API',
            'Multi-stadium integration',
            'Automatic notifications',
            'Maintained open source code'
          ],
          perks: [
            'Priority access to new features',
            'Dedicated technical support',
            'Mentions in project acknowledgments',
            'Access to roadmap and development decisions'
          ]
        },
        monloyer: {
          name: 'monloyer.brussels',
          desc: 'Rent calculator - tenant defense',
          category: 'civicTech',
          support: [
            'Rent calculator for Brussels',
            'Updated database',
            'Tenant defense tool',
            'Collaboration with Wuune union'
          ],
          perks: [
            'Detailed algorithm documentation',
            'Access to data and methodology',
            'Participation in regulatory updates',
            'Contributor badge displayed on site'
          ]
        },
        myceliumBlog: {
          name: 'Mycelium Blog',
          desc: 'This blog! AI Workflows',
          category: 'blog',
          support: [
            'Automated workflows with AI',
            'Interactive knowledge graph',
            'Multi-repo aggregation',
            'Shared patterns and best practices'
          ],
          perks: [
            'Early access to new posts',
            'Exclusive tutorials on AI workflows',
            'Your name on the "Contributors" page',
            'Influence on topics to cover'
          ]
        },
        claudeSkills: {
          name: 'Claude Code Skills',
          desc: 'Skills library for Claude',
          category: 'ai',
          support: [
            'Reusable skills for Claude Code',
            'Complete documentation',
            'Examples and templates',
            'Integration with existing projects'
          ],
          perks: [
            'Access to premium skills',
            'Priority support for integration',
            'Custom skills on request',
            'Access to private Discord server'
          ]
        },
        creditCastor: {
          name: 'Credit Castor',
          desc: 'Cohousing calculator - purchase in division',
          category: 'housing',
          support: [
            'Calculation tool for cohousing projects',
            'Financial simulations',
            'Legal structuring assistance',
            'Resources and documentation'
          ],
          perks: [
            'Legal document templates',
            'Free technical consultations',
            'Network of contacts (notaries, architects)',
            'Access to cohousing working group'
          ]
        },
        deuxmains: {
          name: 'DeuxMains',
          desc: 'Local solidarity marketplace',
          category: 'marketplace',
          support: [
            'Local exchange platform',
            'Circular economy',
            'Zero commission',
            'Community focus'
          ],
          perks: [
            'Premium visibility for your listings',
            '"Supporter" badge on your profile',
            'Early access to new categories',
            'Participation in community decisions'
          ]
        },
        nationale4: {
          name: 'Nationale4',
          desc: 'Independent Belgian media',
          category: 'media',
          support: [
            'Independent investigative journalism',
            'Coverage of Belgian issues',
            'Total editorial freedom',
            'Free access to articles'
          ],
          perks: [
            'Preview access to articles',
            'Exclusive newsletter with in-depth analyses',
            'Invitation to events and conferences',
            'Public recognition as a patron'
          ]
        },
        fermeDuTemple: {
          name: 'Ferme du Temple',
          desc: 'Heritage restoration ecosystem',
          category: 'heritage',
          support: [
            'Rural heritage preservation',
            'Meeting and event venue',
            'Training and workshops',
            'Sustainable and ecological development'
          ],
          perks: [
            'Invitations to private events',
            'Discounted workshops and training',
            'Exclusive site tour',
            'Priority for local and artisanal products'
          ]
        },
        womb: {
          name: 'Womb',
          desc: 'Therapeutic music for introverts',
          category: 'music',
          support: [
            'Therapeutic music sessions',
            'Safe environment for introverts',
            'Collective sound exploration',
            'Accessibility and inclusion'
          ],
          perks: [
            'Priority access to sessions',
            'Audio recordings of sessions',
            'Free discovery workshops',
            'Discounts on merchandising and events'
          ]
        },
        lagendwa: {
          name: 'Lagendwa',
          desc: 'Open source festival app',
          category: 'events',
          support: [
            'Mobile app for festivals',
            'Reusable open source code',
            'Real-time programming',
            'Interactive map and notifications'
          ],
          perks: [
            'Your logo in the app',
            'Free deployment for your event',
            'Priority technical support',
            'Custom features on request'
          ]
        },
        claudeConfig: {
          name: 'Claude Config',
          desc: 'Claude Code config manager',
          category: 'devTools',
          support: [
            'Claude Code configuration manager',
            'Config sharing and syncing',
            'Reusable templates',
            'Productivity boost'
          ],
          perks: [
            'Access to premium CLI',
            'Shared config library',
            'Priority support',
            'Exclusive documentation and tutorials',
            'Your name in the contributors hall of fame'
          ]
        },
        threeDS: {
          name: '3DS (3dsoudviz)',
          desc: 'Open source audio visualizer for VJs',
          category: 'creative',
          support: [
            'Real-time audio visualizations',
            'Opensource tool for VJs and artists',
            'Browser compatible',
            'Visual effects synchronized to sound'
          ],
          perks: [
            'New visual effects first',
            'Custom visualization templates',
            'Your name in the credits',
            'Technical support for your performances'
          ]
        }
      },
      donations: {
        title: 'Ways to contribute',
        subtitle: 'Choose the platform that suits you',
        toSetup: 'To be set up soon',
        platforms: {
          githubSponsors: 'GitHub Sponsors',
          kofi: 'Ko-fi',
          buyMeACoffee: 'Buy Me a Coffee',
          patreon: 'Patreon',
          liberapay: 'Liberapay',
          paypal: 'PayPal',
          openCollective: 'Open Collective',
          bankTransfer: 'Bank Transfer'
        }
      },
      proBono: {
        title: 'Pro Bono Marketplace',
        subtitle: 'Connecting Belgian associations with volunteer IT specialists',
        desc: 'A platform where associations can propose their IT needs and where developers can contribute to projects with social impact.',
        categories: {
          title: 'Available services',
          webDev: {
            icon: '🌐',
            name: 'Web Development',
            desc: 'Sites, apps, APIs'
          },
          mobile: {
            icon: '📱',
            name: 'Mobile Apps',
            desc: 'iOS, Android, React Native'
          },
          automation: {
            icon: '⚡',
            name: 'Automation',
            desc: 'Workflows, scripts, integrations'
          },
          database: {
            icon: '🗄️',
            name: 'Databases',
            desc: 'Design, migration, optimization'
          },
          infra: {
            icon: '☁️',
            name: 'Infrastructure',
            desc: 'Hosting, CI/CD, DevOps'
          },
          training: {
            icon: '📚',
            name: 'Training',
            desc: 'Documentation, tutorials, support'
          }
        },
        cta: {
          associations: {
            title: 'Are you an association?',
            desc: 'Propose your IT project and find qualified volunteers',
            button: 'Propose a project'
          },
          specialists: {
            title: 'Are you an IT specialist?',
            desc: 'Discover projects and offer your pro bono help',
            button: 'View projects'
          }
        },
        howItWorks: {
          title: 'How it works?',
          step1: {
            title: 'Submission',
            desc: 'The association describes its IT need via GitHub'
          },
          step2: {
            title: 'Review',
            desc: 'The project is evaluated and validated'
          },
          step3: {
            title: 'Match',
            desc: 'Specialists offer their help'
          },
          step4: {
            title: 'Collaboration',
            desc: 'Realize the project together'
          }
        },
        belgium: 'Belgium Focus 🇧🇪'
      },
      thanks: {
        title: 'Thank you! 🍄',
        message: 'Your support grows the mycelium ecosystem. Each contribution, in whatever form, helps keep these projects alive and accessible to everyone.'
      }
    }
  }
} as const;

export type Locale = keyof typeof translations;

export function useTranslations(lang: Locale = 'fr') {
  return translations[lang] || translations.fr;
}
