---
title: >-
  Empreinte carbone et eau : quatre activités comparées, fabrication comprise
date: '2026-07-02'
status: published
privacy: public
lang: fr
tags:
  - empreinte-carbone
  - empreinte-eau
  - analyse-cycle-de-vie
  - numerique-responsable
  - alimentation
  - mobilite
  - externalites
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  Carbone et eau de quatre unités fonctionnelles — 1 h de transcription IA,
  1 h de Netflix en 1080p, 100 km en petite voiture essence, 1 kg de bœuf bio —
  du berceau à l'usage, en intégrant un maximum d'externalités : fabrication du
  matériel, extraction des matériaux, pollution de l'air et de l'eau,
  biodiversité et coût d'opportunité des sols.
---

## Le périmètre

Quatre unités fonctionnelles, chacune ramenée à une base comparable : **1 heure de transcription automatique** (type Notta.ai / Whisper), **1 heure de Netflix en 1080p**, **un trajet de 100 km en petite voiture essence**, et **1 kg de bœuf bio**. Les chiffres sont donnés *par unité fonctionnelle*, du berceau à l'usage lorsque les données le permettent.

La consigne de départ était d'aller plus loin qu'un simple bilan « à l'usage » et d'**intégrer un maximum d'externalités** — au premier rang desquelles la **fabrication des objets impliqués** (serveurs et GPU, téléviseurs et téléphones, la voiture elle-même) et les pollutions qui n'apparaissent jamais sur une facture d'énergie : usage des sols, eutrophisation, particules hors échappement, déchets électroniques, biodiversité, résistance aux antibiotiques.

Toutes les valeurs sont des estimations centrales assorties de fourchettes. La qualité des preuves varie énormément d'une ligne à l'autre — je l'indique systématiquement.

## Synthèse

| Activité | Carbone (CO₂e) | Eau | Qualité des preuves |
|---|---|---|---|
| 1 h de transcription IA | ~3 g (1–10 g) | ~0,01 L (0,005–0,03 L) | Faible — estimation ascendante, pas de donnée éditeur |
| 1 h de Netflix, 1080p | ~50 g (30–90 g) | ~0,5 L (0,1–2 L) | Moyenne — IEA / Carbon Trust / DIMPACT |
| 100 km, petite voiture essence | ~15–17 kg à l'usage **+ ~3–4 kg de fabrication** | ~10–20 L | Forte — chimie de combustion + ACV revues par les pairs |
| 1 kg de bœuf bio | ~60–99 kg | ~15 400 L | Forte — Poore & Nemecek 2018 ; Mekonnen & Hoekstra 2012 |

