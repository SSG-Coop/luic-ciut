/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * excel helper utilities for populating and formatting ranges/cells specifically for scenarios, scenario summaries
 */
import i18n from "@/plugins/i18n";
import genericUtils from "@/utils/genericUtils";
import energySourcesConfig from "@/config/energySources";
import {
  formatRange,
  getDynamicRange,
  JSDateToExcelDate,
  endCol,
} from "@/utils/excelGenericUtils.js";
import { useExcelStore } from "@/store/excel.js";

const t = i18n.global.t;

/** *******************************************
 * WORKSHEET POPULATING & FORMATTING HELPER FUNCTIONS
 * generalized functions to help in populating and formatting scenario worksheets
 * *******************************************
 */
const columnWidths = {
  scenario: [
    {
      col: "A:B",
      width: 150,
    },
    {
      col: "C:D",
      width: 220,
    },
    {
      col: "E:AK",
      width: 100,
    },
  ],
  summaryTable: [
    {
      col: "A:A",
      width: 150,
    },
    {
      col: "B:B",
      width: 250,
    },
    {
      col: "C:AA",
      width: 150,
    },
  ],
  summaryCharts: [
    {
      col: "A:AA",
      width: 150,
    },
  ],
};

const defaultChartDataRanges = {
  // the scenario names
  scnNameSource: {
    rangeStart: "",
  },
  /**
   * all other ranges have 4 variants:
   * {name}ChartCopy,
   * {name}PerHHChartCopy
   * {name}Source,
   * {name}PerHHSource,
   *
   * Source type definitions include the rangeStart (the start cell), the chart title, and the chart units
   * ChartCopy range definitions contain only the range of the chart data stored in the chartData worksheet
   */
  bikeChartCopy: {
    range: "", // range where data is located
  },
  bikePerHHChartCopy: {
    range: "", // range where data is located
  },
  bikeSource: {
    rangeStart: "", // cell where range starts on the source worksheet (scenario summaries worksheet)
    title: t("forms.fields.bikeKT"), // the chart title
    units: "AKT", // the units for the chart
  },
  bikePerHHSource: {
    rangeStart: "",
    title: `${t("forms.fields.bikeKT")} ${t("scenario.perDwelling")}`, // the chart title
    units: `AKT/${t("general.dwelling")}`, // the units for the chart
  },
  devChrgChartCopy: {
    range: "",
  },
  devChrgPerHHChartCopy: {
    range: "",
  },
  devChrgSource: {
    rangeStart: "",
    title: t("appConfig.revenue.revenueTypes.developmentCharges"),
    units: "$",
  },
  devChrgPerHHSource: {
    rangeStart: "",
    title: `${t("appConfig.revenue.revenueTypes.developmentCharges")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  emissionsChartCopy: {
    range: "",
  },
  emissionsPerHHChartCopy: {
    range: "",
  },
  emissionsSource: {
    rangeStart: "",
    title: t("scenario.emissions"),
    units: `tCO2e/${t("general.yearAbbr")}`,
  },
  emissionsPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.emissions")} ${t("scenario.perDwelling")}`,
    units: `tCO2e/${t("general.yearAbbr")}/${t("general.dwelling")}`,
  },
  energyChartCopy: {
    range: "",
  },
  energyPerHHChartCopy: {
    range: "",
  },
  energySource: {
    rangeStart: "",
    title: t("scenario.energyUse"),
    units: `GJ/${t("general.yearAbbr")}`,
  },
  energyPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.energyUse")} ${t("scenario.perDwelling")}`,
    units: `GJ/${t("general.yearAbbr")}/${t("general.dwelling")}`,
  },
  infCapCostChartCopy: {
    range: "",
  },
  infCapCostPerHHChartCopy: {
    range: "",
  },
  infCapCostSource: {
    rangeStart: "",
    title: t("scenario.modules.infrastructureCapCost"),
    units: "$",
  },
  infCapCostPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.modules.infrastructureCapCost")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  infOMCostChartCopy: {
    range: "",
  },
  infOMCostPerHHChartCopy: {
    range: "",
  },
  infOMCostSource: {
    rangeStart: "",
    title: t("scenario.modules.infrastructureOMCost"),
    units: "$",
  },
  infOMCostPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.modules.infrastructureOMCost")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  puvChartCopy: {
    range: "",
  },
  puvPerHHChartCopy: {
    range: "",
  },
  puvSource: {
    rangeStart: "",
    title: t("forms.fields.puvVKT"),
    units: "VKT",
  },
  puvPerHHSource: {
    rangeStart: "",
    title: `${t("forms.fields.puvVKT")} ${t("scenario.perDwelling")}`,
    units: `VKT/${t("general.dwelling")}`,
  },
  serviceCapCostChartCopy: {
    range: "",
  },
  serviceCapCostPerHHChartCopy: {
    range: "",
  },
  serviceCapCostSource: {
    rangeStart: "",
    title: t("scenario.modules.servicesCapCost"),
    units: "$",
  },
  serviceCapCostPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.modules.servicesCapCost")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  serviceOMCostChartCopy: {
    range: "",
  },
  serviceOMCostPerHHChartCopy: {
    range: "",
  },
  serviceOMCostSource: {
    rangeStart: "",
    title: t("scenario.modules.servicesOMCost"),
    units: "$",
  },
  serviceOMCostPerHHSource: {
    rangeStart: "",
    title: `${t("scenario.modules.servicesOMCost")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  taxesChartCopy: {
    range: "",
  },
  taxesPerHHChartCopy: {
    range: "",
  },
  taxesSource: {
    rangeStart: "",
    title: t("appConfig.revenue.revenueTypes.municipalRevTaxes"),
    units: "$",
  },
  taxesPerHHSource: {
    rangeStart: "",
    title: `${t("appConfig.revenue.revenueTypes.municipalRevTaxes")} ${t(
      "scenario.perDwelling"
    )}`,
    units: `$/${t("general.dwelling")}`,
  },
  transitChartCopy: {
    range: "",
  },
  transitPerHHChartCopy: {
    range: "",
  },
  transitSource: {
    rangeStart: "",
    title: t("forms.fields.transitVKT"),
    units: "VKT",
  },
  transitPerHHSource: {
    rangeStart: "",
    title: `${t("forms.fields.transitVKT")} ${t("scenario.perDwelling")}`,
    units: `VKT/${t("general.dwelling")}`,
  },
  walkChartCopy: {
    range: "",
  },
  walkPerHHChartCopy: {
    range: "",
  },
  walkSource: {
    rangeStart: "",
    title: t("forms.fields.walkKT"),
    units: "AKT",
  },
  walkPerHHSource: {
    rangeStart: "",
    title: `${t("forms.fields.walkKT")} ${t("scenario.perDwelling")}`,
    units: `AKT/${t("general.dwelling")}`,
  },
};

/**
 * initializes the excel store chartDataRanges object
 * it needs to be initialized when used rather than defined in the store to allow for language selection changes that may occur after store has been initialized
 */
const initChartDataRanges = () => {
  useExcelStore().$patch((state) => {
    state.chartDataRanges = { ...defaultChartDataRanges };
  });
};

/**
 * sets the column widths for a worksheet
 * used in conjunction with the columnWidths constant defined above
 * @param {Worksheet} sheet - excel Worksheet object
 * @param {Object} widths - object containing settings for each column to have widths set
 */
const setColumnWidths = (sheet, widths) => {
  widths.forEach((col) => {
    const range = sheet.getRange(col.col);
    range.format.columnWidth = col.width;
  });
};

/**
 * default formatting for various rows and sections
 */
const cellHeadingFontFormat = { font: ["bold", "size-14", "#000000"] };
const cellHeadingFontWhiteFormat = { font: ["bold", "size-14", "#FFFFFF"] };
const cellSubheadingFontFormat = { font: ["bold", "size-12", "#000000"] };
const cellPlainFontFormat = { font: ["size-12", "#000000"] };
const cellFillWhiteFormat = { fill: "#FFFFFF" };
const cellNumberFormat2Dec = { numberFormat: "#,##0.00" };
const cellNumberFormat = { numberFormat: "#,##0" };
const cellNumberFormat3Dec = { numberFormat: "#,##0.000" };
const cellCurrencyFormat = { numberFormat: "$#,##0" };
const scenarioMergedCellFillFormat = { fill: "#efefef" };
const scenarioSummaryCellFillFormatPrimary = { fill: "#c9daf8" };
const scenarioMetaCellFillFormatPrimary = { fill: "#F9CB9C" };
const scenarioMetaCellFillFormatSecondary = { fill: "#E3F2FD" };
const scenarioBuildingsCellFillFormatPrimary = { fill: "#A2C4C9" };
const scenarioBuildingsCellFillFormatSecondary = { fill: "#d0e0e3" };
const scenarioServicesCellFillFormatPrimary = { fill: "#ffe599" };
const scenarioServicesCellFillFormatSecondary = { fill: "#fff2cc" };
const scenarioInfrastructureCellFillFormatPrimary = { fill: "#b6d7a8" };
const scenarioInfrastructureCellFillFormatSecondary = { fill: "#d9ead3" };
const scenarioTransportationCellFillFormatPrimary = { fill: "#9fc5e8" };
const scenarioTransportationCellFillFormatSecondary = { fill: "#d0e0e3" };
const scenarioRevenueCellFillFormatPrimary = { fill: "#ea9999" };
const scenarioRevenueCellFillFormatSecondary = { fill: "#f4cccc" };
const scenarioAssumptionsCellFillFormatPrimary = { fill: "#a4c2f4" };
const scenarioAssumptionsCellFillFormatSecondary = { fill: "#c9daf8" };
const scenarioEnergyUseCellFillFormatPrimary = { fill: "#434343" };
const scenarioEnergyUseCellFillFormatSecondary = { fill: "#efefef" };
const scenarioEmissionsCellFillFormatPrimary = { fill: "#000000" };
const scenarioEmissionsCellFillFormatSecondary = { fill: "#efefef" };

/**
 * creates a title bar and 2 sub-lines in the first 3 rows of a sheet
 * @param {Object} sheet - excel worksheet object
 * @param {String} title - title text
 * @param {Object} formatOptions - optional list of formatting for first line
 */
const setSheetTitleBar = (sheet, title, formatOptions = {}) => {
  const _formatOptions = {
    font: ["bold", "size-16", "#000000"],
    ...formatOptions,
  };

  let rangeAddress = "";
  let range = null;

  if (Array.isArray(title)) {
    // scenario sheet
    rangeAddress = "A1:A1";
    range = sheet.getRange(rangeAddress);
    range.values = title[0];
    let _borders = "None";
    formatRange(range, { ..._formatOptions, borders: _borders });

    // title
    rangeAddress = "B1:E1";
    range = sheet.getRange(rangeAddress);
    range.merge();
    range.values = title[1];
    _borders = "None";
    formatRange(range, { ..._formatOptions, borders: _borders });
  } else {
    rangeAddress = "A1:E1";
    range = sheet.getRange(rangeAddress);
    range.merge();
    range.values = title;
    let _borders = "None";
    formatRange(range, { ..._formatOptions, borders: _borders });
  }

  // subtitle
  setGeneratedBySubtitle(sheet, 2, 5);

  // date
  rangeAddress = "A3";
  range = sheet.getRange(rangeAddress);
  range.values = [[t("general.modified")]];
  formatRange(range, {
    font: ["size-9"],
    borders: "None",
  });
  rangeAddress = "B3";
  range = sheet.getRange(rangeAddress);
  const jsDate = new Date(Date.now());
  range.values = [[JSDateToExcelDate(jsDate)]];
  range.numberFormat = [["[$-1009]mmm dd, yyyy h:mm AM/PM;@"]];
  formatRange(range, {
    font: ["size-9"],
    borders: "None",
  });
};

/**
 * creates an "generated by ssg neighbourhood calculator.." subtitle and modified date rows
 * @param {Object} sheet - excel worksheet object
 * @param {Integer} startRow - the row to begin the subtitle on
 * @param {Integer} cols - how many columns wide to make the subtitle block
 */
const setGeneratedBySubtitle = (sheet, startRow, cols) => {
  const sheetSubtitle = `${t(
    "appInfo.worksheetAttribution"
  )} - https://luic-ciut.ssg.coop`;
  let rangeAddress = getDynamicRange(`A${startRow}`, 0, 1, cols);
  let range = sheet.getRange(rangeAddress);
  range.merge();
  range.values = sheetSubtitle;
  formatRange(range, {
    font: ["italic", "size-12"],
    borders: "None",
    ...scenarioMetaCellFillFormatSecondary,
  });
  let cell = range.getCell(0, 0);
  const hyperlink = {
    textToDisplay: sheetSubtitle,
    screenTip: sheetSubtitle,
    address: `https://luic-ciut.ssg.coop`,
  };
  cell.hyperlink = hyperlink;

  // date
  rangeAddress = getDynamicRange(`A${startRow + 1}`, 0, 1, 1);
  range = sheet.getRange(rangeAddress);
  range.values = [[t("general.modified")]];
  formatRange(range, {
    font: ["size-9"],
    borders: "None",
    ...cellFillWhiteFormat,
  });
  rangeAddress = getDynamicRange(`B${startRow + 1}`, 0, 1, 1);
  range = sheet.getRange(rangeAddress);
  const jsDate = new Date(Date.now());
  range.values = [[JSDateToExcelDate(jsDate)]];
  range.numberFormat = [["[$-1009]mmm dd, yyyy h:mm AM/PM;@"]];
  formatRange(range, {
    font: ["size-9"],
    borders: "None",
    ...cellFillWhiteFormat,
    horizontalAlignment: "Left",
  });
};

