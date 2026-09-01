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
  Carbone et eau de quatre gestes du quotidien — 1 h de transcription IA,
  1 h de Netflix, 100 km en petite voiture essence, 1 kg de bœuf bio — expliqués
  simplement et comparés du berceau à l'usage, fabrication du matériel et
  pollutions cachées comprises.
---

## Le périmètre

On culpabilise volontiers pour un mail de trop, tout en commandant un steak sans y penser. Pour remettre les ordres de grandeur à l'endroit, j'ai comparé quatre gestes du quotidien sur deux mesures : le **carbone** (le CO₂ et les autres gaz à effet de serre qu'ils rejettent) et l'**eau** (la quantité d'eau douce mobilisée).

Les quatre gestes, ramenés à une même « portion » pour être comparables :

- **1 heure de transcription automatique** (une IA qui transforme de l'audio en texte, type Notta.ai) ;
- **1 heure de Netflix** en 1080p ;
- **100 km en petite voiture essence** ;
- **1 kg de bœuf bio**.

Surtout, je ne me suis pas arrêté à l'énergie consommée *pendant* l'activité. J'ai cherché à intégrer un maximum de coûts cachés — au premier rang desquels la **fabrication des objets** mobilisés (serveurs, téléphones, téléviseurs, la voiture) et les pollutions qui n'apparaissent sur aucune facture : usage des sols, pollution de l'eau, particules, déchets électroniques, biodiversité.

Chaque chiffre est une estimation centrale avec une fourchette, et je signale à chaque fois si la preuve est solide ou fragile.

## Synthèse

| Activité | Carbone (CO₂e) | Eau | Fiabilité |
|---|---|---|---|
| 1 h de transcription IA | environ 3 g (1–15 g) | environ 0,01 L (0,005–0,06 L) | Faible — une seule mesure publiée, pas de donnée éditeur |
| 1 h de Netflix, 1080p | environ 50 g (30–90 g) | environ 0,5 L | Moyenne — IEA / Carbon Trust |
| 100 km, petite voiture essence | 15–17 kg (usage) **+ 3–4 kg (fabrication)** | 10–20 L | Forte — chimie + études revues par les pairs |
| 1 kg de bœuf bio | 60–99 kg | 15 400 L | Forte — Poore & Nemecek 2018 ; Mekonnen & Hoekstra 2012 |

## Ordres de grandeur

Le plus parlant est de tout ramener à l'heure de transcription (la plus petite), posée à 1 :

- **Carbone** : Netflix ≈ 15–20 fois plus, la voiture ≈ 5 000 fois, le bœuf ≈ 20 000 à 30 000 fois.
- **Eau** : Netflix ≈ 50 fois, la voiture ≈ 1 500 fois, le bœuf ≈ 1 500 000 fois.

Autrement dit : les quatre activités s'étalent sur **quatre à cinq ordres de grandeur** en carbone et **six** en eau. Le numérique est une erreur d'arrondi face au bœuf ; la voiture se loge entre les deux. Comme les écarts sont gigantesques, les deux graphiques ci-dessous utilisent une **échelle logarithmique** : chaque graduation vaut dix fois la précédente. C'est le seul moyen de faire tenir un gramme et 80 kilos sur la même ligne.

<figure class="fp-viz not-prose" style="margin:2rem 0">
<style>
.fp-viz{--bar:#256abf;--fab:#256abf;--use:#c7c5bc;--useink:#1a1a19;--ink:#1a1a19;--muted:#6b6a66;--grid:rgba(11,11,11,0.13);--surface:#ffffff}
.dark .fp-viz{--bar:#3987e5;--fab:#3987e5;--use:#54534d;--useink:#ededed;--ink:#ededed;--muted:#9a988f;--grid:rgba(255,255,255,0.15);--surface:#111827}
.fp-viz figcaption{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:0.8rem;color:var(--muted);margin-top:0.5rem;line-height:1.4}
</style>
<svg viewBox="0 0 760 228" width="100%" role="img" aria-label="Carbone par activité : transcription environ 3 g, Netflix environ 50 g, voiture environ 18 000 g, bœuf environ 80 000 g de CO2e" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Carbone par activité</title>
  <desc>transcription environ 3 g, Netflix environ 50 g, voiture environ 18 000 g, bœuf environ 80 000 g de CO2e</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Carbone par activité</text>
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
<svg viewBox="0 0 760 228" width="100%" role="img" aria-label="Eau par activité : transcription environ 0,01 L, Netflix environ 0,5 L, voiture environ 15 L, bœuf environ 15 400 L" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Eau par activité</title>
  <desc>transcription environ 0,01 L, Netflix environ 0,5 L, voiture environ 15 L, bœuf environ 15 400 L</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Eau par activité</text>
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
<figcaption>Sur une échelle logarithmique, un pas vers la droite = un facteur 10. La voiture inclut l'usage <em>et</em> sa fabrication amortie. La transcription reste incertaine à un facteur 10 près.</figcaption>
</figure>

## Une règle simple : usage n'est pas fabrication

Avant les chiffres, une distinction qui change tout. L'empreinte d'un objet se joue à deux moments :

1. **Pendant qu'on l'utilise** (rouler, streamer, transcrire) — l'énergie qu'il consomme sur le moment.
2. **Quand on le fabrique** — le carbone et l'eau « embarqués » dans l'objet, dépensés une fois pour toutes à l'usine, puis répartis sur toute sa vie.

On oublie presque toujours le second. Or il domine dans des cas surprenants : pour un smartphone, **fabriquer** l'appareil pèse bien plus lourd que toutes les heures passées à le regarder. Pour une voiture, c'est l'inverse — c'est surtout l'essence brûlée qui compte. Ce graphique résume ce basculement :

<figure class="fp-viz not-prose" style="margin:2rem 0">
<svg viewBox="0 0 760 182" width="100%" role="img" aria-label="Part du carbone en fabrication contre usage : téléphone 80 % fabrication, voiture 13 % fabrication" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Fabriquer ou utiliser : où est le carbone ?</title>
  <desc>Pour un téléphone, 80 % du carbone vient de sa fabrication ; pour une voiture, 87 % vient de son usage.</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Fabriquer ou utiliser : où est le carbone ?</text>
  <text x="8" y="36" font-size="10.5" fill="var(--muted)">part du carbone total sur toute la durée de vie de l'objet</text>
  <text x="162" y="78" text-anchor="end" font-size="11.5" fill="var(--ink)">Téléphone</text>
  <rect x="176" y="62" width="399.0" height="24" rx="3" fill="var(--fab)"/>
  <rect x="577.0" y="62" width="98.0" height="24" rx="3" fill="var(--use)"/>
  <text x="376.0" y="78" text-anchor="middle" font-size="11" font-weight="600" fill="#ffffff" style="font-variant-numeric:tabular-nums">Fabrication 80 %</text>
  <text x="626.0" y="78" text-anchor="middle" font-size="11" font-weight="600" fill="var(--useink)" style="font-variant-numeric:tabular-nums">20 %</text>
  <text x="162" y="126" text-anchor="end" font-size="11.5" fill="var(--ink)">Voiture</text>
  <rect x="176" y="110" width="64.0" height="24" rx="3" fill="var(--fab)"/>
  <rect x="242.0" y="110" width="433.0" height="24" rx="3" fill="var(--use)"/>
  <text x="208.5" y="126" text-anchor="middle" font-size="10.5" font-weight="600" fill="#ffffff" style="font-variant-numeric:tabular-nums">13 %</text>
  <text x="458.5" y="126" text-anchor="middle" font-size="11" font-weight="600" fill="var(--useink)" style="font-variant-numeric:tabular-nums">Rouler 87 %</text>
  <rect x="176" y="153" width="12" height="12" rx="2" fill="var(--fab)"/>
  <text x="194" y="163" font-size="11" fill="var(--muted)">Fabrication</text>
  <rect x="296" y="153" width="12" height="12" rx="2" fill="var(--use)"/>
  <text x="314" y="163" font-size="11" fill="var(--muted)">Usage (rouler / regarder)</text>
</svg>
<figcaption>Sources : Apple, Fairphone et Dell (téléphone) ; ICCT / Ricardo 2020 (voiture). Répartir la fabrication sur la vie de l'objet suppose des hypothèses de kilométrage ou d'heures d'usage.</figcaption>
</figure>

---

## 1 kg de bœuf bio — de très loin le pire

### Carbone et eau

Le bœuf émet **60 à 99 kg de CO₂e par kilo** : environ 99 kg pour un bœuf élevé uniquement pour sa viande, environ 60 kg en moyenne mondiale (une partie de la charge étant partagée avec le lait quand l'animal vient d'un troupeau laitier). La source fait référence : **Poore & Nemecek (2018), *Science***, une analyse de près de 38 700 fermes dans 119 pays.

Côté eau, le bœuf mobilise **environ 15 400 litres par kilo** (Mekonnen & Hoekstra, 2012). Mais toute cette eau ne se vaut pas :

- **environ 94 %** est de l'**eau verte** : la pluie tombée sur les prairies et les cultures qui nourrissent l'animal. Elle serait tombée de toute façon ;
- **environ 4 %** est de l'**eau bleue** : l'eau d'irrigation et de boisson, réellement prélevée dans les rivières et les nappes ;
- **environ 3 %** (soit 450 L) est de l'**eau grise** : l'eau propre qu'il faudrait pour diluer la pollution azotée jusqu'à la rendre acceptable. C'est la part « pollution ».

Près de 98 % de cette eau sert en fait à produire la nourriture de l'animal.

### « Bio », ça ne change presque rien (au carbone et à l'eau)

Contre-intuitif mais net : le bio **ne réduit pas** l'empreinte carbone ou eau *par kilo de viande*, et l'augmente même un peu. Un bœuf nourri à l'herbe grandit plus lentement et digère un fourrage plus fibreux : il « rote » donc **plus de méthane** par kilo produit. Deux résultats convergents : **Clark & Tilman (2017)** ne trouvent pas de différence significative bio/conventionnel par kilo, et **Cusack *et al.* (2021)** mesurent **+30 %** de gaz à effet de serre pour le bœuf à l'herbe par rapport au bœuf de parc d'engraissement.

Les vrais bénéfices du bio sont **ailleurs** : pas de pesticides ni d'engrais de synthèse, pas d'antibiotiques de routine, meilleurs sols et meilleure biodiversité locale, bien-être animal. Sur le carbone et l'eau, le bio égale ou dépasse légèrement le conventionnel.

### Les dégâts que carbone et eau ne montrent pas

C'est là que le bœuf creuse vraiment l'écart avec tout le reste :

- **Il dévore de l'espace.** Environ **326 m²·an par kilo** (contre 44 fois moins pour les pois) — et l'élevage bovin est le **premier moteur mondial de déforestation** : en Amazonie brésilienne, la pâture occupe environ 80 % des terres défrichées.
- **Il pollue l'eau.** L'**eutrophisation** — l'excès d'azote et de phosphore qui ruisselle, provoque des algues et asphyxie rivières et « zones mortes » côtières — est **40 à 50 fois** plus élevée que pour les pois ou le tofu.
- **Il érode le vivant.** Le changement d'usage des sols pour l'agriculture est, selon l'**IPBES (2019)**, la première cause d'effondrement de la biodiversité terrestre ; pâtures et cultures fourragères en sont le gros morceau.
- **Antibiotiques et ammoniac.** Les bovins consomment environ **54 % des antibiotiques** de tout l'élevage mondial (un moteur de l'antibiorésistance), et rejettent beaucoup d'**ammoniac**, qui se transforme en particules fines nocives. Le bio, lui, proscrit les antibiotiques de routine.
- **La terre « gâchée ».** Rendue à la forêt, la surface occupée par le bétail absorberait d'énormes quantités de CO₂ : **Hayek *et al.* (2021)** chiffrent ce manque à gagner à des centaines de milliards de tonnes de CO₂ d'ici 2050.

---

## 100 km en petite voiture essence — le cas intermédiaire

### Ce que coûte le trajet lui-même

Une petite essence consomme environ **6 litres aux 100 km**. Chaque litre brûlé rejette **2,31 kg de CO₂** (chimie fixe, facteur officiel) — soit près de 14 kg. En ajoutant tout ce qu'il a fallu pour extraire, raffiner et livrer ce carburant (« du puits à la roue »), on arrive à **15 à 17 kg de CO₂e** pour 100 km.

Côté eau, produire ces 6 litres d'essence en consomme **8 à 17 litres** (King & Webber, 2008) : rouler « boit » un peu, mais rien d'énorme. *(Un chiffre courant de 2,8–6,6 L d'eau par litre d'essence mélange en réalité l'eau prélevée et l'eau réellement consommée ; j'ai retenu la valeur nette.)*

### La fabrication : loin d'être négligeable

Construire une petite voiture essence émet **environ 6 tonnes de CO₂e** (7,2 t pour une compacte), dont les **trois quarts rien que pour l'acier** (source : **ICCT / Ricardo, 2020–2021**). Répartie sur la vie du véhicule (autour de 200 000 km), cette fabrication ajoute **3 à 4 kg de CO₂e par 100 km** — soit **20 à 27 % en plus** du trajet lui-même. Le « petit détail » qu'on oublie représente donc un cinquième de l'empreinte de chaque trajet.

Derrière ces tonnes, il y a des mines : l'**acier** (minerai de fer, charbon), l'**aluminium** (bauxite et « boues rouges » très corrosives), les **plastiques** issus du pétrole, le **cuivre** des câbles, et quelques grammes de métaux précieux dans le pot catalytique. L'eau de l'usine d'assemblage, elle, est modeste (de l'ordre de 2 m³ par voiture).

### Les pollutions qu'on ne voit pas passer

- **Les gaz d'échappement.** Même aux normes récentes, une essence émet des oxydes d'azote (NOx), un peu de particules et des hydrocarbures. Le coût sanitaire (maladies respiratoires et cardiovasculaires) est estimé autour de **1 centime d'euro par km**.
- **L'usure des pneus et des freins.** Surprise : à mesure que les moteurs se nettoient, **le frottement des pneus sur la route devient la principale source de particules** d'une voiture. Un véhicule use **55 à 212 mg de pneu par km** ; une part part en microplastiques. L'**IUCN** estime que les pneus sont la **2ᵉ source de microplastiques** dans les océans, derrière le lavage des vêtements synthétiques.
- **Le bruit.** Le trafic routier est la première nuisance sonore d'Europe : l'Agence européenne de l'environnement lui impute environ **1,3 million d'années de vie en bonne santé perdues par an**.
- **En amont et en fin de vie.** Extraire et raffiner le pétrole implique torchage de gaz et risques de marées noires (en forte baisse depuis les années 1970) ; en bout de course, les véhicules européens sont valorisés à plus de 94 %.

---

## 1 heure de Netflix — petit, mais pas là où on croit

### Ce que coûte le visionnage

Une heure de streaming en 1080p, c'est **environ 50 g de CO₂** (fourchette 30–90 g selon les études de l'IEA et du Carbon Trust) et **un demi-litre d'eau** environ (surtout l'eau qui refroidit les centrales électriques).

Le point vraiment contre-intuitif : **ce n'est pas la résolution ni les data centers qui pèsent, c'est votre écran.** Regarder sur un téléphone consomme peu ; sur un grand téléviseur, dix fois plus. Voici où part réellement le carbone d'une heure de vidéo :

<figure class="fp-viz not-prose" style="margin:2rem 0">
<svg viewBox="0 0 760 206" width="100%" role="img" aria-label="Répartition du carbone d'une heure de Netflix : appareil 72 %, réseau 23 %, centre de données 5 %" style="max-width:760px;height:auto;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <title>Une heure de Netflix : où part le carbone ?</title>
  <desc>Appareil 72 %, réseau 23 %, centre de données 5 %.</desc>
  <text x="8" y="20" font-size="12.5" font-weight="600" fill="var(--ink)">Une heure de Netflix : où part le carbone ?</text>
  <text x="8" y="36" font-size="10.5" fill="var(--muted)">part de l'empreinte carbone · l'écran domine, le centre de données est minuscule</text>
  <line x1="176.0" y1="50" x2="176.0" y2="176" stroke="var(--grid)" stroke-width="1"/>
  <text x="176.0" y="190" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">0 %</text>
  <line x1="301.0" y1="50" x2="301.0" y2="176" stroke="var(--grid)" stroke-width="1"/>
  <text x="301.0" y="190" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">20 %</text>
  <line x1="426.0" y1="50" x2="426.0" y2="176" stroke="var(--grid)" stroke-width="1"/>
  <text x="426.0" y="190" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">40 %</text>
  <line x1="551.0" y1="50" x2="551.0" y2="176" stroke="var(--grid)" stroke-width="1"/>
  <text x="551.0" y="190" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">60 %</text>
  <line x1="676.0" y1="50" x2="676.0" y2="176" stroke="var(--grid)" stroke-width="1"/>
  <text x="676.0" y="190" text-anchor="middle" font-size="10" fill="var(--muted)" style="font-variant-numeric:tabular-nums">80 %</text>
  <text x="162" y="75" text-anchor="end" font-size="11.5" fill="var(--ink)">Appareil (l'écran)</text>
  <rect x="176" y="63" width="450.0" height="16" rx="4" fill="var(--bar)"/>
  <text x="636.0" y="75" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">72 %</text>
  <text x="162" y="117" text-anchor="end" font-size="11.5" fill="var(--ink)">Réseau</text>
  <rect x="176" y="105" width="143.8" height="16" rx="4" fill="var(--bar)"/>
  <text x="329.8" y="117" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">23 %</text>
  <text x="162" y="159" text-anchor="end" font-size="11.5" fill="var(--ink)">Centre de données</text>
  <rect x="176" y="147" width="31.2" height="16" rx="4" fill="var(--bar)"/>
  <text x="217.2" y="159" text-anchor="start" font-size="11.5" font-weight="600" fill="var(--ink)" style="font-variant-numeric:tabular-nums">5 %</text>
</svg>
<figcaption>Répartition moyenne d'après l'IEA (Kamiya, 2020). L'idée tenace que « les data centers dévorent l'énergie » du streaming est fausse : ils en représentent la plus petite part.</figcaption>
</figure>

### La vraie note : l'appareil lui-même

Comme le montrait le graphique plus haut, **environ 80 % du carbone d'un smartphone se joue à sa fabrication**, pas à l'usage (sources : Apple, Fairphone, Dell). Un téléviseur de 100 kg de CO₂e, réparti sur ses milliers d'heures d'usage, « coûte » déjà autant en fabrication que l'électricité d'une heure de visionnage. Le vrai coût de « regarder Netflix », c'est surtout **posséder l'appareil**.

Deux angles morts complètent le tableau :

- **Les déchets électroniques** : **62 millions de tonnes par an**, dont **seulement 22 % recyclés** proprement (ONU, 2024), avec plomb, mercure et cadmium récupérés à mains nues sur des décharges où travaillent des enfants (OMS).
- **L'eau des puces** : fabriquer les processeurs demande une eau ultra-pure en énorme quantité — une usine de pointe en consomme l'équivalent de dizaines de milliers de foyers.

---

## 1 heure de transcription IA — la plus petite, et la plus incertaine

Attention : ici, ce n'est **pas un chiffre officiel mais une estimation**. Notta.ai ne publie aucune donnée ; j'ai reconstruit le calcul à partir de mesures faites sur des modèles équivalents (type Whisper).

Une IA transcrit une heure d'audio en quelques minutes, mais la consommation dépend énormément du matériel. La seule mesure publiée que j'ai trouvée (**Janssens *et al.*, université de Gand, 2024**) fait tourner Whisper large-v3 sur une carte graphique déjà ancienne (une GTX 1080 Ti de 2017) et relève **32 wattheures et 7,7 g de CO₂ par heure d'audio**. Mais un service comme Notta tourne sur des puces récentes et optimisées, **5 à 15 fois plus efficaces** : sur un GPU moderne, les mesures descendent à **environ 2 wattheures** par heure d'audio — de quoi laisser une ampoule LED allumée quelques minutes. D'où une fourchette large :

- **Carbone : environ 3 grammes** (de 1 à 15 g selon le matériel et le réseau électrique), fabrication du serveur comprise.
- **Eau : environ 1 centilitre** (jusqu'à 6 cl sur du vieux matériel) — quelques gouttes.

Même dans le pire cas mesuré, on reste sur des grammes et des centilitres.

La fabrication du matériel (les puces graphiques des serveurs) ajoute peu de carbone ici, car la transcription ne mobilise le processeur que quelques minutes. En revanche, cette fabrication concentre l'essentiel de la **toxicité** (extraction du cuivre) et repose sur des **minerais parfois « de conflit »** (étain, tantale, tungstène, or) — des dégâts que le seul bilan carbone ne voit pas.

**Un bémol.** Si l'outil ajoute par-dessus de la traduction ou un résumé par IA générative, cette couche-là peut consommer bien plus que la transcription elle-même. Mon estimation ne couvre que la transcription brute.

---

## Ce qu'il faut retenir

- **1 kg de bœuf ≈ 4 000 à 6 600 km** en petite voiture, côté carbone. Et son eau (15 400 L) dépasse à elle seule celle de **1 000 trajets** de 100 km.
- **Le numérique est négligeable** en comparaison : il faudrait transcrire en continu pendant **des décennies** pour égaler un seul kilo de bœuf.
- **Mais dès qu'on regarde les coûts cachés, le classement se nuance.** Pour le numérique, l'impact se déplace vers la **fabrication des appareils**, la **toxicité minière** et les **déchets électroniques**. Pour la voiture, la fabrication et l'usure des pneus s'ajoutent au pot d'échappement. Pour le bœuf, le carbone n'est que la partie émergée : sols, forêts, eau et biodiversité sont touchés tout autant.

La leçon la plus utile n'est pas un palmarès, mais un réflexe : **regarder au-delà de l'énergie du moment**. C'est là que se cache l'essentiel.

## Limites

- La **transcription** est une estimation (pas de donnée éditeur) : incertaine à un facteur 10 près.
- **Streaming, voiture et bœuf** reposent sur des bases solides (agences, études revues par les pairs).
- Les chiffres de **fabrication** viennent des industriels eux-mêmes (Apple, Dell, ICCT, BMW) : indicatifs, non audités.
- Les **répartitions par 100 km ou par heure** dépendent fortement des durées de vie supposées.

## Sources

- **Poore, J. & Nemecek, T. (2018).** *Science* 360(6392):987–992 — empreinte des aliments.
- **Mekonnen, M. & Hoekstra, A. (2012).** *Ecosystems* 15(3) — eau des produits animaux.
- **Clark & Tilman (2017)**, *Environmental Research Letters* ; **Cusack *et al.* (2021)**, *Global Change Biology* ; **Hayek *et al.* (2021)**, *Nature Sustainability* — bio, herbe et coût d'opportunité des terres.
- **IPBES (2019)** — biodiversité ; **Mulchandani *et al.* (2023)** — antibiotiques ; **IUCN (2017)** — microplastiques des pneus.
- **ICCT / Bieker (2021)** et **Ricardo/ifeu/E4Tech (2020)** — cycle de vie des voitures ; **World Steel Association**, **International Aluminium Institute** — acier et aluminium.
- **King & Webber (2008)**, *Environmental Science & Technology* — eau de l'essence ; **DEFRA / EPA / IPCC** — 2,31 kg CO₂/L ; **CE Delft (2019)** — coûts externes du transport ; **OCDE (2020)** — particules hors échappement ; **AEE / OMS** — bruit ; **Banque mondiale (2024)** — torchage.
- **IEA (Kamiya, 2020)**, **Carbon Trust (2021)**, **DIMPACT** — carbone du streaming ; **Apple**, **Fairphone**, **Dell** — fabrication des appareils.
- **Morand *et al.* (2025)**, arXiv:2509.00093 — cycle de vie d'un GPU ; **UNITAR/ITU (2024)** — déchets électroniques ; **World Economic Forum (2024)** — eau des semi-conducteurs.
- **Janssens *et al.* (2024)**, arXiv:2404.17394 — mesure directe : Whisper large-v3 à 32,3 Wh et 7,7 g CO₂e par heure d'audio sur une GTX 1080 Ti ; **E2E Networks** (≈ 2 Wh/h sur GPU moderne) et **arXiv:2405.01004** — base de l'estimation transcription.