Deux chiffres du brief initial ont été revus à la baisse après vérification : l'**eau du carburant** (le facteur King & Webber en consommation nette est ~1,4–2,9 L/L, pas 2,8–6,6) et l'**énergie de transcription** (les mesures publiées donnent ~0,002–0,01 kWh/heure-audio, un ordre de grandeur sous l'estimation haute initiale). En sens inverse, la **fabrication de la voiture** — écartée dans le brief comme un « petit incrément » — pèse en réalité ~3 à 4 kg CO₂e par 100 km, soit **20 à 27 % en plus** de la phase d'usage : elle mérite sa colonne.

## Ordres de grandeur

En prenant l'heure de transcription comme unité (= 1) :

- **Carbone** : Netflix ≈ 15–20×, voiture ≈ 5 000×, bœuf ≈ 20 000–30 000×.
- **Eau** : Netflix ≈ 50×, voiture ≈ 1 500×, bœuf ≈ 1 500 000×.

Le message tient en une phrase : les quatre activités s'étalent sur **quatre à cinq ordres de grandeur** en carbone et **six** en eau. Les deux activités numériques sont des erreurs d'arrondi face au bœuf ; la voiture se loge entre les deux. Attention toutefois : plus l'écart est grand, plus le dénominateur (la transcription) est incertain — ces ratios donnent la forme du paysage, pas une précision au pourcent.

<figure class="fp-viz not-prose" style="margin:2rem 0">
<style>
.fp-viz{--bar:#256abf;--ink:#1a1a19;--muted:#6b6a66;--grid:rgba(11,11,11,0.13);--surface:#ffffff}
.dark .fp-viz{--bar:#3987e5;--ink:#ededed;--muted:#9a988f;--grid:rgba(255,255,255,0.15);--surface:#111827}
.fp-viz figcaption{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:0.8rem;color:var(--muted);margin-top:0.5rem;line-height:1.4}
</style>
<svg viewBox="0 0 760 228" width="100%" role="img" aria-label="Carbone par unité fonctionnelle : transcription environ 3 g, Netflix environ 50 g, voiture environ 18 000 g, bœuf environ 80 000 g de CO2e" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Carbone par unité fonctionnelle</title>
  <desc>transcription environ 3 g, Netflix environ 50 g, voiture environ 18 000 g, bœuf environ 80 000 g de CO2e</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Carbone par unité fonctionnelle</text>
  <text x="8" y="36" font-size="10.5" fill="var(--muted)">grammes de CO₂e · échelle logarithmique (chaque graduation = ×10)</text>
  <line x1="176.0" y1="52" x2="176.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="176.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁰</text>
  <line x1="276.0" y1="52" x2="276.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="276.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10¹</text>
  <line x1="376.0" y1="52" x2="376.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="376.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10²</text>
  <line x1="476.0" y1="52" x2="476.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="476.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10³</text>
  <line x1="576.0" y1="52" x2="576.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="576.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁴</text>
  <line x1="676.0" y1="52" x2="676.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="676.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁵</text>
  <line x1="176" y1="200" x2="676" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="162" y="74.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Transcription IA — 1 h</text>
  <circle cx="223.7" cy="70.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="236.7" y="74.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 3 g</text>
  <text x="162" y="111.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Netflix 1080p — 1 h</text>
  <circle cx="345.9" cy="107.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="358.9" y="111.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 50 g</text>
  <text x="162" y="148.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Voiture essence — 100 km</text>
  <circle cx="601.5" cy="144.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="614.5" y="148.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 18 000 g</text>
  <text x="162" y="185.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Bœuf bio — 1 kg</text>
  <circle cx="666.3" cy="181.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="679.3" y="185.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 80 000 g</text>
</svg>
<svg viewBox="0 0 760 228" width="100%" role="img" aria-label="Eau par unité fonctionnelle : transcription environ 0,01 L, Netflix environ 0,5 L, voiture environ 15 L, bœuf environ 15 400 L" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Eau par unité fonctionnelle</title>
  <desc>transcription environ 0,01 L, Netflix environ 0,5 L, voiture environ 15 L, bœuf environ 15 400 L</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Eau par unité fonctionnelle</text>
  <text x="8" y="36" font-size="10.5" fill="var(--muted)">litres · échelle logarithmique (chaque graduation = ×10)</text>
  <line x1="176.0" y1="52" x2="176.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="176.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁻³</text>
  <line x1="238.5" y1="52" x2="238.5" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="238.5" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁻²</text>
  <line x1="301.0" y1="52" x2="301.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="301.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁻¹</text>
  <line x1="363.5" y1="52" x2="363.5" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="363.5" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁰</text>
  <line x1="426.0" y1="52" x2="426.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="426.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10¹</text>
  <line x1="488.5" y1="52" x2="488.5" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="488.5" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10²</text>
  <line x1="551.0" y1="52" x2="551.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="551.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10³</text>
  <line x1="613.5" y1="52" x2="613.5" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="613.5" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁴</text>
  <line x1="676.0" y1="52" x2="676.0" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="676.0" y="214" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">10⁵</text>
  <line x1="176" y1="200" x2="676" y2="200" stroke="var(--grid)" stroke-width="1"/>
  <text x="162" y="74.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Transcription IA — 1 h</text>
  <circle cx="238.5" cy="70.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="251.5" y="74.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 0,01 L</text>
  <text x="162" y="111.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Netflix 1080p — 1 h</text>
  <circle cx="344.7" cy="107.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="357.7" y="111.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 0,5 L</text>
  <text x="162" y="148.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Voiture essence — 100 km</text>
  <circle cx="437.0" cy="144.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="450.0" y="148.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 15 L</text>
  <text x="162" y="185.5" text-anchor="end" font-size="11.5" fill="var(--ink)">Bœuf bio — 1 kg</text>
  <circle cx="625.2" cy="181.5" r="7" fill="var(--bar)" stroke="var(--surface)" stroke-width="2"/>
  <text x="638.2" y="185.5" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">≈ 15 400 L</text>
</svg>
<figcaption>Chaque activité est placée sur une échelle logarithmique : un pas vers la droite = un facteur 10. La voiture inclut l'usage <em>et</em> la fabrication amortie ; les valeurs reprennent le tableau de synthèse. La transcription porte une incertitude d'un ordre de grandeur.</figcaption>
</figure>

## Une note de méthode

Les frontières comptent autant que les chiffres. J'ai retenu trois principes :

1. **Distinguer l'usage et l'incorporé.** L'énergie consommée pendant l'activité (rouler, streamer, transcrire) est une chose ; le carbone et l'eau « embarqués » dans les objets qu'elle mobilise en sont une autre. Pour le numérique, l'incorporé domine souvent — c'est le point le plus contre-intuitif de cet article.
2. **Amortir honnêtement.** Une voiture ou un téléviseur ne se fabrique qu'une fois ; répartir cette empreinte sur la durée de vie suppose des hypothèses de kilométrage ou d'heures d'usage que j'explicite à chaque fois.
3. **Signaler la qualité des preuves.** Un facteur de combustion est de la chimie fixe ; une estimation d'énergie GPU sans donnée constructeur est une reconstruction. Les deux figurent ici, mais pas au même titre.

---

## 1 kg de bœuf bio — le terme dominant

### Carbone et eau

- **Carbone : ~99 kg CO₂e/kg** pour un bœuf issu d'un troupeau allaitant dédié ; **~60 kg** en moyenne mondiale toutes sources confondues (troupeaux allaitants + laitiers, dont la charge est partagée avec le lait). Source : **Poore & Nemecek (2018), *Science*** — une méta-analyse de ~38 700 fermes dans 119 pays, la meilleure base ACV disponible sur l'alimentation.
- **Eau : ~15 400 L/kg** (moyenne mondiale conventionnelle). Source : **Mekonnen & Hoekstra (2012), *Ecosystems***. La décomposition par « couleur » est instructive :
  - **eau verte** (pluie utilisée par les fourrages et pâtures) : **~94 %**, soit ~14 400 L ;
  - **eau bleue** (irrigation, prélèvements) : **~4 %**, soit ~550 L ;
  - **eau grise** (volume d'eau propre nécessaire pour diluer l'azote et le phosphore lessivés jusqu'aux normes) : **~3 %**, soit **~450 L**. C'est cette dernière fraction qui matérialise la pollution : ~98 % de l'empreinte eau du bœuf est logée dans la production de l'alimentation animale.

Selon le système, la fourchette est énorme : ~3 000–4 000 L/kg en parc d'engraissement céréalier, jusqu'à ~26 000 L/kg en élevage extensif de zone aride (Gerbens-Leenes *et al.* 2013).

### La nuance « bio » et « nourri à l'herbe » (importante et contre-intuitive)

Le bio **ne réduit pas** l'empreinte carbone ou eau *par kilo* et l'augmente souvent légèrement :

- **Clark & Tilman (2017), *Environmental Research Letters*** : pas de différence significative de GES par kg de bœuf entre bio et conventionnel. Le bio a en général un impact plus faible *par hectare*, mais similaire ou supérieur *par unité d'aliment*, car les rendements sont plus bas.
- **Cusack *et al.* (2021), *Global Change Biology*** (méta-analyse de ~292 comparaisons) : le bœuf fini à l'herbe émet **+30 % (± 12 %) de GES par kg** que le bœuf de parc d'engraissement, parce que l'animal grandit plus lentement, vit plus longtemps et fermente un fourrage plus fibreux — donc **plus de méthane entérique par kilo de viande finie**.
- **Hayek *et al.* (2025), *PNAS*** : le bœuf nourri à l'herbe américain est *aussi* intensif en carbone que le bœuf industriel, et ~10× plus que les alternatives riches en protéines ; même avec des hypothèses optimistes de stockage de carbone dans les sols, ~90 % des scénarios « herbe » dépassent encore l'industriel.

Les vrais bénéfices du bio sont **ailleurs** que dans les deux métriques demandées : pas de pesticides ni d'engrais de synthèse, pas d'antibiotiques de routine, meilleure biodiversité et meilleurs sols locaux, bien-être animal. À retenir : traiter les ~60–99 kg de carbone et ~15 400 L d'eau comme des ancrages *conventionnels* que le bio **égale ou dépasse modestement** sur le carbone.

### Les externalités que le carbone et l'eau ne voient pas

C'est ici que le bœuf creuse vraiment l'écart :

- **Usage des sols : ~326 m²·an/kg** pour un troupeau allaitant (Poore & Nemecek 2018) — soit ~93× le tofu et ~44× les pois. Le bœuf issu de troupeaux laitiers tombe à ~43 m² (charge partagée avec le lait).
- **Déforestation** : l'élevage bovin est le **premier moteur mondial** de déforestation tropicale — ~45 Mha entre 2001 et 2015, ~5× la deuxième matière première (Pendrill *et al.* via *Our World in Data*). En Amazonie brésilienne, la pâture représente **~80 %** des terres déboisées.
- **Eutrophisation : ~301 g PO₄-eq/kg** (Poore & Nemecek 2018) — ~40 à 50× les pois ou le tofu. Azote et phosphore ruissellent, nourrissent les efflorescences algales et les « zones mortes » (golfe du Mexique).
- **Biodiversité** : l'**IPBES (2019)** classe le changement d'usage des sols — essentiellement l'expansion agricole — comme **premier moteur** de l'érosion de la biodiversité terrestre ; le pâturage et les cultures fourragères occupent plus des deux tiers des terres agricoles.
- **Méthane et protoxyde d'azote** : la fermentation entérique domine (facteur IPCC Tier 2 ~36 kg CH₄/tête/an pour un bovin de boucherie) ; le CH₄ a un PRG₁₀₀ de ~27–30 (IPCC AR6), le N₂O du fumier et des engrais ~273.
- **Antibiotiques et antibiorésistance** : les bovins sont les **premiers consommateurs d'antimicrobiens** de l'élevage — ~40 700 t/an, soit ~54 % du total mondial (Mulchandani *et al.* 2023). Le bio, lui, interdit l'usage de routine.
- **Ammoniac (NH₃)** : le bœuf a la **plus faible efficience azotée** des viandes majeures (~1 kg de NH₃-N perdu par kg d'azote dans la viande) ; l'ammoniac est un précurseur de particules fines PM2,5 — une externalité sanitaire directe.
- **Coût d'opportunité carbone des terres** : la terre occupée par le bœuf pourrait stocker du carbone si on la laissait se reforester. **Hayek *et al.* (2021), *Nature Sustainability*** estiment que restaurer les terres libérées par une bascule vers le végétal pourrait séquestrer **332–547 Gt CO₂ d'ici 2050**, soit 99–163 % du budget carbone pour rester sous 1,5 °C — les ruminants dominent cette opportunité à cause de leur emprise foncière.

---

## 100 km, petite voiture essence — le terme intermédiaire

### À l'usage

- Consommation réelle ~5–7 L/100 km ; retenons **6 L**.
- **Carbone à l'échappement** : 6 L × **2,31 kg CO₂/L** ≈ 13,9 kg (facteur DEFRA ; l'EPA donne ~2,35 kg/L). En ajoutant l'amont du carburant (extraction, raffinage, distribution, ~+15–25 %), on obtient un **« du puits à la roue » de ~15–17 kg CO₂e** par 100 km. Fourchette 12–18 kg selon 5–7 L/100 km. La combustion elle-même ne consomme pas d'eau.
- **Eau du carburant** : 6 L × **~1,4–2,9 L d'eau/L d'essence** (consommation nette, extraction + raffinage ; King & Webber 2008 / GREET) ≈ **8–17 L**, centre ~12 L. *(Le brief initial citait 2,8–6,6 L/L : ce haut de fourchette correspond en réalité aux prélèvements bruts ou à des bruts en récupération assistée, pas à la consommation nette de King & Webber.)* Les sables bitumineux ou des biocarburants irrigués feraient monter ce chiffre.
- **Électricité de référence pour l'eau** : ~1,2–2,6 L/kWh en consommation nette (Macknick *et al.* 2012) — utile plus bas pour le numérique.

### La fabrication de la voiture — le « petit incrément » qui n'en est pas un

Le brief l'écartait ; les données la remettent au centre.

- **Fabrication (du berceau à la sortie d'usine) : ~6 t CO₂e** pour une petite voiture essence (segment A/B, ~1 155 kg), **~7,2 t** pour une compacte. Source : **ICCT (Bieker, 2021)**, dont les chiffres de production proviennent de l'ACV de référence **Ricardo/ifeu/E4Tech (2020)** pour la Commission européenne (facteur ~5,2 t CO₂e par tonne de véhicule). **Environ les trois quarts** viennent de l'**acier**.
- **Amortie sur la durée de vie** (~198 000 km pour une petite voiture selon l'ICCT) : **~3 kg CO₂e/100 km** ; **~4 kg/100 km** si l'on suppose 150 000 km. La fabrication ajoute donc **~20–27 %** au carbone de la phase d'usage — soit **~12–14 % de l'empreinte totale sur le cycle de vie**, l'usage pesant ~80–90 %.
- **Matériaux et extraction** (petite voiture ~1 100–1 300 kg) :
  - **acier** ~700–900 kg à ~1,9 t CO₂/t (World Steel Association) → **~1,3 t CO₂** incorporé, plus mines de fer, charbon à coke, stériles ;
  - **aluminium** ~60–120 kg à ~14,8 t CO₂e/t en primaire (International Aluminium Institute) → **~0,8–1,2 t**, plus la bauxite (déforestation tropicale) et les « boues rouges » caustiques (pH ~13) ;
  - **plastiques** ~100–130 kg (~2,5 kg CO₂e/kg) → **~0,3 t**, dérivés du pétrole ;
  - **cuivre** ~20 kg (faisceau électrique), extrait de minerais à ~0,5–1 % (stériles, drainage acide) ;
  - **métaux du groupe platine** ~5–15 g dans le pot catalytique (Pt/Pd/Rh) — parmi les métaux les plus intensifs en énergie au gramme ;
  - **batterie plomb-acide** ~15–20 kg (dont ~60 % de plomb), mais recyclée à >95 % en boucle fermée en Europe.
- **Eau de fabrication** : l'eau *directe* en usine d'assemblage est modeste — **~1,5–4 m³/voiture** (BMW rapporte ~1,7 m³), soit **~2–3 L/100 km** amortis. Le chiffre folklorique de « 148 000 L par voiture » qui circule en ligne **n'est traçable à aucune source primaire crédible** ; s'il a un sens, c'est comme eau *virtuelle* de toute la chaîne amont (acier, aluminium, pneus), pas comme eau de robinet — je le signale sans le retenir comme référence.

### Les pollutions hors CO₂

- **Polluants d'échappement** (norme Euro 6, essence) : NOx ~60 mg/km en labo, **~84 mg/km en conditions réelles** (ICCT/TRUE 2021) ; PM ~5 mg/km ; CO ~1 g/km ; hydrocarbures ~68–100 mg/km. Coût sanitaire externe estimé à **~1,2 centime d'euro/km** (moyenne du parc, CE Delft 2019 — une essence est plutôt sous cette moyenne dominée par le diesel). Dommage par kg : NOx ~10–27 €/kg, PM2,5 ~28–110 €/kg en zone urbaine.
- **Usure des pneus et des freins (particules hors échappement)** : désormais comparable, voire supérieure, à l'échappement — l'**OCDE (2020)** en fait le titre de son rapport, et projette les particules hors échappement comme majoritaires dans les PM routières d'ici ~2035. L'usure totale des pneus est de l'ordre de **~55–212 mg/km** par véhicule selon la marque (OCDE), dont ~11 % passe en PM2,5 respirables ; l'usure des freins ajoute ~10–20 mg/km au total (~4–8 mg/km en PM10 aéroporté). Emissions Analytics a fait les gros titres avec un rapport « pneus 1 000× pire que l'échappement » : le chiffre honnête, comparant l'aéroporté à l'aéroporté, est plutôt **~400×** — mais il pointe une réalité, à mesure que l'échappement se nettoie (filtres à particules essence, ~0,02 mg/km réels), le **frottement pneu/route devient la source dominante de microplastiques** routiers. L'**IUCN (2017)** estime que les pneus représentent **~28 % des microplastiques primaires** rejetés dans les océans — deuxième source mondiale après le lavage des textiles synthétiques.
- **Bruit** : le bruit du trafic routier est la première source de nuisance sonore en Europe ; l'**AEE** lui attribue **~1,3 million d'années de vie en bonne santé perdues par an** (DALYs) et ~66 000 décès prématurés, plus de 110 millions d'Européens exposés au-dessus des seuils. Coût externe marginal ~0,4–1 centime/vkm en moyenne, bien plus en zone urbaine dense (CE Delft 2019).
- **Infrastructure et fin de vie** : la construction routière incorpore ~650–2 700 t CO₂e/km selon la classe de voie (ciment, bitume, acier) ; côté véhicule, la directive européenne VHU vise 95 % de valorisation (94,4 % atteints en 2022), le résidu de broyage étant la principale charge résiduelle. Les pneus usagés européens (~3,9 Mt/an) sont collectés à ~94 %. Un simple point noir : ~4 L d'huile usagée peuvent contaminer jusqu'à un million de litres d'eau (chiffre pédagogique EPA).
- **Amont pétrolier** : au-delà du CO₂ et de l'eau, l'extraction et le raffinage entraînent torchage, rejets atmosphériques et marées noires. Le **torchage mondial** a atteint 148 milliards de m³ en 2023, ~381 Mt CO₂e (dont ~12 % de fuites de méthane) — Banque mondiale. Les marées noires de pétroliers, elles, ont chuté de plus de 90 % depuis les années 1970 (ITOPF). Le raffinage émet SO₂, NOx, COV et particules ; l'amont ajoute ~15–25 % au CO₂ de combustion (JEC WTW v5).

---

## 1 heure de Netflix, 1080p — petit, mais pas là où on croit

### À l'usage

- **Carbone : ~50 g CO₂** en central (fourchette 30–90 g). Les repères : **~36 g** (IEA / Kamiya 2020, révision d'un chiffre antérieur de 82 g) ; **~55 g** (Carbon Trust 2021, moyenne européenne) ; Netflix, via DIMPACT, situe l'heure moyenne « bien en deçà de 100 g ».
- **Le point clé — ce n'est pas la résolution qui compte, c'est l'écran et le réseau électrique.** Répartition (IEA/Kamiya) : **appareil de visionnage ~72 %, réseau de transmission ~23 %, centre de données ~5 %**. L'intuition tenace que « les data centers dominent » est fausse : ils sont la plus petite part. Un smartphone consomme ~15 g/h, un ordinateur portable ~30 g/h, un grand téléviseur 150 g/h et plus. Passer de la SD à la 4K change bien moins le total que changer d'écran ou de pays.
- **Eau : ~0,5 L** en central (0,1–2 L) — déduite de l'empreinte eau de l'électricité (refroidissement thermoélectrique + évaporation des retenues hydroélectriques, ~1,2–2,6 L/kWh) appliquée à ~0,1–0,2 kWh d'énergie visionnage + appareil. Le refroidissement sur site des data centers est mineur (WUE ~0,15–0,4 L/kWh). *Chiffre déduit, pas mesuré.*

### La fabrication — l'externalité que le streaming masque

Voici le vrai renversement : pour l'appareil sur lequel vous regardez Netflix, **~78–81 % du carbone de son cycle de vie est dans sa fabrication, pas dans son usage** (Apple *Product Environmental Reports* ; Fairphone ; Dell). Un iPhone 16 ≈ 56 kg CO₂e, dont ~80 % de production ; un portable ~215 kg, dont ~80 % de fabrication ; un téléviseur ~50–150 kg, panneau d'affichage en tête.

Amorti sur la vie de l'objet, ce carbone incorporé rivalise avec l'électricité du streaming : un téléviseur de ~100 kg CO₂e utilisé ~8 000–10 000 heures représente déjà **~10–12 g/h rien que pour sa fabrication** — du même ordre que la part réseau + data center de l'heure de visionnage. Autrement dit, **le coût environnemental de « regarder Netflix » tient d'abord à posséder l'appareil**, pas à l'électricité consommée pendant la lecture.

Deux externalités systémiques complètent le tableau :

- **Réseau et CDN** : énergie incorporée ~0,013 kWh/Go (modèle Sustainable Web Design), routeurs et transpondeurs. Donnée intrinsèquement incertaine ; à retenir surtout que **~90 % de l'énergie du streaming est côté appareils + réseau, <1 % côté data center** (Shehabi *et al.* 2014).
- **Déchets électroniques** : **62 millions de tonnes en 2022**, seulement **~22 % collectés et recyclés proprement** (*Global E-waste Monitor 2024*, ONU/UNITAR). Plomb, mercure, cadmium, retardateurs de flamme bromés — l'OMS documente l'exposition d'enfants sur les décharges informelles. La fabrication des puces consomme par ailleurs une **eau ultrapure** massive : ~5 700 L par plaquette de 300 mm, et une fab de pointe ~38 millions de litres/jour (World Economic Forum 2024).

---

## 1 heure de transcription IA — la plus petite, et la plus incertaine

C'est une **estimation, pas un chiffre sourcé**. Notta.ai ne publie aucune donnée d'énergie ou d'eau ; les valeurs sont reconstruites de bas en haut à partir de benchmarks de reconnaissance vocale de classe Whisper.

### Méthode

Un modèle serveur transcrit 1 heure d'audio en quelques minutes (large-v3 tourne ~10–30× plus vite que le temps réel). Les mesures publiées convergent bas : **~1,6–2,0 Wh par heure-audio** sur un GPU d'inférence efficace (Whisper large-v3 sur NVIDIA L4), soit **~0,002–0,01 kWh/heure-audio** une fois inclus le surcoût serveur et un PUE de data center de ~1,2–1,4. *(Le brief tablait sur 0,01–0,05 kWh ; les mesures réelles sont un cran en dessous — j'ai révisé.)*

- **Carbone** : ~0,005 kWh × ~300–500 g CO₂/kWh (réseau cloud générique ; l'IEA situe la moyenne mondiale 2024 à ~445–480 g/kWh) ≈ **~2 g**, fourchette 1–5 g. En y ajoutant la fabrication du matériel (voir ci-dessous), on arrive à **~3 g (1–10 g)**.
- **Eau** : ~0,005 kWh × ~1,2–2,6 L/kWh ≈ **~0,01 L** — quelques gouttes. Le refroidissement du data center ajoute une fraction négligeable.

### La fabrication du matériel — petite au prorata, mais toxique

L'incorporé d'un GPU de data center est réel mais dilué : un NVIDIA A100 porte **~128 kg CO₂e** de fabrication (ACV revue par les pairs, Morand *et al.* 2025 ; ~164 kg pour un H100), soit **~5–6 g CO₂e par heure-GPU** amortis sur ~3 ans. Comme la transcription n'occupe le GPU que quelques minutes, la part incorporée reste **inférieure au gramme**.

Mais le même travail révèle un point que le seul carbone masque : pour ce GPU, la fabrication représente **~99 % de la toxicité humaine (cancer)** et une large part de l'épuisement minéral, **dominée par le cuivre** du dissipateur — c'est la mine, pas l'électricité, qui porte l'externalité toxique. S'y ajoutent l'**eau ultrapure** des fabs (voir plus haut) et les **minerais de conflit** (étain, tantale, tungstène, or, cobalt — encadrés par le règlement européen et le Dodd-Frank Act §1502).

### Le risque à la hausse

Si Notta empile de la **synthèse, de la traduction ou de la diarisation par grand modèle de langage** au-dessus de la transcription brute, l'étape générative peut dominer et multiplier l'énergie par plusieurs. L'estimation ne couvre que la transcription proprement dite.

---

## Lecture comparée

- **1 kg de bœuf ≈ 4 000–6 600 km** en petite voiture essence côté carbone (usage + fabrication) ; et son empreinte eau (~15 400 L) dépasse à elle seule l'eau du cycle carburant de **~1 000 trajets** de 100 km.
- **Le numérique est négligeable** face à l'un comme à l'autre : une heure de transcription coûte quelques gouttes d'eau et ~2–3 g de CO₂. Il faudrait transcrire en continu pendant **des décennies** pour égaler un seul kilo de bœuf.
- **Le vrai enseignement des externalités** : dès qu'on quitte l'énergie de fonctionnement, le classement se déforme. Pour le **numérique**, la fabrication de l'appareil éclipse l'usage (≈80 % du carbone d'un téléphone) et l'impact bascule vers la **toxicité minière** et les **déchets électroniques**. Pour la **voiture**, la fabrication ajoute un cinquième au carbone d'usage, et l'usure des pneus rivalise avec l'échappement en microplastiques. Pour le **bœuf**, l'empreinte carbone/eau n'est que la partie visible : usage des sols, déforestation, eutrophisation, biodiversité et coût d'opportunité carbone des terres sont des externalités du même ordre de gravité, voire supérieures.

## Limites et incertitudes

- L'estimation de la **transcription** porte une incertitude d'un ordre de grandeur (pas de donnée éditeur, reconstruction ascendante).
- Les chiffres de **streaming**, **voiture** et **bœuf** reposent sur des bases bien plus solides (agences, ACV revues par les pairs, méta-analyses).
- Les valeurs de fabrication issues des **rapports constructeurs** (Apple, Dell, NVIDIA, BMW) sont « du berceau à la sortie d'usine », auto-déclarées et fondées sur des hypothèses maison : indicatives, non auditées.
- Les **amortissements par 100 km ou par heure** dépendent fortement des hypothèses de durée de vie (kilométrage, heures d'usage) — la plus grande sensibilité de tout l'exercice.
- Le **bio** manque de méta-analyses dédiées : les ancrages carbone/eau sont conventionnels, que le bio égale ou dépasse modestement sur le carbone.

## Sources

- **Poore, J. & Nemecek, T. (2018).** Reducing food's environmental impacts through producers and consumers. *Science* 360(6392):987–992.
- **Mekonnen, M. & Hoekstra, A. (2012).** A Global Assessment of the Water Footprint of Farm Animal Products. *Ecosystems* 15(3):401–415.
- **Clark, M. & Tilman, D. (2017).** Comparative analysis of environmental impacts of agricultural production systems. *Environmental Research Letters* 12:064016.
- **Cusack, D. et al. (2021).** Reducing climate impacts of beef production. *Global Change Biology.*
- **Hayek, M. et al. (2025).** US grass-fed beef is as carbon intensive as industrial beef. *PNAS.*
- **Hayek, Harwatt, Ripple & Mueller (2021).** The carbon opportunity cost of animal-sourced food production on land. *Nature Sustainability* 4:21–24.
- **IPBES (2019).** Global Assessment Report on Biodiversity and Ecosystem Services.
- **Mulchandani, R. et al. (2023).** Global trends in antimicrobial use in food-producing animals.
- **ICCT / Bieker, G. (2021).** A Global Comparison of the Life-Cycle GHG Emissions of Combustion Engine and Electric Passenger Cars ; s'appuyant sur **Hill et al. (Ricardo/ifeu/E4Tech, 2020)** pour la Commission européenne.
- **World Steel Association (2023–2025)** ; **International Aluminium Institute (2023)** — intensités carbone de l'acier et de l'aluminium.
- **King, C. & Webber, M. (2008),** *Environmental Science & Technology* ; **Argonne GREET** — empreinte eau de l'essence.
- **Macknick, J. et al. (2012),** *Environmental Research Letters* — eau de production d'électricité.
- **EPA / IPCC / DEFRA** — facteur de combustion : 2,31 kg CO₂ par litre d'essence.
- **CE Delft (van Essen et al., 2019)** — Handbook on the External Costs of Transport.
- **OCDE (2020),** Non-exhaust Particulate Emissions from Road Transport ; **EEA / JRC** ; **ADAC** — usure pneus/freins.
- **IUCN (Boucher & Friot, 2017)** — microplastiques primaires dans les océans (part des pneus).
- **AEE (Agence européenne pour l'environnement)** ; **OMS Europe** — charge sanitaire du bruit routier.
- **Banque mondiale (2024)** Global Gas Flaring Tracker ; **ITOPF (2025)** — torchage et marées noires ; **JEC WTW v5 (2020)** — amont du carburant.
- **ETRMA** ; **Eurostat / directive VHU 2000/53/CE** ; **Decarbon8 (2022)** — pneus usagés, véhicules hors d'usage, carbone des routes.
- **IEA / Kamiya, G. (2020)** ; **Carbon Trust (2021)** ; **Carbon Brief (2021)** ; **DIMPACT** — carbone du streaming.
- **Apple Product Environmental Reports (2024)** ; **Fairphone LCA (2024)** ; **Dell** carbon footprint whitepapers — fabrication des appareils.
- **NVIDIA HGX-H100 PCF (2024)** ; **Morand et al. (2025), arXiv:2509.00093** — ACV du GPU A100/H100.
- **UNITAR/ITU (2024),** Global E-waste Monitor ; **OMS** — déchets électroniques et santé.
- **World Economic Forum (2024)** — eau de la fabrication des semi-conducteurs.
- **Benchmarks d'inférence Whisper/ASR** : arXiv:2405.01004 ; E2E Networks (Whisper large-v3 sur NVIDIA L4) — base de l'estimation de transcription uniquement.