/**
 * populates a range in the worksheet with provided values and applies provided formatting
 * @param {Worksheet} sheet - excel Worksheet object
 * @param {Array} rangeVals - list of values to populate in the range
 * @param {String} startCol - the column for the start of the range (example: "A")
 * @param {Integer} startRow - the row number for the start of the range
 * @param {Object} labelFormat - formatting options for the label (first cell in the range)
 * @param {Object} rowFormat - formatting options for the range
 */
const populateRange = (
  sheet,
  rangeVals,
  startCol,
  startRow,
  labelFormat = cellSubheadingFontFormat,
  rowFormat = null
) => {
  let rangeAddress = getDynamicRange(
    `${startCol}${startRow}`,
    0,
    1,
    rangeVals.length
  );
  let range = sheet.getRange(rangeAddress);
  const vals = [];
  rangeVals.forEach((val) => {
    vals.push(val);
  });
  range.values = [vals];
  // format row
  if (rowFormat !== null) {
    formatRange(range, rowFormat);
  }
  // format the first cell as the label (bold)
  rangeAddress = `${startCol}${startRow}`;
  range = sheet.getRange(rangeAddress);
  formatRange(range, labelFormat);
};

const populateScenariosSummaryRow = (
  sheet,
  rowLabel,
  scenarios,
  key,
  startCol,
  startRow,
  rowFormat = cellPlainFontFormat,
  defaultKeyVal = 0,
  sumFn = null,
  perHousehold = false
) => {
  let rangeVals = [];
  if (sumFn !== null) {
    const lastDelimiterIndex = key.lastIndexOf(".");
    if (perHousehold) {
      rangeVals = [
        rowLabel,
        ...scenarios.map(
          (scenario) =>
            sumFn(
              scenario,
              key.substring(0, lastDelimiterIndex),
              key.substring(lastDelimiterIndex + 1)
            ) / scenario.totalHomes
        ),
      ];
    } else {
      rangeVals = [
        rowLabel,
        ...scenarios.map((scenario) =>
          sumFn(
            scenario,
            key.substring(0, lastDelimiterIndex),
            key.substring(lastDelimiterIndex + 1)
          )
        ),
      ];
    }
  } else {
    if (key === "neighbourhoodType") {
      // get the translated lang value
      rangeVals = [
        rowLabel,
        ...scenarios.map((scenario) =>
          t(
            `appConfig.neighbourhoods.neighbourhoodTypes.${genericUtils().resolveObjPath(
              scenario,
              key,
              defaultKeyVal
            )}`
          )
        ),
      ];
    } else {
      rangeVals = [
        rowLabel,
        ...scenarios.map((scenario) =>
          genericUtils().resolveObjPath(scenario, key, defaultKeyVal)
        ),
      ];
    }
  }
  populateRange(sheet, rangeVals, startCol, startRow);
  const range = sheet.getRange(
    `${startCol}${startRow}:${endCol(startCol, rangeVals.length)}${startRow}`
  );
  formatRange(range, rowFormat);
  return 1; // populated 1 row
};

