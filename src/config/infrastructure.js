// © Copyright 2023, LUIC-CIUT's Contributors
// list of infrastructure types and associated config details
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";

export default function infrastructureConfig() {
  const t = i18n.global.t;

  const infrastructureTypes = {
    /**
     * infrastructure types and associated attributes
     *
     * example infrastructureType definition

    road2: {
      id: "road2", // id - same as key
      name: "Road - 2 Lane", // user friendly name
      capCostIntensity: 123, // capital cost intensity in $/m of road length
      maintCostIntensity: 456, // maintenance cost intensity in $/m of road length
    },
     */
    /**
     * all cost intensities currently coming from the BC Click tool
     * road costs include sidewalk costs
     * no bike lane costs in the BC Click tool, setting them the same as roads for now
     */
    road2: {
      id: "road2",
      name: t("appConfig.infrastructure.infrastructureTypes.road2"),
      capCostIntensity: 1450,
      maintCostIntensity: 10,
    },
    road4: {
      id: "road4",
      name: t("appConfig.infrastructure.infrastructureTypes.road4"),
      capCostIntensity: 1879,
      maintCostIntensity: 12,
    },
    sidewalk: {
      id: "sidewalk",
      name: t("appConfig.infrastructure.infrastructureTypes.sidewalk"),
      capCostIntensity: 0,
      maintCostIntensity: 0,
    },
    bikelane: {
      id: "bikelane",
      name: t("appConfig.infrastructure.infrastructureTypes.bikelane"),
      capCostIntensity: 642,
      maintCostIntensity: 10,
    },
    water: {
      id: "water",
      name: t("appConfig.infrastructure.infrastructureTypes.water"),
      capCostIntensity: 200,
      maintCostIntensity: 275,
    },
    wastewater: {
      id: "wastewater",
      name: t("appConfig.infrastructure.infrastructureTypes.wastewater"),
      capCostIntensity: 220,
      maintCostIntensity: 7,
    },
  };

  /**
   * gets an array of infrastructureType types, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of infrastructureType id's (strings) to filter the list to
   * @returns an array of infrastructureType objects
   */
  const getInfrastructureTypesAsArray = (filterIds = null) => {
    return genericUtils().getObjectKeysAsArray(infrastructureTypes, filterIds);
  };

  /**
   * gets an array of infrastructureTypes with only name and id attributes, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of infrastructureType type id's (strings) to filter the list to
   * @returns an array of infrastructureType type objects containing only names and id's
   */
  const getInfrastructureTypeNamesIdsAsArray = (filterIds = null) => {
    return getInfrastructureTypesAsArray(filterIds).map(
      (infrastructureType) => {
        return { id: infrastructureType.id, name: infrastructureType.name };
      }
    );
  };

  return {
    infrastructureTypes,
    getInfrastructureTypesAsArray,
    getInfrastructureTypeNamesIdsAsArray,
  };
}
