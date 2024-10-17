// © Copyright 2023, LUIC-CIUT's Contributors
export default {
  // traductions françaises
  appInfo: {
    appTitle: `Calculatrice d'impacts de l'usage du territoire`,
    version: `version`,
    lastUpdated: `dernière mise à jour`,
    worksheetAttribution: `Généré par la Calculatrice d'impacts de l'usage du territoire (CIUT)`,
  },
  forms: {
    back: `Retour`,
    prev: `Précédent`,
    next: `Suivant`,
    skip: `Sauter`,
    cancel: `Annuler`,
    reset: `Réinitialiser`,
    close: `Fermer`,
    ok: `Ok`,
    done: `Terminé`,
    send: `Envoyer`,
    view: `Visualiser`,
    edit: `Modifier`,
    duplicate: `Duplicat`,
    delete: `Supprimer`,
    save: `Sauvegarder`,
    saveToWorksheet: `Sauvegarder dans la feuille de calcul`,
    errorAlert: `Veillez à ce que tous les champs obligatoires soient correctement remplis.`,
    confirmMsgSent: `Votre message a été envoyé.`,
    confirmDeleteTitle: `Confirmer la suppression`,
    confirmDeleteMsg: `Êtes-vous sûr.e de vouloir supprimer les éléments suivants {item}?`,
    confirmHasBeenDeleted: `{itemType}: {itemName} a été supprimé.`,
    servicesEnterZero: `Entrez 0 si vous n'ajoutez aucune nouvelle installation`,
    infrastructureEnterZero: `Entrez 0 si vous ne construisez pas de nouvel {item}`,
    vktTooltip: `KPV fait référence aux kilomètres annuels parcourus par les véhicules`,
    aktTooltip: `KPA fait référence aux kilomètres annuels actifs parcourus`,
    fields: {
      email: `Adresse électronique (e-mail)`,
      name: `Nom`,
      message: `Message`,
      quantity: `Quantité`,
      buildingEnergyCode: `Code de l'énergie pour les bâtiments`,
      buildingEnergyCodeShort: `Code du bâtiment`,
      eui: `Intensité de la consommation d'énergie`,
      euiShort: `ICE`,
      energySources: `Sources d'énergies`,
      energyMix: `Mixité d'énergies`,
      addEnergySource: `Ajouter une source d'énergie`,
      length: `Longueur`,
      capitalCostIntensity: `Intensité des coûts d'investissement`,
      capitalCost: `Coût d'investissement | Coûts d'investissement`,
      maintCostIntensity: `Intensité des coûts de maintenance`,
      maintCost: `Coût de maintenance | Coûts de maintenance`,
      opAndMaintCost: `Coût d'exploitation et de maintenance`,
      charges: `Frais`,
      taxes: `Taxes`,
      devYear: `Année du développement`,
      buildOutYear: `Année de construction complète`,
      scenarioTitle: `Nom du scénario`,
      scenarioDescription: `Description du scénario`,
      province: `Province`,
      neighbourhoodType: `Type de développement`,
      numberDwellings: `Nombre de logements`,
      floorspacePerUnit: `Surface par unité`,
      floorspaceTotal: `Total de la surface aménagée`,
      annualKT: `Kilomètres parcourus annuellement`,
      totalVKT: `total KPV`,
      puvVKT: `Kilomètres parcourus par les véhicules à usage personnel`,
      transitVKT: `Kilomètres parcourus par les transports en commun`,
      activeKT: `Kilomètres actifs parcourus`,
      bikeKT: `Kilomètres actifs parcourus - Vélo`,
      walkKT: `Kilomètres actifs parcourus - Marche`,
      fuelConsumption: `Consommation de carburant`,
    },
    validation: {
      valueNumber: `La valeur doit être un nombre`,
      value0to100: `La valeur doit se trouver entre 0 et 100`,
      valueGreater0: `La valeur doit être supérieure à 0`,
      energySourcesNone: `Veuillez identifier au moins une source d'énergie.`,
      energySources100: `Veillez à ce que la somme des sources d'énergie soit égale à 100`,
      requiredField: `{fieldName} est requis`,
      fieldNumber: `{fieldName} doit être un nombre`,
      fieldPositive: `{fieldName} doit être une valeur positive`,
      fieldLT100Percent: `{fieldName} doit être inférieur ou égale à 100%`,
      fieldGT0Percent: `{fieldName} doit être supérieur ou égale à 0%`,
      startYearRequired: `L'année de départ est requise`,
      startYearNumber: `L'année de départ doit être un nombre`,
      startYearInteger: `L'année de départ doit être un entier`,
      startYearRange: `L'année de départ doit être entre {startYear} et {endYear}`,
      emailRequired: `Une adresse électronique (e-mail) est requis`,
      emailValid: `Doit être une adresse électronique (e-mail) valide`,
      max50chars: `Max 50 caractères`,
    },
  },
  general: {
    email: `Adresse électronique (e-mail)`,
    student: `élève`,
    dwelling: `logement | logements`,
    referencesTitle: `Références`,
    referencesNone: `Aucune référence listée`,
    percentage: `Pourcentage`,
    absolute: `Absolu`,
    modified: `Modifié`,
    year: `Année`,
    yearAbbr: `an`,
    total: `total`,
    calculating: `En cours de calcul`,
    scenario: `Scénario | Scénarios`,
    title: `titre`,
    capital: `Capital`,
    maintenance: `Maintenance`,
  },
  navigation: {
    about: `À propos`,
    dashboard: `Tableau de bord`,
    help: `Aide`,
    scenario_edit: `Scénario`,
    scenario_view: `Scénario`,
    welcome: `Tutoriel`,
  },
  pages: {
    about: {
      title: `À propos du complément Calculatrice d'impacts de l'usage du territoire (CIUT) pour Excel`,
      betaMsg: `La Calculatrice d'impacts de l'usage du territoire (CIUT) est en cours de développement. Cette version est une version bêta destinée à des tests initiaux.`,
      html: `<p>
        La Calculatrice d'impacts de l'usage du territoire (CIUT) est un complément Microsoft Office pour Excel.
        Elle vise à fournir aux décideurs municipaux une estimation raisonnable et 
        précise de la consommation d'énergie et de l'incidence des émissions de 
        gaz à effet de serre associées aux projets de développement envisagés dans le cadre des 
        processus de budgétisation et de planification des investissements municipaux.
        </p>`,
      supportedBy: `La Calculatrice d'impacts de l'usage du territoire (CIUT) est soutenue par :`,
      fcm: `Federation of Canadian Municipalities / Fédération Candaienne des Municipalités`,
      developedBy: `Développée et entretenue par :`,
      moreInfo: `Pour plus d'informations ou pour obtenir de l'aide, veuillez contacter :`,
    },
    dashboard: {
      myScenarios: `Mes Scénarios`,
      resizeTitle: `Saviez-vous que vous pouvez redimensionner le panneau ?`,
      resizeMsg: `Un réglage un peu plus large du panneau du complément peut le rendre plus facile à utiliser.`,
    },
    help: {
      welcomeSlidesBtn: `Tutoriel`,
      welcomeSlidesTooltip: `Voir le tutoriel pour un aperçu de la calculatrice CIUT`,
      feedbackTitle: `Feedback et signalement de bug`,
      feedbackText: `Vous avez une question, un commentaire ou vous souhaitez nous signaler un bug ? Veuillez envoyer un message à
      l'aide du formulaire ci-dessous afin que nous puissions améliorer la calculatrice CIUT.`,
    },
    welcome: {
      title: `Bienvenue`,
      slide1html: `<p class="text-center">
      La Calculatrice d'impacts de l'usage du territoire fournit aux utilisateurs un outil permettant
      d'explorer les impacts potentiels des développements résidentiels proposés en termes d'émissions de gaz à effet
      de serre produites, des coûts d'investissement dans les infrastructures et des revenus municipaux perçus.
        </p>`,
      slide2html: `<p class="text-center">
        Ce complément Excel permet de comparer des scénarios de développement résidentiels. Pour chaque scénario, il est possible de sélectionner l'un des six types de
        développements résidentiels :
        </p>
        <ul class="ml-12">
        <li>Aménagement intercalaire (haute densité)</li>
        <li>Aménagement intercalaire (densité moyenne à élevée)</li>
        <li>Développement axé sur les transports en commun (densité moyenne à élevée)</li>
        <li>Développement axé sur les transports en commun  (densité faible à moyenne)</li>
        <li>Développement résidentiel à faible densité (grand lot)</li>
        <li>Développement résidentiel à faible densité (petit lot)</li>
        </ul>`,
      slide3html: `<p class="text-center">
        Commencez par définir le projet de développement résidentiel. Les utilisateurs sélectionnent les paramètres du développement et leurs valeurs. Des valeurs par défaut, déterminées par des éléments tels que la géographie et le code du bâtiment, sont fournies pour la plupart des paramètres. Les utilisateurs peuvent remplacer les valeurs par défaut par leurs propres valeurs, le cas échéant. Pour chaque étape de la définition du scénario, le symbole ⓘ fournit des renseignements de référence sur les paramètres par défaut.
        </p>`,
      slide4html: `<p class="text-center">
        Lorsque vous avez suivi toutes les étapes et défini toutes les valeurs des paramètres, une feuille de calcul (onglet) est créée dans le classeur actuel avec des renseignements sur le scénario de développement, notamment :
        </p>
        <ul class="ml-12 my-4">
        <li>Mixité des bâtiments</li>
        <li>Coûts des services</li>
        <li>Coûts d'infrastructure</li>
        <li>Transports</li>
        <li>Coûts et revenus des municipalités</li>
        <li>Consommation d'énergie</li>
        <li>Émissions</li>
        </ul>
        <p class="text-center">
        Chaque scénario génère une nouvelle feuille de calcul contenant les renseignements relatifs à ce scénario.
        </p>`,
      slide5html: `<p class="text-center">
        Lorsque plusieurs scénarios sont créés, leur synthèse est ajoutée à la feuille de calcul "Résumé" (onglet). Les graphiques de la feuille de calcul "Résumé des graphiques" sont également mis à jour. Ces feuilles de calcul de synthèse permettent de comparer rapidement les scénarios.
        </p>`,
      slide6html: `<h2 class="text-center mt-16 pt-8 mx-8">
        C'est tout !<br/>
        Lancez-vous<br/>
        dans votre premier projet!
        </h2>`,
    },
  },
  scenario: {
    workbook: `Classeur`,
    addToWorkbook: `Ajouter ce scénario au classeur actuel`,
    addToWorkbookShort: `Ajouter au classeur`,
    updateWorkbook: `Mettre à jour ce scénario dans le classeur actuel`,
    updateWorkbookShort: `Mettre à jour le classeur`,
    newScenario: `Nouveau scénario`,
    newScenarioTooltiop: `Créer un nouveau scénario pour estimer l'incidence de la source d'énergie et des émissions de gaz à effet de serre.`,
    inputsDefaults: `Entrées/Valeurs par défaut`,
    outputs: `Sorties`,
    energyUse: `Consommation d'énergie`,
    emissions: `Émissions`,
    energyEFs: `Facteurs d'émissions des sources d'énergie`,
    totalDwellings: `Nombre total de logements`,
    perDwelling: `Par logement`,
    assumptionsRefs: `Hypothèses & Références`,
    modules: {
      scenario: `Information concernant le scénario`,
      buildings: `Bâtiments`,
      buildingsRefs: `Références des bâtiments`,
      services: `Service | Services`,
      servicesRefs: `Références des services`,
      servicesCost: `Coût des services`,
      servicesCapCost: `Coûts d'investissement pour les services`,
      servicesOMCost: `Fonctionnement et maintenance du service`,
      infrastructure: `Infrastructure`,
      infrastructureRefs: `Références des infrastructures`,
      infrastructureCost: `Coût des infrastructures`,
      infrastructureCapCost: `Coûts d'investissement pour les infrastructures`,
      infrastructureOMCost: `Exploitation et maintenance des infrastructures`,
      transportation: `Transports`,
      transportationRefs: `Hypothèses et références en matière de transport`,
      revenue: `Revenus`,
      revenueLong: `Revenus municipaux`,
      revenueTotal: `Revenu total`,
    },
  },
  appConfig: {
    buildings: {
      homeTypes: {
        single: `Unifamiliale détachée`,
        row: `Maison en rangée / Maison de ville`,
        apt: `Appartement`,
      },
      buildingEnergyCodes: {
        Current: `Référence`,
        CurrentDesc: `Maison moyenne typique`,
        passiveHouse: `maison passive`,
        passiveHouseDesc: `Norme de maison passive`,
        NECB_1: `CNÉB palier 2`,
        NECB_1Desc: `Code national de l'énergie pour les bâtiments - Canada palier 2`,
        NECB_2: `CNÉB palier 3`,
        NECB_2Desc: `Code national de l'énergie pour les bâtiments - Canada palier 3`,
        NECB_3: `CNÉB palier 4`,
        NECB_3Desc: `Code national de l'énergie pour les bâtiments - Canada palier 4`,
        BCStep_2: `Step Code de la C.B. - palier 2`,
        BCStep_2Desc: `Step Code de la C.B. - palier 2`,
        BCStep_3: `Step Code de la C.B. - palier 3`,
        BCStep_3Desc: `Step Code de la C.B. - palier 3`,
        BCStep_4: `Step Code de la C.B. - palier 4`,
        BCStep_4Desc: `Step Code de la C.B. - palier 4`,
        BCStep_5: `Step Code de la C.B. - palier 5`,
        BCStep_5Desc: `Step Code de la C.B. - palier 5`,
        TorontoGS_v3T1: `Toronto Green Standard V3 palier 1`,
        TorontoGS_v3T1Desc: `4 à 6 étages à ossature bois IRLM, version 3, palier 1`,
        TorontoGS_v3T2: `Toronto Green Standard V3 palier 2`,
        TorontoGS_v3T2Desc: `4 à 6 étages à ossature bois IRLM, version 3, palier 1`,
        TorontoGS_v3T3: `Toronto Green Standard V3 palier 3`,
        TorontoGS_v3T3Desc: `4 à 6 étages à ossature bois IRLM, version 3, palier 3`,
        TorontoGS_v3T4: `Toronto Green Standard V3 palier 4`,
        TorontoGS_v3T4Desc: `4 à 6 étages à ossature bois IRLM, version 3, palier 4`,
      },
      references: {
        description: `La taille moyenne des maisons est tirée de Shrink That Footprint`,
        cnec: `Code national de l'énergie du Canada`,
        ceud: `Ressources naturelles Canada Base de données complète sur la consommation d'énergie`,
        effImprove25: `Amélioration de l'efficacité énergétique de 25 % par rapport à la référence`,
        effImprove50: `Amélioration de l'efficacité énergétique de 50 % par rapport à la référence`,
        effImprove60: `Amélioration de l'efficacité énergétique de 60 % par rapport à la référence`,
        bcStepCode: `Energy Step Code, C.B.`,
        bcStep2: `Aucun changement dans l'amélioration de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 9. Amélioration de 20 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 3`,
        bcStep3: `Amélioration de 20 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 9. Amélioration de 40 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 3`,
        bcStep4: `Amélioration de 40 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 9. Amélioration de 80 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 3`,
        bcStep5: `Amélioration de 80 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 9. Amélioration de 80 % de l'efficacité énergétique par rapport à la référence pour les bâtiments de la partie 3`,
        tgs: `Toronto Green Standard`,
        tgsv3t1: `Amélioration de l'efficacité énergétique de 10 % par rapport à la référence pour les immeubles résidentiels à logements multiples`,
        tgsv3t2: `Amélioration de l'efficacité énergétique de 30 % par rapport à la référence pour les immeubles résidentiels à logements multiples`,
        tgsv3t3: `Amélioration de l'efficacité énergétique de 50 % par rapport à la référence pour les immeubles résidentiels à logements multiples`,
        tgsv3t4: `Amélioration de l'efficacité énergétique de 60 % par rapport à la référence pour les immeubles résidentiels à logements multiples`,
        passiveHouse: `International Passive House Association`,
        shrinkThatFootprint: `Taille des maisons : Shrink That Footprint`,
      },
    },
    regions: {
      provinces: {
        AB: `Alberta`,
        BC: `Colombie Britannique`,
        MB: `Manitoba`,
        NB: `Nouveau Brunswick`,
        NL: `Terre-Neuve et Labrador`,
        NS: `Nouvelle Ecosse`,
        NT: `Territoires du Nord-Ouest`,
        NU: `Nunavut`,
        ON: `Ontario`,
        PE: `Ile-du-Prince-Edouard`,
        QC: `Quebec`,
        SK: `Saskatchewan`,
        YT: `Yukon`,
      },
      references: {
        ieso2040: `Tiré des perspectives de planification annuelle 2020 de la SIERE pour 2020 - 2040; maintenu constant au-delà de 2040`,
      },
    },
    energySources: {
      energySources: {
        grid: `Électricité de réseau`,
        gridDesc: `Électricité de réseau`,
        natGas: `Gaz naturel`,
        natGasDesc: `Gaz naturel`,
        renewableNatGas: `Gaz naturel renouvelable`,
        renewableNatGasDesc: `Gaz naturel renouvelable`,
        hydrogen: `Hydrogène`,
        hydrogenDesc: `Hydrogène`,
        gasoline: `Essence`,
        gasolineDesc: `FE normalisés pour l'essence; la contribution de l'éthanol au mélange a été retirée de ces FE`,
        diesel: `Gazole`,
        dieselDesc: `FE normalisés pour le gazole; la contribution du biodiesel au mélange a été retirée de ces FE`,
        ethanol: `Ethanol`,
        ethanolDesc: `FE normalisés pour l'éthanol; la contribution de l'essence au mélange a été retirée de ces FE`,
        biodiesel: `Carburant biodiesel`,
        biodieselDesc: `FE normalisés du biodiesel; la contribution du diesel au mélange a été retirée de ces FE`,
        lightFuelOil: `Mazout léger et kérosène`,
        lightFuelOilDesc: `Mazout léger et kérosène`,
        propane: `Propane`,
        propaneDesc: `Propane`,
        heatingOil: `Huile de chauffage`,
        heatingOilDesc: `Huile de chauffage`,
        woodWaste: `Déchets de bois et liqueur noire`,
        woodWasteDesc: `Déchets de bois et liqueur noire`,
      },
      gwp: {
        description: `Les valeurs du potentiel de réchauffement atmosphérique proviennent d'Environnement et Changement climatique Canada :	Rapport d'inventaire national (NIR) 1990-2018. Simplifié`,
      },
      references: {
        eccNIR2018: `Environnement et Changement climatique Canada : Rapport d'inventaire national (RIN) 1990-2018. Simplifié`,
        canESS7: `Résultats du modèle CanESS V7`,
      },
    },
    infrastructure: {
      infrastructureTypes: {
        road2: `Route - 2 voies`,
        road4: `Route - 4 voies`,
        sidewalk: `Trottoir`,
        bikelane: `Voie cyclable`,
        water: `Conduite d'eau`,
        wastewater: `Tuyau d'évacuation des eaux usées`,
      },
    },
    neighbourhoods: {
      neighbourhoodTypes: {
        urbanInfillV1: `Aménagement intercalaire V1`,
        urbanInfillV1Desc: `Densité de logement moyenne à élevée, réseau routier maillé, bâtiments à usage mixte`,
        urbanInfillV2: `Aménagement intercalaire V2`,
        urbanInfillV2Desc: `Densité de logement moyenne à élevée, réseau routier maillé, bâtiments à usage mixte`,
        TODV1: `Développement axé sur les transports en commun V1`,
        TODV1Desc: `Densité moyenne de logements au niveau du nœud de transit, densité suburbaine à l'écart du nœud, mélange de réseaux de rues maillées et fermées`,
        TODV2: `Développement axé sur les transports en commun V2`,
        TODV2Desc: `Densité moyenne de logements au niveau du nœud de transit, densité suburbaine à l'écart du nœud, mélange de réseaux de rues maillées et fermées`,
        suburbanV1: `Développement faible densité V1`,
        suburbanV1Desc: `Réseau de rues fermées, lots de taille moyenne à grande, maisons indépendantes`,
        suburbanV2: `Développement faible densité V2`,
        suburbanV2Desc: `Réseau de rues fermées, lots de taille moyenne à grande, maisons indépendantes`,
      },
      devTypes: {
        existing: `existant`,
        greenfield: `terrain vague`,
      },
      references: {
        bcClicTool: `Outil CLIC de la C.B.`,
      },
    },
    revenue: {
      revenueTypes: {
        developmentCharges: `Frais de développement`,
        propertyTaxes: `Taxes foncières`,
        municipalRevTaxes: `Taxes sur les revenus municipaux`,
      },
      references: {
        description: `Recettes municipales provenant des redevances d'aménagement de chaque nouveau logement et des taxes foncières annuelles. Les utilisateurs peuvent obtenir ces informations auprès du service municipal des impôts fonciers, de la planification et du développement, ou du service immobilier, ou d'un service équivalent.`,
      },
    },
    services: {
      serviceTypes: {
        school: `École`,
        police: `Police`,
        fire: `Pompier`,
        waste: `Déchets et recyclage`,
      },
      references: {
        description: `Toutes les intensités de coûts par défaut proviennent de l'outil BC Click. Par défaut, on suppose qu'il n'est pas nécessaire d'installer des nouvelles décharges ou d’acheter des nouveaux camions. Pour tous les services, entrez 0 si vous n'ajoutez pas de nouveaux établissements.`,
      },
    },
    transportation: {
      transportationTypes: {
        puv: `Véhicule à usage personnel`,
        transit: `Transport en commun`,
        walk: `Marche`,
        bike: `Vélo`,
      },
      references: {
        description: `Tous les kilomètres parcourus par défaut proviennent de L'outil d'évaluation de la durabilité des quartiers mis au point par RNCan, la SCHL et IBI.
         Les valeurs de consommation de carburant proviennent de BC Transit, du NREL et de l'Institut flamand de recherche technologique (VITO).`,
        toolForEvalSust: `Outil d'évaluation de la durabilité des quartiers`,
        nrelHConsumption: `Consommation de carburant à l'hydrogène : NREL`,
        vitoNatGasConsumption: `Consommation de gaz naturel : VITO`,
        dieselnetDieselConsumption: `Consommation de carburant diesel, essence : DieselNet`,
        vktPerYear: `KPV par les véhicules à usage personnel et KPV de transit annuel par logement: Schl émissions de gaz à effet de serre attribuables aux déplacements urbains : outil d'évaluation de la durabilité des quartiers (2000)`,
      },
      activeMode: `Mode de transport actif`,
    },
  },
  worksheets: {
    scenariosSummary: `Résumé des scénarios`,
    chartsSummary: `Graphiques récapitulatifs`,
  },
};