/**
 * populates a sector costs section in a worksheet for either Services or Infrastructure
 * data is populated for Capital Costs and Maintenance Costs
 * @param {String} sectorKey - either services or infrastructure
 * @param {Worksheet} sheet - excel Worksheet object
 * @param {String} sectorTitle - the title of the sector to map ('Services' or 'Infrastructure')
 * @param {String} sectorTypeTitle - the title to display on headings for the list of sub-types (IE 'Service' or 'Infrastructure')
 * @param {Object} scenarioSectorObj - the sector child object from within the larger scenario object
 * @param {Array} headingFormats - an array of 2 heading format objects to use in the main heading and the sub-headings
 * @param {Object} configObj - the config object containing names, descriptions, defaults etc (from serviceTypes or infrastructureTypes)
 * @param {Integer} currRow - the current row being manipulated in the worksheet
 */
const populateScenarioSectorCosts = (
  sectorKey,
  sheet,
  sectorTitle,
  sectorTypeTitle,
  scenarioSectorObj,
  headingFormats,
  configObj,
  currRow
) => {
  const intensityUnits =
    sectorKey === "services" ? t("general.dwelling", 1) : "m";
  // title
  populateRange(sheet, [sectorTitle], "A", currRow, cellHeadingFontFormat);
  let range = sheet.getRange(`A${currRow}:E${currRow}`);
  formatRange(range, headingFormats[0]);
  currRow += 1;

  // inputs and outputs
  ["CostIntensity", "Cost"].forEach((variableType) => {
    // track some cells for calculation
    const valsStart = currRow;
    // length/qty section for infrastructure
    if (variableType === "CostIntensity" && sectorKey === "infrastructure") {
      populateRange(
        sheet,
        [sectorTypeTitle, `${t("forms.fields.length", 2)} (m)`, ""],
        "B",
        currRow
      );
      range = sheet.getRange(`B${currRow}:E${currRow}`);
      formatRange(range, {
        ...cellHeadingFontFormat,
        ...headingFormats[1],
      });
      // cell alignment for values titles
      range = sheet.getRange(`C${currRow}:E${currRow}`)
      formatRange(range, {
        horizontalAlignment: "Right"
      });
      currRow += 1;
      // values
      const scenarioObjDataQty = Object.keys(scenarioSectorObj).map((_type) => {
        return [configObj[_type].name, scenarioSectorObj[_type].qty, ""];
      });
      scenarioObjDataQty.forEach((_range, index) => {
        populateRange(
          sheet,
          _range,
          "B",
          currRow + index,
          cellSubheadingFontFormat,
          cellNumberFormat
        );
      });
      // increment currRow
      currRow += scenarioObjDataQty.length + 1;
    }
    // cost headings
    const units =
      variableType === "Cost" ? t("general.total") : `$/${intensityUnits}`;
    populateRange(
      sheet,
      [
        sectorTypeTitle,
        `${t("forms.fields.capitalCost", 2)} (${units})`,
        `${t("forms.fields.maintCost", 2)} (${units}/${t("general.yearAbbr")})`,
      ],
      "B",
      currRow
    );
    range = sheet.getRange(`B${currRow}:E${currRow}`);
    formatRange(range, {
      ...cellHeadingFontFormat,
      ...headingFormats[1],
    });
    // cell alignment for values titles
    range = sheet.getRange(`C${currRow}:E${currRow}`)
    formatRange(range, {
      horizontalAlignment: "Right"
    });
    currRow += 1;
    // values
    const scenarioObjData = Object.keys(scenarioSectorObj).map((_type) => {
      return [
        configObj[_type].name,
        scenarioSectorObj[_type][`cap${variableType}`],
        scenarioSectorObj[_type][`maint${variableType}`],
      ];
    });
    scenarioObjData.forEach((_range, index) => {
      populateRange(sheet, _range, "B", currRow + index);
    });
    // totals
    if (variableType === "Cost") {
      populateRange(
        sheet,
        [
          t("general.total"),
          `=sum(C${currRow}:C${currRow + scenarioObjData.length - 1})`,
          `=sum(D${currRow}:D${currRow + scenarioObjData.length - 1})`,
        ],
        "B",
        currRow + scenarioObjData.length
      );
      // format totals
      range = sheet.getRange(
        `C${currRow + scenarioObjData.length}:D${
          currRow + scenarioObjData.length
        }`
      );
      formatRange(range, cellSubheadingFontFormat);
    }
    // currency number formatting
    range = sheet.getRange(`C${currRow}:D${currRow + scenarioObjData.length}`);
    range.numberFormat = [["$#,##0"]];
    // increment currRow
    currRow += scenarioObjData.length + 1;

    const valsEnd = variableType === "Cost" ? currRow - 1 : currRow - 2;
    const valsLabel =
      variableType === "Cost"
        ? t("scenario.outputs")
        : t("scenario.inputsDefaults");
    // inputs/defauts merged cell title
    populateRange(sheet, [valsLabel], "A", valsStart);
    range = sheet.getRange(`A${valsStart}:A${valsEnd}`);
    formatRange(range, scenarioMergedCellFillFormat);
    range.merge();
    formatRange(range, { verticalAlignment: "Center" });
  });

  const numSections = sectorKey === "infrastructure" ? 3 : 2;
  const newRows =
    numSections * (Object.keys(configObj).length + 1) + numSections + 1;
  return newRows;
};

