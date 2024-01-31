/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * utilities for calculating ghgs and stuff
 */
import configureMeasurements from "convert-units"; // using version 3.0.0-beta from https://github.com/convert-units/convert-units
import energy from "convert-units/definitions/energy"; // using version 3.0.0-beta from https://github.com/convert-units/convert-units
import area from "convert-units/definitions/area"; // using version 3.0.0-beta from https://github.com/convert-units/convert-units
import length from "convert-units/definitions/length"; // using version 3.0.0-beta from https://github.com/convert-units/convert-units
import energySourcesConfig from "@/config/energySources.js";
import transportationConfig from "@/config/transportation";

export default function useCalculatorUtils() {
  /**
   * calculate sum of energy source absolute values into a total to update inputExistingEnergy with
   * @param {Object} energySources - Object containing keys for each energy source along with nested object of {units, value} coming from EnergySourceList component
   * @param {*} units - units to output energy in
   * @returns energy sum as a float
   */
  const sumEnergyFromSources = (energySources, units) => {
    let energySum = 0;
    Object.keys(energySources).forEach((src) => {
      const _src = energySources[src];
      // convert to existingEnergyUnits as needed
      const srcVal = convert(_src.value)
        .from(energySourcesConfig().energySources[src].convUnit)
        .to(stripUnitsYr(units));
      energySum += parseFloat(srcVal);
    });
    return energySum;
  };

  /**
   * computes the sum of all energyuse from a collection of building types
   * @param {Object} buildings - buildings object from inside a scenario object
   * @returns sum of all energyUse of all buildings types
   */
  const sumEnergyFromObjCollection = (obj) => {
    let energySum = 0;
    Object.keys(obj).forEach((objType) => {
      energySum += obj[objType].energyUse;
    });
    return energySum;
  };

  /**
   * computes the sum of all emissions (totals only) from a collection of building types
   * does not compute sums by different gas types
   * @param {Object} buildings - buildings object from inside a scenario object
   * @returns sum of all energyUse of all buildings types
   */
  const sumEmissionsFromObjCollection = (obj) => {
    let emissionsSum = 0;
    Object.keys(obj).forEach((objType) => {
      emissionsSum += obj[objType].emissions.total;
    });
    return emissionsSum;
  };

  /**
   * calculates the sum of all energy use from buildings and transportation combined for a scenario
   * @param {Object} scenario - scenario object
   * @returns all energy use from buildings and transportation combined
   */
  const sumEnergyForScenario = (scenario) => {
    return sumEnergyFromObjCollection(scenario.buildings) + sumEnergyFromObjCollection(scenario.transportation);
  };

  /**
   * calculates the sum of all emissions from buildings and transportation combined for a scenario
   * @param {Object} scenario - scenario object
   * @returns all emissions from buildings and transportation combined
   */
  const sumEmissionsForScenario = (scenario) => {
    return sumEmissionsFromObjCollection(scenario.buildings) + sumEmissionsFromObjCollection(scenario.transportation);
  };

  /**
   * computes the sum of all costs from an object type (infrastructure or services) for either maintenance or capital cost
   * does not compute sums by different gas types
   * @param {Object} obj -  object from inside a scenario object (example, services or infrastructure)
   * @param {String} key - the key for the type of cost to return
   * @returns sum of all costs for that cost type and object type
   */
  const sumCostsForObj = (scenario, obj, key) => {
    let costSum = 0;
    Object.keys(scenario[obj]).forEach((objType) => {
      costSum += scenario[obj][objType][key];
    });
    return costSum;
  };

  /**
   * cmoputes the sum of revenue for a specific revenue type (development charges or taxes) for a specific scenario
   * @param {Object} scenario - scenario object
   * @param {String} revenueObjType - key in scenario object that references the specific revenue sub-object
   * @returns a sum of revenue for the specified object type
   */
  const sumRevenueForObj = (scenario, obj, key) => {
    const revenueObj = scenario[obj][key];
    let revenueSum = 0;
    Object.keys(revenueObj).forEach((item) => {
      revenueSum += revenueObj[item].perUnit * scenario.buildings[item].qty;
    });
    return revenueSum;
  };

  /**
   * calculates ghg's produced by an energy source based on consumption and emissions factors for a specific year
   * @param {string} sourceId - the id for the energysource to match up with energySourcesConfig().energySources keys
   * @param {integer} year - the year to calculate on
   * @param {number} srcEnergy - the amount of energy in kWh to calculate GHGs for
   * @param {object} ghgs - the ghgs object to save data in
   * @returns object with ghg calculations for each gas type as well as a total value
   */
  const computeGHGsFromSourceForYear = (sourceId, year, srcEnergy, ghgs) => {
    // make sure year is an integer
    year = parseInt(year);

    const source = energySourcesConfig().energySources[sourceId];
    // init total value
    let total = "total" in ghgs ? ghgs.total : 0;
    Object.keys(source.emissionsFactors).forEach((gas) => {
      if (!(gas in ghgs)) {
        // init gas value if it is not yet in the ghgs object
        ghgs[gas] = 0;
      }
      let gasGhgs = 0;
      gasGhgs =
        energySourcesConfig().getEFForSourceByIdGasYear(sourceId, gas, year) *
        srcEnergy;
      // apply GWP
      if (gas !== "CO2") {
        gasGhgs = gasGhgs * energySourcesConfig().gwp.values[gas];
      }
      // convert from gCO2e to tCO2e
      gasGhgs = gasGhgs / 1e6;
      ghgs[gas] += gasGhgs;
      total += gasGhgs;
    });
    ghgs.total = total;
  };

  /**
   * compute ghgs for all years from single source
   * @param {String} sourceId - the id of teh fuel source
   * @param {Number} year - the year to compute
   * @param {Number} srcEnergy - the amount of energy being consumed
   */
  const computeGHGsFromSource = (sourceId, year, srcEnergy) => {
    /**
     * GHGS RETURNED EITHER AN OBJECT OR AN ARRAY OF OBJECTS
     * ghgs is an object if the values constant over time (emissions factors don't ever change)
     *
     * EXAMPLE SINGLE YEAR OBJECT:
     * ghgDelta: {
     *    CH4: [1,2,3],
     *    CO2: [1,2,3],
     *    N2O: [1,2,3],
     *    total: [1,2,3],
     *  }
     *
     * EXAMPLE ARRAY OF YEARS:
     * ghgDelta: [
     *  {
     *    CH4: [1,2,3],
     *    CO2: [1,2,3],
     *    N2O: [1,2,3],
     *    total: [1,2,3],
     *  },
     *  {
     *    CH4: [1,2,3],
     *    CO2: [1,2,3],
     *    N2O: [1,2,3],
     *    total: [1,2,3],
     *  },
     * ]
     */

    // make sure year is an integer
    year = parseInt(year);

    // check if source has emissions factors that vary over time
    let ghgs = null;
    const source = energySourcesConfig().energySources[sourceId];
    const timeVariance = Array.isArray(source.emissionsFactors.CO2)
      ? true
      : false;
    if (timeVariance) {
      // calculate for all action years
      ghgs = [];
      let _year = year;
      let _ghgs = null;
      while (_year <= energySourcesConfig().efEndYear) {
        _ghgs = {};
        computeGHGsFromSourceForYear(sourceId, _year, srcEnergy, _ghgs);
        ghgs.push(_ghgs);
        _year += 1;
      }
    } else {
      // only compute ghgs for single year --- no variance
      const _ghgs = {};
      computeGHGsFromSourceForYear(sourceId, year, srcEnergy, _ghgs);
      ghgs = _ghgs;
    }
    return ghgs;
  };

  /**
   * compute ghgs for a list of sources
   * @param {object} sourcesList - object with list of sources as keys, and associated energy consumption values
   * @param {integer} year - the year to calculate for
   * @param {string} sourceListMode - the calculation mode that the sourceList is saved in. One of ['abs', 'percent']
   * @param {number} energyExisting - the total amount of existing nergy being computed. For target/reductions, this will be multiplied by the energyFactor
   * @param {number} energyFactor - the amount to mutliply the energy by. Default is null. Ignored if null.
   * @returns an array of objects with ghg calculations by gas type for each year of projected energy use. If all years are identical, only 1 object is returned (array length = 1)
   */
  const computeGhGsFromSourcesList = (
    sourcesList,
    year,
    sourceListMode,
    energyExisting,
    energyFactor = null
  ) => {
    // make sure year is an integer
    year = parseInt(year);

    // check if any source has emissions factors that vary over time
    let timeVariance = false;
    // todo time variance is turned off... uncomment below to turn it on if you want to track emissions over time for a scenario
    // Object.keys(sourcesList).every((src) => {
    //   const source = energySourcesConfig().energySources[src];
    //   if (Array.isArray(source.emissionsFactors.CO2)) {
    //     timeVariance = true;
    //     return false; // break from the every loop
    //   }
    //   return true; // continue looking
    // });

    const computeSources = (_year) => {
      const _ghgs = {};
      Object.keys(sourcesList).forEach((src) => {
        // if values are percent, convert to abs
        // converted abs values will be in same units as energyExisting which should be kWh
        let srcEnergy = 0;
        if (sourceListMode === "abs") {
          // sourceList is abs... convert all values to MJ/yr
          let fromUnits = stripUnitsYr(sourcesList[src].units);
          // check if unit is acceptable
          if (!convert().possibilities().includes(fromUnits)) {
            // if it's not a possibility, try appending src to it... example L becomes LnatGas or kg becomes kgpropane... should match up with list in volumeToEnergy
            fromUnits = `${fromUnits}${src}`;
          }
          srcEnergy = convert(sourcesList[src].value).from(fromUnits).to("MJ");
        } else {
          // sourceList is in percent
          srcEnergy = (sourcesList[src].value / 100) * energyExisting;
        }
        if (energyFactor !== null) {
          srcEnergy *= energyFactor;
        }
        computeGHGsFromSourceForYear(src, _year, srcEnergy, _ghgs);
      });
      return _ghgs;
    };

    let ghgs = null;
    if (timeVariance) {
      // calculate for all action years
      ghgs = [];
      let _year = year;
      while (_year <= energySourcesConfig().efEndYear) {
        ghgs.push(computeSources(_year));
        _year += 1;
      }
    } else {
      // only compute ghgs for single year --- no variance
      ghgs = computeSources(year);
    }
    return ghgs;
  };

  /**
   *
   * @param {object} sourcesList - object with list of sources as keys, and associated energy consumption values
   * @param {string} transportationType - the transportation type to compute energy for
   * @param {number} vkt - the kilometers travelled
   */
  const computeTransportEnergyFromSourcesList = (
    sourcesList,
    transportationType,
    vkt
  ) => {
    let srcEnergy = 0;
    Object.keys(sourcesList).forEach((src) => {
      // todo - this is working for PERCENT ONLY. To use abs values this function needs to be expanded
      srcEnergy +=
        (sourcesList[src].value / 100) *
        transportationConfig().transportationTypes[transportationType]
          .fuelConsumption[src] *
        (vkt / 100); // energy values are MJ/100km
    });
    return srcEnergy;
  };

  // UNITS CONVERSION HELPERS
  // define list of custom conversions for converting energy sources by volume to energy units
  /**
   * constructs a single custom conversion definition to add to the conver-units config
   * @param {Object} src - a single energySource object from energySourcesConfig().energySources key values
   */
  const buildConversionDef = (src) => {
    return {
      name: {
        singular: src.convUnit,
        plural: src.convUnit,
      },
      to_anchor: src.convVal,
    };
  };

  // provides a conversion dictionary of volume to energy units for use with convert-units
  const volumeToEnergy = energySourcesConfig()
    .getEnergySourcesAsArray()
    .filter((src) => "convVal" in src)
    .reduce(
      (units, src) => (
        (units.systems.SI[src.convUnit] = buildConversionDef(src)), units
      ),
      {
        ...energy,
      }
    );

  // the convert function to make available for converting
  const convert = configureMeasurements({
    volumeToEnergy,
    energy,
    area,
    length,
  });

  // strip "/yr" from units
  const stripUnitsYr = (units) => {
    return units.replace("/yr", "").replace("/an", "");
  };

  const stripUnits = (units, strip_units) => {
    return units.replace(strip_units, "");
  };

  // doesn't look like the conver() function takes in inverse relationships (?) use this for now
  const convertMPGtoLP100km = (MPG) => {
    return 235.22 / MPG;
  };

  return {
    sumEnergyFromSources,
    sumEnergyFromObjCollection,
    sumEmissionsFromObjCollection,
    sumEnergyForScenario,
    sumEmissionsForScenario,
    sumCostsForObj,
    sumRevenueForObj,
    computeGHGsFromSource,
    computeGhGsFromSourcesList,
    computeTransportEnergyFromSourcesList,
    convert,
    convertMPGtoLP100km,
    stripUnitsYr,
    stripUnits,
  };
}
