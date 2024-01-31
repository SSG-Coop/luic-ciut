/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * global list of energy types and related emissions factors
 * individual energy type/emissions factors can be overwritten by province or city config in regions.js
 * EF can be expressed as a single number or as an array of values for different years
 *    - if expressed as a number, that value will be used for all calculations for all years
 *    - if expressed as an array, the value corresponding to the action year will be used. Arrays are assumed to start at efStartYear and continue sequentially with a value for each subsequent year going forward
 * EF are in units of g/MJ unless an override is provided using efUnit key
 */
import i18n from '@/plugins/i18n';
import genericUtils from "@/utils/genericUtils";
import { useScenarioStore } from "@/store/scenario.js";
import regionsConfig from "@/config/regions.js";
import appConfig from "@/config/appConfig.js";
import configureMeasurements from "convert-units"; // using version 3.0.0-beta from https://github.com/convert-units/convert-units
import energy from 'convert-units/definitions/energy';
const convert = configureMeasurements({ energy });

export default function energySourcesConfig() {
  const t = i18n.global.t;
  const _energySources = {
    /**
     * _energySources contains global list of all types of energy sources and related config data for them
     * unless otherwise specified, conversion values for energy/volume of fuel are taken from CIS generic view loadCanESS_CIS.t
     * EXAMPLE ENERGY SOURCE
      natGas: {
        id: "natGas",               // the unique key to use in the system. These need to be consistent when overriding in provincial or city configs. NOTE that id is duplicated from the original object key
        name: "Natural Gas",
        description: "Natural Gas",
        absUnit: "m³/yr",           // the absolute unit that users can enter amounts in
        convUnit: "m3natGas",       // timeless unit (remove '/yr'). If absUnit is in volume instead of energy, this should be a unique code. Code name of units for handling conversions from volume to energy.
        convVal: 1,                 // REQUIRED IF units are volume based instead of energy based - the conversion factor to convert to base units of Joules (J) -- NOTE the converters base units are J, not MJ.
        emissionsFactors: {         // emissions factors for this fuel type in (default in g/MJ)
          CO2: 100,                 // if emissions factor for this fuel type changes over time, this should be an array of numbers representing years starting with efStartYear and going up to efEndYear. If values do not exist all the way until efEndYear, the last index in the array will be filled to subsequent years
          CH4: 100,
          N2O: 100,
        },
        efUnit: "MJ",               // if emission factor unit is not g/MJ, override it here... example "kWh" would be for g/kWh
      },
     */
    grid: {
      id: "grid",
      name: t("appConfig.energySources.energySources.grid"),
      description: t("appConfig.energySources.energySources.gridDesc"),
      absUnit: `kWh/${t('general.yearAbbr')}`,
      convUnit: "kWh",
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: [
          2.92e1,
          3.23e1,
          2.65e1,
          3.87e1,
          3.13e1,
          3.14e1,
          2.97e1,
          3.2e1,
          2.85e1,
          3.38e1,
          2.91e1,
          3.13e1,
          3.33e1,
          3.79e1,
          3.79e1,
          3.77e1,
          3.77e1,
          3.76e1,
          3.76e1,
          3.76e1,
          3.75e1,
          3.75e1,
          3.75e1,
          3.75e1,
          3.75e1,
          3.75e1,
          3.75e1,
          3.74e1,
          3.74e1,
        ],
        CH4: [
          6.74e-3,
          7.46e-3,
          6.11e-3,
          8.95e-3,
          7.22e-3,
          7.26e-3,
          6.85e-3,
          7.39e-3,
          6.58e-3,
          7.81e-3,
          6.72e-3,
          7.23e-3,
          7.68e-3,
          8.76e-3,
          8.74e-3,
          8.71e-3,
          8.69e-3,
          8.68e-3,
          8.67e-3,
          8.67e-3,
          8.66e-3,
          8.66e-3,
          8.66e-3,
          8.65e-3,
          8.65e-3,
          8.65e-3,
          8.65e-3,
          8.64e-3,
          8.64e-3,
        ],
        N2O: [
          8.23e-4,
          9.11e-4,
          7.47e-4,
          1.09e-3,
          8.83e-4,
          8.87e-4,
          8.32e-4,
          8.97e-4,
          7.98e-4,
          9.48e-4,
          8.16e-4,
          8.78e-4,
          9.33e-4,
          1.06e-3,
          1.06e-3,
          1.06e-3,
          1.06e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
          1.05e-3,
        ],
      },
      efUnit: "kWh", // override emission factor unit to g/kWh
    },
    natGas: {
      id: "natGas",
      name: t("appConfig.energySources.energySources.natGas"),
      description: t("appConfig.energySources.energySources.natGasDesc"),
      absUnit: `GJ/${t('general.yearAbbr')}`,
      convUnit: "GJ",
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 50,
        CH4: 1e-3,
        N2O: 1e-3,
      },
    },
    renewableNatGas: {
      id: "renewableNatGas",
      name: t("appConfig.energySources.energySources.renewableNatGas"),
      description: t("appConfig.energySources.energySources.renewableNatGasDesc"),
      absUnit: `GJ/${t('general.yearAbbr')}`,
      convUnit: "GJ",
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 0,
        CH4: 0,
        N2O: 0,
      },
    },
    hydrogen: {
      id: "hydrogen",
      name: t("appConfig.energySources.energySources.hydrogen"),
      description: t("appConfig.energySources.energySources.hydrogenDesc"),
      absUnit: `GJ/${t('general.yearAbbr')}`,
      convUnit: "GJ",
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 0,
        CH4: 0,
        N2O: 0,
      },
    },
    gasoline: {
      id: "gasoline",
      name: t("appConfig.energySources.energySources.gasoline"),
      description: t("appConfig.energySources.energySources.gasolineDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "Lgasoline",
      convVal: 35e6,
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 66,
        CH4: 3e-3,
        N2O: 6e-4,
      },
    },
    diesel: {
      id: "diesel",
      name: t("appConfig.energySources.energySources.diesel"),
      description: t("appConfig.energySources.energySources.dieselDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "Ldiesel",
      convVal: 38.3e6,
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 69,
        CH4: 2.5e-3,
        N2O: 5e-4,
      },
    },
    ethanol: {
      id: "ethanol",
      name: t("appConfig.energySources.energySources.ethanol"),
      description: t("appConfig.energySources.energySources.ethanolDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "Lethanol",
      convVal: 24e6,
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 63,
        CH4: 3e-3,
        N2O: 6e-4,
      },
    },
    biodiesel: {
      id: "biodiesel",
      name: t("appConfig.energySources.energySources.biodiesel"),
      description: t("appConfig.energySources.energySources.biodieselDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "Lbiodiesel",
      convVal: 35.24e6,
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 75,
        CH4: 2.5e-3,
        N2O: 5e-4,
      },
    },
    lightFuelOil: {
      id: "lightFuelOil",
      name: t("appConfig.energySources.energySources.lightFuelOil"),
      description: t("appConfig.energySources.energySources.lightFuelOilDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "LlightFuelOil",
      convVal: 37.57e6, // based on conversion to L derived from https://www.convertunits.com/from/gallon+[U.S.]+of+kerosene/to/megajoule
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 73,
        CH4: 1.7e-5,
        N2O: 5e-4,
      },
    },
    propane: {
      id: "propane",
      name: t("appConfig.energySources.energySources.propane"),
      description: t("appConfig.energySources.energySources.propaneDesc"),
      absUnit: `kg/${t('general.yearAbbr')}`,
      convUnit: "kgpropane",
      convVal: 50.359e6, // based on conversion at https://www2.gov.bc.ca/assets/gov/taxes/sales-taxes/publications/conversion-factors-by-fuel.pdf
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 60,
        CH4: 2.5e-2,
        N2O: 1e-3,
      },
    },
    heatingOil: {
      id: "heatingOil",
      name: t("appConfig.energySources.energySources.heatingOil"),
      description: t("appConfig.energySources.energySources.heatingOilDesc"),
      absUnit: `L/${t('general.yearAbbr')}`,
      convUnit: "LheatingOil",
      convVal: 37e6, // todo need to update this value
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 85,
        CH4: 3e-3,
        N2O: 1.7e-3,
      },
    },
    woodWaste: {
      id: "woodWaste",
      name: t("appConfig.energySources.energySources.woodWaste"),
      description: t("appConfig.energySources.energySources.woodWasteDesc"),
      absUnit: `MJ/${t('general.yearAbbr')}`,
      convUnit: "MJ",
      references: [
        [
          t("appConfig.energySources.references.eccNIR2018"),
          "https://publications.gc.ca/site/eng/9.506002/publication.html",
        ],
      ],
      emissionsFactors: {
        CO2: 300,
        CH4: 7e-1,
        N2O: 7e-3,
      },
    },
  };

  const _sectorEnergySources = {
    buildings: [
      "grid",
      "natGas",
      "renewableNatGas",
      "hydrogen",
      "propane",
      "heatingOil",
      "woodWaste",
    ],
    transportation: [
      "grid",
      "hydrogen",
      "gasoline",
      "diesel",
      "propane",
      "biodiesel",
      "natGas",
    ],
  };

  // merge _energySources with province and region-specific data if activeproject is set with a region
  let energySources = { ..._energySources };
  let sectorEnergySources = { ..._sectorEnergySources };
  const provinces = regionsConfig().provinces;
  const provId = useScenarioStore().getProvId;

  // check for local energy sources in province
  if (provId !== null) {
    if ("energySources" in provinces[provId]) {
      // each energy source needs to be merged individually in case some of the provinces sources don't contain all of the keys - only the same source keys will be overridden
      Object.keys(provinces[provId].energySources).forEach((src) => {
        energySources[src] =
          src in energySources
            ? {
                ...energySources[src],
                ...provinces[provId].energySources[src],
              }
            : provinces[provId].energySources[src];
      });
    }
    if ("xSectorEnergySources" in provinces[provId]) {
      Object.keys(sectorEnergySources).forEach((sect) => {
        sectorEnergySources[sect] =
          sect in provinces[provId].xSectorEnergySources
            ? [
                ...sectorEnergySources[sect],
                ...provinces[provId].xSectorEnergySources[sect],
              ]
            : sectorEnergySources[sect];
      });
    }
  }

  // the first year of any array of EF values. This is used for translating array positions to specific years when an EF has an array of values for different years.
  const efStartYear = appConfig().startYear;
  //  the last year of EF values
  const efEndYear = appConfig().endYear;

  /**
   * gets an array of energySources, optionally filtered to a list of ids
   * @param {[String]} filterIds - an array of energySource id's (strings) to filter the list to
   * @returns an array of energySource objects
   */
  const getEnergySourcesAsArray = (filterIds = null) => {
    // filter out any keys that don't exist in energySources (some keys may only be valid in some locales)
    const _filterIds =
      filterIds !== null ? filterIds.filter((id) => id in energySources) : null;
    return genericUtils().getObjectKeysAsArray(energySources, _filterIds);
  };

  /**
   * gets an array of energySources for a sector based on sectorId
   * @param {string} sectorId - the sectorID from sectorEnergySources
   * @returns an array of energySource objects
   */
  const getEnergySourcesForSector = (sectorId) => {
    return getEnergySourcesAsArray(sectorEnergySources[sectorId]);
  };

  /**
   * gets emissions factor for a specific energy source, gas type and year
   * If energy source has EFs that vary with time, the emissions factor for the specific year will be returned
   * If array length for EF is shorter than the full time span from efStartYear to efEndYear, the last index will be repeated for subsequent years
   * @param {String} id - the fuel source id
   * @param {String} gas - the GHG gas type (CO2, N2O or CH4)
   * @param {year} year - the year to lookup - must be between efStartYear and efEndYear
   * @returns emissions factor as a float
   */
  const getEFForSourceByIdGasYear = (id, gas, year) => {
    let val = 0;
    if (Array.isArray(energySources[id].emissionsFactors[gas])) {
      const yearIndex = year - efStartYear;
      // array
      // get EF for year - if year is not in the source config, take the last available number
      const yearsIndexLength =
        energySources[id].emissionsFactors[gas].length - 1;
      val =
        yearIndex <= yearsIndexLength
          ? energySources[id].emissionsFactors[gas][yearIndex]
          : energySources[id].emissionsFactors[gas][yearsIndexLength];
    } else {
      // not an array - just grab the number
      val = energySources[id].emissionsFactors[gas];
    }
    if ("efUnit" in energySources[id] && energySources[id].efUnit !== "MJ") {
      // apply conversion for efUnits
      val = val / convert(1).from(energySources[id].efUnit).to("MJ");
    }
    return val;
  };

  const gwp = {
    name: "SSG_2021",
    references: [
      [
        t("appConfig.energySources.references.eccNIR2018"),
        "https://publications.gc.ca/site/eng/9.506002/publication.html",
      ],
    ],
    values: {
      CH4: 25,
      N2O: 298,
    },
  };

  /**
   * gets the collection of all energy sources used either in buildigns or transportation in a scenario
   * @param {Object} scenario - scenario object
   * @returns an Object containing energy source objects for all energy sources used either in buildigns or transportation in a scenario
   */
  const getAllEnergySourcesForScenario = (scenario) => {
    const scenarioEnergySources = {};
    ["buildings", "transportation"].forEach((sector) => {
      Object.keys(scenario[sector]).forEach((subsector) => {
        if ("energySources" in scenario[sector][subsector]) {
          Object.keys(scenario[sector][subsector].energySources).forEach(
            (src) => {
              if (!(src in scenarioEnergySources)) {
                scenarioEnergySources[src] = (({
                  emissionsFactors,
                  references,
                  efUnit,
                }) => ({ emissionsFactors, references, efUnit }))(
                  scenario[sector][subsector].energySources[src]
                );
                scenarioEnergySources[src].name = energySources[src].name;
              }
            }
          );
        }
      });
    });
    return scenarioEnergySources;
  };

  return {
    energySources,
    efStartYear,
    efEndYear,
    getEnergySourcesForSector,
    getEnergySourcesAsArray,
    gwp,
    getEFForSourceByIdGasYear,
    getAllEnergySourcesForScenario,
  };
}