/**
 * add a section of sector references to the worksheet
 * @param {Worksheet} sheet - Excel worksheet object
 * @param {String} title - the title to add to this section of references
 * @param {Array} references - list of references to add
 * @param {Integer} currRow - the current row being manipulated in excel
 * @returns {Integer} - returns how many rows were added to the sheet
 */
const populateSectorReferences = (sheet, title, references, currRow) => {
  let newRows = 0; // count how many new rows are being added
  // title
  populateRange(sheet, [title], "A", currRow, cellHeadingFontFormat);
  let range = sheet.getRange(`A${currRow}:E${currRow}`);
  formatRange(range, scenarioAssumptionsCellFillFormatSecondary);
  currRow += 1;
  newRows += 1;

  // populate references
  newRows += populateReferences(sheet, references, currRow);

  return newRows;
};

/**
 * populate worksheet cells with a list of references
 * @param {Worksheet} sheet excel Worksheet object
 * @param {Array} references list or references to add to worksheet
 * @param {Integer} currRow the current row being manipulated in the worksheet
 * @returns {Integer} returns the number of rows that were added to the worksheet
 */
const populateReferences = (sheet, references, currRow) => {
  let newRows = 0; // count how many new rows are being added
  references.forEach((reference) => {
    populateRange(sheet, reference, "A", currRow, cellPlainFontFormat);
    if (reference.length > 1) {
      // add hyperlink
      const range = sheet.getRange(`B${currRow}:B${currRow}`);
      const cell = range.getCell(0, 0);
      const hyperlink = {
        textToDisplay: reference[1],
        screenTip: reference[0],
        address: reference[1],
      };
      cell.hyperlink = hyperlink;
    }
    currRow += 1;
    newRows += 1;
  });

  return newRows;
};

