// © Copyright 2023, LUIC-CIUT's Contributors
// list of transportation types and associated config details
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";

export default function transportationConfig() {
  const t = i18n.global.t;
  const transportationTypes = {
    /**
     * transportation types and associated attributes
     *
     * example transportationType definition

    walk: {
      id: "walk", // id - same as key
      name: "Walking", // user friendly name
      active: true, // OPTIONAL. [true, false] is this transportation mode considered active transit (no energy source required). Default is false if not defined.
      fuelConsumption: {
        // OPTIONAL fuel consumption values for this mode type for each transportation energy source
        // for now these are averages between LDV and LDT could break these out in future versions
        grid: 1.1, // MJ/100km fuel consumption
        hydrogen: 1.1, // MJ/100km fuel consumption
        gasoline: 214, // MJ/100km fuel consumption
        diesel: 1.1, // MJ/100km fuel consumption
        propane: 1.1, // MJ/100km fuel consumption
        biodiesel: 1.1, // MJ/100km fuel consumption
        natGas: 1973, // MJ/100km fuel consumption
      },
    },
     */
    puv: {
      id: "puv",
      name: t("appConfig.transportation.transportationTypes.puv"),
      fuelConsumption: {
        grid: 69, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
        hydrogen: 127, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
        gasoline: 214, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
        diesel: 200, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
        propane: 250, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
        biodiesel: 200, // MJ/100km fuel consumption, source https://dieselnet.com/standards/us/fe_ghg.php
      },
    },
    transit: {
      id: "transit",
      name: t("appConfig.transportation.transportationTypes.transit"),
      fuelConsumption: {
        grid: 464, // MJ/100km fuel consumption, source observed municipal data
        hydrogen: 414, // MJ/100km fuel consumption, source https://www.nrel.gov/docs/fy14osti/60603.pdf
        // gasoline: 214, // MJ/100km fuel consumption
        diesel: 1856, // MJ/100km fuel consumption, source observed municipal data
        // propane: 1.1, // MJ/100km fuel consumption
        biodiesel: 1856, // MJ/100km fuel consumption, source observed municipal data
        natGas: 1973, // MJ/100km fuel consumption, source https://www.witpress.com/Secure/elibrary/papers/UT01/UT01061FU.pdf
      },
    },
    walk: {
      id: "walk",
      name: t("appConfig.transportation.transportationTypes.walk"),
      active: true,
      icon: "$personWalking",
    },
    bike: {
      id: "bike",
      name: t("appConfig.transportation.transportationTypes.bike"),
      active: true,
      icon: "$personBiking",
    },
  };

  const transportationSectorReferences = {
    // these references are used repeatedly for all neighbourhood types
    description: t("appConfig.transportation.references.description"),
    references: [
      [
        t("appConfig.transportation.references.toolForEvalSust"),
        "https://publications.gc.ca/site/eng/9.808262/publication.html",
      ],
      [t("appConfig.transportation.references.dieselnetDieselConsumption"), "https://dieselnet.com/standards/us/fe_ghg.php"],
      [t("appConfig.transportation.references.nrelHConsumption"), "https://www.nrel.gov/docs/fy14osti/60603.pdf"],
      [t("appConfig.transportation.references.vitoNatGasConsumption"), "https://www.witpress.com/Secure/elibrary/papers/UT01/UT01061FU.pdf"],
      [t("appConfig.transportation.references.vktPerYear"), "https://publications.gc.ca/site/archivee-archived.html?url=https://publications.gc.ca/collections/collection_2011/schl-cmhc/nh18-1-4/NH18-1-4-1-2000-eng.pdf"],
    ],
  }

  /**
   * gets an array of service types, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of service id's (strings) to filter the list to
   * @returns an array of service objects
   */
  const getTransAsArray = (filterIds = null) => {
    return genericUtils().getObjectKeysAsArray(transportationTypes, filterIds);
  };

  /**
   * gets an array of services with only name and id attributes, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of service type id's (strings) to filter the list to
   * @returns an array of service type objects containing only names and id's
   */
  const getTransNamesIdsAsArray = (filterIds = null) => {
    return getTransAsArray(filterIds).map((service) => {
      return { id: service.id, name: service.name };
    });
  };

  return {
    transportationTypes,
    transportationSectorReferences,
    getTransAsArray,
    getTransNamesIdsAsArray,
  };
}
