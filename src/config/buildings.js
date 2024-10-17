// © Copyright 2023, LUIC-CIUT's Contributors
// list of building types, building codes and associated config details
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";

export default function buildingsConfig() {
  const t = i18n.global.t;

  const homeTypes = {
    /**
     * home types and associated attributes
     *
     * example homeType definition

    single: {
      id: "single", // id - same as key
      name: "Single Detached", // user friendly name
      size_m2: 186, // square footage of 1 single home in m2
    },
     */
    single: {
      id: "single",
      name: t("appConfig.buildings.homeTypes.single"),
      size_m2: 186, // source - https://shrinkthatfootprint.com/how-big-is-a-house/#:~:text=The%20average%20house%20size%20in%20the%20US%20was,big%20at%20181%20m%202%20%281%2C948%20ft%202%29.
    },
    row: {
      id: "row",
      name: t("appConfig.buildings.homeTypes.row"),
      size_m2: 140,
    },
    apt: {
      id: "apt",
      name: t("appConfig.buildings.homeTypes.apt"),
      size_m2: 93, // source - https://rentals.ca/blog/rentals-ca-february-2019-rent-report#:~:text=The%20chart%20shows%20that%20the%20average%20size%20of,between%20600%20square%20feet%20and%20800%20square%20feet.
    },
  };

  const buildingEnergyCodes = {
    /**
     * building energy codes and associated attributes
     *
     * example buildingEnergyCode definition
    ASHRAE290: {
        id: "ASHRAE290", // id - same as key
        name: "ASHRAE 290", // user friendly name
        description: `description`, // description of the building code
        eui: {
            // eui values in MJ/m2/yr for different homeTypes
            single: 75,
            row: 70,
            apt: 60,
        },
    },
     */
    Current: {
        id: "Current",
        name: t("appConfig.buildings.buildingEnergyCodes.Current"),
        description: t("appConfig.buildings.buildingEnergyCodes.CurrentDesc"),
        references: [
            [t("appConfig.buildings.references.ceud"), "https://oee.nrcan.gc.ca/corporate/statistics/neud/dpa/menus/trends/comprehensive_tables/list.cfm"],
            [t("appConfig.buildings.references.effImprove25")],
          ],
        eui: {
            single: 750,
            row: 616,
            apt: 572,
        },
    },
    passiveHouse: {
        id: "passiveHouse",
        name: t("appConfig.buildings.buildingEnergyCodes.passiveHouse"),
        description: t("appConfig.buildings.buildingEnergyCodes.passiveHouseDesc"),
        references: [
            [t("appConfig.buildings.references.passiveHouse"), "https://passivehouse-international.org/index.php?page_id=150"],
        ],
        eui: {
            single: 432,
            row: 432,
            apt: 432,
        },
    },
    NECB_1: {
        id: "NECB_1",
        name: t("appConfig.buildings.buildingEnergyCodes.NECB_1"),
        description: t("appConfig.buildings.buildingEnergyCodes.NECB_1Desc"),
        references: [
            [t("appConfig.buildings.references.cnec"), "https://natural-resources.canada.ca/energy-efficiency/buildings/new-buildings/canadas-national-energy-code/20675"],
            [t("appConfig.buildings.references.effImprove25")],
          ],
        eui: {
            single: 563,
            row: 462,
            apt: 429,
        },
    },
    NECB_2: {
        id: "NECB_2",
        name: t("appConfig.buildings.buildingEnergyCodes.NECB_2"),
        description: t("appConfig.buildings.buildingEnergyCodes.NECB_2Desc"),
        references: [
            [t("appConfig.buildings.references.cnec"), "https://natural-resources.canada.ca/energy-efficiency/buildings/new-buildings/canadas-national-energy-code/20675"],
            [t("appConfig.buildings.references.effImprove50")],
          ],
        eui: {
            single: 375,
            row: 308,
            apt: 286,
        },
    },
    NECB_3: {
        id: "NECB_3",
        name: t("appConfig.buildings.buildingEnergyCodes.NECB_3"),
        description: t("appConfig.buildings.buildingEnergyCodes.NECB_3Desc"),
        references: [
            [t("appConfig.buildings.references.cnec"), "https://natural-resources.canada.ca/energy-efficiency/buildings/new-buildings/canadas-national-energy-code/20675"],
            [t("appConfig.buildings.references.effImprove60")],
          ],
          eui: {
            single: 300,
            row: 246,
            apt: 229,
          },
        },
        BCStep_2: {
          id: "BCStep_2",
          name: t("appConfig.buildings.buildingEnergyCodes.BCStep_2"),
          description: t("appConfig.buildings.buildingEnergyCodes.BCStep_2Desc"),
          references: [
            [t("appConfig.buildings.references.bcStepCode"), "https://energystepcode.ca/"],
            [t("appConfig.buildings.references.bcStep2")],
          ],
          eui: {
            single: 750,
            row: 616,
            apt: 458,
          },
        },
        BCStep_3: {
          id: "BCStep_3",
          name: t("appConfig.buildings.buildingEnergyCodes.BCStep_3"),
          description: t("appConfig.buildings.buildingEnergyCodes.BCStep_3Desc"),
          references: [
            [t("appConfig.buildings.references.bcStepCode"), "https://energystepcode.ca/"],
            [t("appConfig.buildings.references.bcStep3")],
          ],
          eui: {
            single: 600,
            row: 493,
            apt: 343,
          },
        },
        BCStep_4: {
          id: "BCStep_4",
          name: t("appConfig.buildings.buildingEnergyCodes.BCStep_4"),
          description: t("appConfig.buildings.buildingEnergyCodes.BCStep_4Desc"),
          references: [
            [t("appConfig.buildings.references.bcStepCode"), "https://energystepcode.ca/"],
            [t("appConfig.buildings.references.bcStep4")],
          ],
          eui: {
            single: 450,
            row: 370,
            apt: 114,
          },
        },
        BCStep_5: {
          id: "BCStep_5",
          name: t("appConfig.buildings.buildingEnergyCodes.BCStep_5"),
          description: t("appConfig.buildings.buildingEnergyCodes.BCStep_5Desc"),
          references: [
            [t("appConfig.buildings.references.bcStepCode"), "https://energystepcode.ca/"],
            [t("appConfig.buildings.references.bcStep5")],
          ],
          eui: {
            single: 150,
            row: 123,
            apt: 114,
          },
        },
        TorontoGS_v3T1: {
          id: "TorontoGS_v3T1",
          name: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T1"),
          description: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T1Desc"),
          references: [
            [t("appConfig.buildings.references.tgs"), "https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/toronto-green-standard/"],
            [t("appConfig.buildings.references.tgsv3t1")],
          ],
          eui: {
            single: 750,
            row: 616,
            apt: 515,
          },
        },
        TorontoGS_v3T2: {
          id: "TorontoGS_v3T2",
          name: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T2"),
          description: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T2Desc"),
          references: [
            [t("appConfig.buildings.references.tgs"), "https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/toronto-green-standard/"],
            [t("appConfig.buildings.references.tgsv3t2")],
          ],
          eui: {
            single: 750,
            row: 616,
            apt: 400,
          },
        },
        TorontoGS_v3T3: {
          id: "TorontoGS_v3T3",
          name: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T3"),
          description: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T3Desc"),
          references: [
            [t("appConfig.buildings.references.tgs"), "https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/toronto-green-standard/"],
            [t("appConfig.buildings.references.tgsv3t3")],
          ],
          eui: {
            single: 750,
            row: 616,
            apt: 286,
          },
        },
        TorontoGS_v3T4: {
          id: "TorontoGS_v3T4",
          name: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T4"),
          description: t("appConfig.buildings.buildingEnergyCodes.TorontoGS_v3T4Desc"),
          references: [
            [t("appConfig.buildings.references.tgs"), "https://www.toronto.ca/city-government/planning-development/official-plan-guidelines/toronto-green-standard/"],
            [t("appConfig.buildings.references.tgsv3t4")],
          ],
        eui: {
            single: 750,
            row: 616,
            apt: 229,
        },
    },
  };

  const buildingSectorReferences = {
    // these references are used repeatedly for all neighbourhood types
    description: t("appConfig.buildings.references.description"),
    references: [
      [t("appConfig.buildings.references.shrinkThatFootprint"), `https://shrinkthatfootprint.com/how-big-is-a-house/`],
    ],
  };

  /**
   * gets an array of buildingEnergyCode types, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of buildingEnergyCode id's (strings) to filter the list to
   * @returns an array of buildingEnergyCode objects
   */
  const getBuildingEnergyCodesAsArray = (filterIds = null) => {
    return genericUtils().getObjectKeysAsArray(buildingEnergyCodes, filterIds);
  };

  /**
   * gets an array of buildingEnergyCodes with only name and id attributes, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of buildingEnergyCode type id's (strings) to filter the list to
   * @returns an array of buildingEnergyCode type objects containing only names and id's
   */
  const getBuildingEnergyCodeNamesIdsAsArray = (filterIds = null) => {
    return getBuildingEnergyCodesAsArray(filterIds).map((buildingEnergyCode) => {
      return { id: buildingEnergyCode.id, name: buildingEnergyCode.name };
    });
  };

  /**
   * gets the collection of all unique building codes used in a scenario
   * @param {Object} scenario - scenario object
   * @returns an Array containing building code objects for all energy sources used in a scenario
   */
  const getAllBuildingCodesForScenario = (scenario) => {
    const scenarioBuildingCodes = [];
    const codeIds = [];
    Object.keys(scenario.buildings).forEach((_type) => {
      if (!codeIds.includes(scenario.buildings[_type].buildingEnergyCode)) {
        codeIds.push(scenario.buildings[_type].buildingEnergyCode)
      }
    });
    codeIds.forEach((codeId) => {
      scenarioBuildingCodes.push(buildingEnergyCodes[codeId])
    })
    return scenarioBuildingCodes;
  };

  return {
    homeTypes,
    buildingEnergyCodes,
    buildingSectorReferences,
    getBuildingEnergyCodesAsArray,
    getBuildingEnergyCodeNamesIdsAsArray,
    getAllBuildingCodesForScenario,
  };
}