/**
 * populates worksheet with emissions factors values and references for all energy sources provided
 * @param {Worksheet} sheet - MS excel Worksheet object
 * @param {Integer} yearIndex - the index representing what year to lookup in the case where emissions factors have an array of values (example: grid). yearIndex should be scenario.year - appconfig().startYear
 * @param {Object} energySources - collection of energysources to display EFs for
 * @param {Integer} currRow - the current row being manipulated in the worksheet
 * @returns number of rows that were added
 */
const populateEmissionsFactors = (sheet, yearIndex, energySources, currRow) => {
  let newRows = 0;
  Object.keys(energySources).forEach((src) => {
    const efUnit =
      "efUnit" in energySources[src] && energySources[src].efUnit !== null
        ? energySources[src].efUnit
        : "MJ";
    const srcTotal = !Array.isArray(energySources[src].emissionsFactors["CO2"])
      ? energySources[src].emissionsFactors["CO2"] +
        energySources[src].emissionsFactors["CH4"] +
        energySources[src].emissionsFactors["N2O"]
      : energySources[src].emissionsFactors["CO2"][yearIndex] +
        energySources[src].emissionsFactors["CH4"][yearIndex] +
        energySources[src].emissionsFactors["N2O"][yearIndex];
    let reference = "";
    if (
      "references" in energySources[src] &&
      energySources[src].references.length
    ) {
      reference = energySources[src].references[0];
    }
    const headingRow = [
      energySources[src].name,
      srcTotal,
      `g/${efUnit}`,
      reference[0],
    ];
    // total row
    populateRange(sheet, headingRow, "A", currRow);
    // reference link
    if (reference.length > 1) {
      // add hyperlink
      const range = sheet.getRange(`D${currRow}:D${currRow}`);
      const cell = range.getCell(0, 0);
      const hyperlink = {
        textToDisplay: reference[1],
        screenTip: reference[0],
        address: reference[1],
      };
      cell.hyperlink = hyperlink;
    }
    currRow += 1;
    // gases
    ["CO2", "CH4", "N2O"].forEach((gas) => {
      const ef = Array.isArray(energySources[src].emissionsFactors[gas])
        ? energySources[src].emissionsFactors[gas][yearIndex]
        : energySources[src].emissionsFactors[gas];
      populateRange(
        sheet,
        [gas, ef, `g/${efUnit}`],
        "A",
        currRow,
        cellPlainFontFormat
      );
      currRow += 1;
    });
    newRows += 4;
  });

  return newRows;
};

