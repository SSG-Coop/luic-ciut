// © Copyright 2023, LUIC-CIUT's Contributors
// list of neighbourhood types and associated config details
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";
import transportationConfig from "@/config/transportation.js";
import buildingsConfig from "@/config/buildings.js";

export default function neighbourhoodTypesConfig() {
  const t = i18n.global.t;

  const servicesSectorReferences = {
    description: t("appConfig.services.references.description"),
    references: [
      [
        t("appConfig.neighbourhoods.references.bcClicTool"),
        "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
      ],
    ],
  };

  const revenueSectorReferences = {
    description: t("appConfig.revenue.references.description"),
    references: [],
  };

  const neighbourhoods = {
    /**
     * neighbourhood types and associated attributes
     *
     * example neighbourhood definition

    urbanInfillV1: {
      id: "urbanInfillV1", // id - same as key
      name: "Urban Infill V1", // common name
      description: `Med-high housing density, grid road network, mixed-use buildings`,
      developmentType: "existing", // can be one of ['existing','greenfield']
      icon: "$city",
      sectorDefaults: {
        homes: {
          // list of home types in the neighbourhood and amounts of each type. Type keys must match building type id's from buildings config
          row: 875,
          apt: 2625,
        },
        services: {
          // list of service types in the neighbourhood and amounts of each type. Type keys must match service type id's from services config
          school: 1,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          // list of infrastructure types in the neighbourhood and lengths of each type in m. Type keys must match infrastructure type id's from infrastructure config
          road2: 150,
          road4: 10,
          sidewalk: 300,
          bikelane: 10,
          water: 1300,
          wastewater: 1300,
        },
        transportation: {
          // list of transportation types in the neighbourhood and default VKTs for each type
          puv: 5000,
          transit: 15000,
          walk: 200,
          bike: 400,
        },
      },
      sectorReferences: {
        // the following objects can be used to describe model logic and assumptions behind each sector.
        // If there is no notable description or logic to be used, leave the object empty (like the revenue example below)
        homes: {
          description: `This text can be used to describe the assumptions and logic behind the inputs and defaults for the BUILDINGS section.`,
          references: [
            // OPTIONAL list of references in the form of ["text", "https://my.link.com"]. Link is optional for each reference.
            ["this is a reference with a link", "https://ssg.coop"],
            ["this is a reference with text only and no link"],
          ]
        },
        services: {
          description: `This text can be used to describe the assumptions and logic behind the inputs and defaults for the SERVICES section.`,
          references: [
            ["this is a reference with a link", "https://ssg.coop"],
            ["this is a reference with text only and no link"],
          ]
        },
        infrastructure: {
          description: `This text can be used to describe the assumptions and logic behind the inputs and defaults for the INFRASTRUCTURE section.`,
          references: [
            ["this is a reference with a link", "https://ssg.coop"],
            ["this is a reference with text only and no link"],
          ]
        },
        transportation: {
          description: `This text can be used to describe the assumptions and logic behind the inputs and defaults for the TRANSPORTATION section.`,
          references: [], // no references or links in this example
        },
        revenue: {}, // not used at this time
      },
    },
    */
    urbanInfillV1: {
      id: "urbanInfillV1", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.urbanInfillV1"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.urbanInfillV1Desc"),
      developmentType: "existing", // can be one of ['existing','greenfield']
      icon: "$city",
      sectorDefaults: {
        homes: {
          // list of home types in the neighbourhood and amounts of each type. Type keys must match building type id's from buildings config
          // Assume a total of 3500 homes (units) with a 25% town/row, 75% apartment split
          row: 875,
          apt: 2625,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 4000,
          road4: 0,
          sidewalk: 0,
          bikelane: 2000,
          water: 500,
          wastewater: 500,
        },
        transportation: {
          puv: 10300, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 4600, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 2, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    urbanInfillV2: {
      id: "urbanInfillV2", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.urbanInfillV2"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.urbanInfillV2Desc"),
      developmentType: "existing", // can be one of ['existing','greenfield']
      icon: "$city",
      sectorDefaults: {
        homes: {
          // list of home types in the neighbourhood and amounts of each type. Type keys must match building type id's from buildings config
          // Assume a total of 5000 homes (units) with a 5% town/row, 95% apartment split
          row: 250,
          apt: 4750,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 4000,
          road4: 0,
          sidewalk: 0,
          bikelane: 2000,
          water: 825,
          wastewater: 825,
        },
        transportation: {
          puv: 10300, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 4600, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 2, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    TODV1: {
      id: "TODV1", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.TODV1"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.TODV1Desc"),
      developmentType: "existing", // can be one of ['existing','greenfield']
      icon: "$houseBuilding",
      sectorDefaults: {
        homes: {
          // Assume a total of 1500 homes (units) with a 50% single, 25% town/row, 25% apartment split
          single: 750,
          row: 375,
          apt: 375,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 4000,
          road4: 0,
          sidewalk: 0,
          bikelane: 2000,
          water: 2000,
          wastewater: 2000,
        },
        transportation: {
          puv: 14000, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 4000, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 9, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    TODV2: {
      id: "TODV2", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.TODV2"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.TODV2Desc"),
      developmentType: "existing", // can be one of ['existing','greenfield']
      icon: "$houseBuilding",
      sectorDefaults: {
        homes: {
          // Assume a total of 2500 homes (units) with a 25% single, 25% town/row, 50% apartment split
          single: 625,
          row: 625,
          apt: 1250,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 4000,
          road4: 0,
          sidewalk: 0,
          bikelane: 2000,
          water: 2000,
          wastewater: 2000,
        },
        transportation: {
          puv: 14000, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 4000, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 9, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    suburbanV1: {
      id: "suburbanV1", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.suburbanV1"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.suburbanV1Desc"),
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$house",
      sectorDefaults: {
        homes: {
          // Assume a total of 700 homes (units) with a 100% single
          single: 700,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 1800,
          road4: 1000,
          sidewalk: 0,
          bikelane: 1800,
          water: 2400,
          wastewater: 2400,
        },
        transportation: {
          puv: 20900, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 3900, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 25, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    suburbanV2: {
      id: "suburbanV2", // id - same as key
      name: t("appConfig.neighbourhoods.neighbourhoodTypes.suburbanV2"),
      description: t("appConfig.neighbourhoods.neighbourhoodTypes.suburbanV2Desc"),
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$house",
      sectorDefaults: {
        homes: {
          // Assume a total of 1000 homes (units) with a 100% single
          single: 1000,
        },
        services: {
          school: 1.5,
          police: 1,
          fire: 1,
          waste: 1,
        },
        infrastructure: {
          road2: 1800,
          road4: 1000,
          sidewalk: 0,
          bikelane: 1800,
          water: 2400,
          wastewater: 2400,
        },
        transportation: {
          puv: 20900, // VKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          transit: 3900, // PKT per household, values from default scenarios in CMHC Tool for Evaluating Neighbourhood Sustainability
          walk: 0,
          bike: 0,
        },
        DOC: 25, // distance to central business district in kms, taken from BC Click tool
      },
      sectorReferences: {
        homes: { ...buildingsConfig().buildingSectorReferences },
        services: { ...servicesSectorReferences },
        infrastructure: {
          description: `All default cost intensities coming from the BC Click tool. By default road costs include sidewalk costs`,
          references: [
            [
              t("appConfig.neighbourhoods.references.bcClicTool"),
              "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/local-governments/planning-land-use/clic_decision_support_tool_user_guide.pdf",
            ],
          ],
        },
        transportation: {
          ...transportationConfig().transportationSectorReferences,
        },
        revenue: {
          ...revenueSectorReferences,
        },
      },
    },
    /*loops: {
      id: "loops", // id - same as key
      name: "Loops", // common name
      description: `low housing density, cul-de-sec design, single family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$house",
      sectorDefaults: {
        pph: 25, //people per hectare
        homes: {
          single: 416, // default number of buildings for a 40 ha development
          row: 0,
          apt: 0,
        },
        infrastructure: {
          road2: 2733, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 1133, // meters of pipe
          wastewater: 1133, // meters of pipe
        },
      }
    },
    civic: {
      id: "Civic", // id - same as key
      name: "Civic", // common name
      description: `low housing density, cul-de-sec design, mainly single family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$house",
      sectorDefaults: {
        pph: 50, //people per hectare
        homes: {
          single: 500, // default number of buildings for a 40 ha development
          row: 37, // default number of buildings for a 40 ha development
          apt: 0,
        },
        infrastructure: {
          road2: 2533, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 933, // meters of pipe
          wastewater: 933, // meters of pipe
        },
      }
    },
    corridor: {
      id: "Corridor", // id - same as key
      name: "Cooridor", // common name
      description: `medium housing density, grid design, mainly single family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$houseBuilding",
      sectorDefaults: {
        pph: 60, //people per hectare
        homes: {
          single: 500, // default number of buildings for a 40 ha development
          row: 32, // default number of buildings for a 40 ha development
          apt: 6, // default number of buildings for a 40 ha development
        },
        infrastructure: {
          road2: 3600, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 2000, // meters of pipe
          wastewater: 2000, // meters of pipe
        },
      }
    },
    gridded: {
      id: "Gridded", // id - same as key
      name: "Gridded", // common name
      description: `low housing density, grid design, single family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$house",
      sectorDefaults: {
        pph: 30, //people per hectare
        homes: {
          single: 500, // default number of buildings for a 40 ha development
          row: 0, // default number of buildings for a 40 ha development
          apt: 0, // default number of buildings for a 40 ha development
        },
        infrastructure: {
          road2: 3200, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 1600, // meters of pipe
          wastewater: 1600, // meters of pipe
        },
      }
    },
    node: {
      id: "Node", // id - same as key
      name: "Node", // common name
      description: `Medium housing density, grid design, mainly multi family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$houseBuilding",
      sectorDefaults: {
        pph: 100, //people per hectare
        homes: {
          single: 80, // default number of buildings for a 40 ha development
          row: 60, // default number of buildings for a 40 ha development
          apt: 30, // default number of buildings for a 40 ha development
        },
        infrastructure: {
          road2: 2667, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 1067, // meters of pipe
          wastewater: 1067, // meters of pipe
        },
      }
    },
    tod: {
      id: "tod", // id - same as key
      name: "Traffic Oriented Design", // common name
      description: `high housing density, grid design, mainly multi family homes`,
      developmentType: "greenfield", // can be one of ['existing','greenfield']
      icon: "$city",
      sectorDefaults: {
        pph: 200, //people per hectare
        homes: {
          single: 150, // default number of buildings for a 40 ha development
          row: 157, // default number of buildings for a 40 ha development
          apt: 60, // default number of buildings for a 40 ha development
        },
        infrastructure: {
          road2: 3467, // meters of road and sidewalk
          road4: 0,
          sidewalk: 0,
          bikelane: 0,
          water: 1867, // meters of pipe
          wastewater: 1867, // meters of pipe
        },
      }
    },*/
  };

  /**
   * gets an array of neighbourhood types, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of neighbourhood id's (strings) to filter the list to
   * @returns an array of neighbourhood objects
   */
  const getNeighbourhoodsAsArray = (filterIds = null) => {
    return genericUtils().getObjectKeysAsArray(neighbourhoods, filterIds);
  };

  /**
   * gets an array of neighbourhoods with only name and id attributes, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of neighbourhood type id's (strings) to filter the list to
   * @returns an array of neighbourhood type objects containing only names and id's
   */
  const getNeighbourhoodNamesIdsAsArray = (filterIds = null) => {
    return getNeighbourhoodsAsArray(filterIds).map((neighbourhood) => {
      return { id: neighbourhood.id, name: neighbourhood.name };
    });
  };

  /**
   * calculate the total default homes for a neighbourhood type
   * @param {String} neighbourhoodType - neighbourhood type
   * @returns total homes integer
   */
  const totalHomesForNeighbourhoodDefault = (neighbourhoodType) => {
    const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
    return sumValues(neighbourhoods[neighbourhoodType].sectorDefaults.homes);
  };

  /**
   * calculate the total homes for a neighbourhood in a scenario
   * @param {Object} buildings - buildings object from within a scenario, containing values for each building type
   * @returns total homes integer
   */
  const totalHomesForNeighbourhood = (buildings) => {
    let totalHomes = 0;
    Object.keys(buildings).forEach((homeType) => {
      totalHomes += parseInt(buildings[homeType].qty);
    });
    return totalHomes;
  };

  return {
    neighbourhoods,
    getNeighbourhoodsAsArray,
    getNeighbourhoodNamesIdsAsArray,
    totalHomesForNeighbourhoodDefault,
    totalHomesForNeighbourhood,
  };
}
