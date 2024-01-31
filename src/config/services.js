// © Copyright 2023, LUIC-CIUT's Contributors
// list of neighbourhood service types and associated config details
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";

export default function servicesConfig() {
  const t = i18n.global.t;

  const serviceTypes = {
    /**
     * service types and associated attributes
     *
     * example serviceType definition

    school: {
      id: "school", // id - same as key
      name: "School", // user friendly name
      capCostIntensity: 123, // default capital cost intensity in $/student
      maintCostIntensity: 456, // default maintenance cost intensity in $/student
    },
     */
    /**
     * all cost intensities currently coming from the BC Click tool
     */
    school: {
      id: "school",
      name: t("appConfig.services.serviceTypes.school"),
      capCostIntensity: 6541, /** $/student */
      maintCostIntensity: 6949, /** $/student */
      units: `$/${t('general.student')}`,
    },
    police: {
      id: "police",
      name: t("appConfig.services.serviceTypes.police"),
      capCostIntensity: 21, /** $/household */
      maintCostIntensity: 498, /** $/household */
      units: `$/${t('general.dwelling', 1)}`,
    },
    fire: {
      id: "fire",
      name: t("appConfig.services.serviceTypes.fire"),
      capCostIntensity: 40, /** $/household */
      maintCostIntensity: 328, /** $/household */
      units: `$/${t('general.dwelling', 1)}`,
    },
    waste: {
      id: "waste",
      name: t("appConfig.services.serviceTypes.waste"),
      capCostIntensity: 0, /** assume no new landfills or trucks need to be purchased by default */
      maintCostIntensity: 184, /** $/household */
      units: `$/${t('general.dwelling', 1)}`,
    },
  };

  /**
   * gets an array of service types, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of service id's (strings) to filter the list to
   * @returns an array of service objects
   */
  const getServicesAsArray = (filterIds = null) => {
    return genericUtils().getObjectKeysAsArray(serviceTypes, filterIds);
  };

  /**
   * gets an array of services with only name and id attributes, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of service type id's (strings) to filter the list to
   * @returns an array of service type objects containing only names and id's
   */
  const getServiceNamesIdsAsArray = (filterIds = null) => {
    return getServicesAsArray(filterIds).map((service) => {
      return { id: service.id, name: service.name };
    });
  };

  return {
    serviceTypes,
    getServicesAsArray,
    getServiceNamesIdsAsArray,
  };
}