/**
 *
 * @param {Worksheet} sheet - excel Worksheet object
 * @param {Array} reference - reference array with [text,link]
 * @param {Integer} currRow - the current row being manipulated in the worksheet
 * @returns the number of rows added to the worksheet
 */
const populateGWPReferences = (sheet, reference, currRow) => {
  // title
  populateRange(sheet, ["GWP"], "A", currRow, cellHeadingFontFormat);
  let range = sheet.getRange(`A${currRow}:E${currRow}`);
  formatRange(range, scenarioAssumptionsCellFillFormatSecondary);
  currRow += 1;
  populateRange(
    sheet,
    [t("appConfig.energySources.gwp.description"), "", "", reference[1]],
    "A",
    currRow,
    cellPlainFontFormat
  );
  // reference link
  // add hyperlink
  range = sheet.getRange(`D${currRow}:D${currRow}`);
  const cell = range.getCell(0, 0);
  const hyperlink = {
    textToDisplay: reference[1],
    screenTip: reference[0],
    address: reference[1],
  };
  cell.hyperlink = hyperlink;
  currRow += 1;

  // gwp values
  populateRange(sheet, ["CO2", 1], "A", currRow, cellPlainFontFormat);
  currRow += 1;

  const gases = Object.keys(energySourcesConfig().gwp.values);
  gases.forEach((gas) => {
    populateRange(
      sheet,
      [gas, energySourcesConfig().gwp.values[gas]],
      "A",
      currRow,
      cellPlainFontFormat
    );
    currRow += 1;
  });

  const newRows = gases.length + 3;

  return newRows;
};

export {
  initChartDataRanges,
  columnWidths,
  setColumnWidths,
  cellHeadingFontFormat,
  cellHeadingFontWhiteFormat,
  cellSubheadingFontFormat,
  cellPlainFontFormat,
  cellFillWhiteFormat,
  cellNumberFormat,
  cellNumberFormat2Dec,
  cellNumberFormat3Dec,
  cellCurrencyFormat,
  scenarioMergedCellFillFormat,
  scenarioSummaryCellFillFormatPrimary,
  scenarioMetaCellFillFormatPrimary,
  scenarioMetaCellFillFormatSecondary,
  scenarioBuildingsCellFillFormatPrimary,
  scenarioBuildingsCellFillFormatSecondary,
  scenarioServicesCellFillFormatPrimary,
  scenarioServicesCellFillFormatSecondary,
  scenarioInfrastructureCellFillFormatPrimary,
  scenarioInfrastructureCellFillFormatSecondary,
  scenarioTransportationCellFillFormatPrimary,
  scenarioTransportationCellFillFormatSecondary,
  scenarioRevenueCellFillFormatPrimary,
  scenarioRevenueCellFillFormatSecondary,
  scenarioAssumptionsCellFillFormatPrimary,
  scenarioAssumptionsCellFillFormatSecondary,
  scenarioEnergyUseCellFillFormatPrimary,
  scenarioEnergyUseCellFillFormatSecondary,
  scenarioEmissionsCellFillFormatPrimary,
  scenarioEmissionsCellFillFormatSecondary,
  setSheetTitleBar,
  setGeneratedBySubtitle,
  populateRange,
  populateScenariosSummaryRow,
  populateScenarioSectorCosts,
  populateSectorReferences,
  populateReferences,
  populateEmissionsFactors,
  populateGWPReferences,
};
