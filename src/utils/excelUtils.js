/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * utilities for interacting with excel
 */
import { computed } from "vue";
import { useExcelStore } from "@/store/excel.js";
import i18n from "@/plugins/i18n";
import appConfig from "@/config/appConfig";
import scenarioUtils from "@/utils/scenarioUtils.js";
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";
import buildingsConfig from "@/config/buildings.js";
import servicesConfig from "@/config/services";
import infrastructureConfig from "@/config/infrastructure";
import transportationConfig from "@/config/transportation";
import energySourcesConfig from "@/config/energySources.js";
import genericUtils from "@/utils/genericUtils";
import useCalculatorUtils from "@/utils/calculatorUtils.js";
import { endCol, formatRange } from "@/utils/excelGenericUtils.js";
import {
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
  cellCurrencyFormat,
  scenarioMergedCellFillFormat,
  scenarioSummaryCellFillFormatPrimary,
  scenarioMetaCellFillFormatPrimary,
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
  populateScenarioSectorCosts,
  populateSectorReferences,
  populateReferences,
  populateEmissionsFactors,
  populateGWPReferences,
  populateScenariosSummaryRow,
} from "@/utils/excelHelperUtils.js";

// for testing and development vvvvvv
// import exampleScenarios from "@/sampleData/scenario.js";
// for testing and development ^^^^^^

export default function useExcelUtils() {
  const t = i18n.global.t;
  const excelStore = useExcelStore();
  // const getScenarioById = scenarioUtils().getScenarioById;
  const workbookMap = computed(() => excelStore.getWorkbookMap);

  /** *******************************************
   * WORKBOOK / WORKSHEET / APP SYNCING MANAGEMENT FUNCTIONS
   * *******************************************
   */

  /**
   * analyzes the current scenario store and the current workbook and generates a workbook map for tracking worksheets, scenarios, actions
   * generated map is saved to excelStore
   */
  const generateWorkbookMap = async () => {
    // analyze collection of worksheets and view customProperties on them to determine if they correspond to scenarios or actions
    const _workbookMap = {
      sheets: {},
      summaryTables: {},
      chartDataSheets: {},
      summaryCharts: {},
      scenarios: {},
      allSheets: [],
    };

    if ("Excel" in window) {
      return window.Excel.run(async (context) => {
        // get sheets from current workbook
        const sheets = context.workbook.worksheets;
        sheets.load(["id", "name", "customProperties"]);
        await context.sync();

        sheets.items.forEach(async (sheet) => {
          // add sheet name to allSheets so we can track and prevent duplicate sheet name errors
          _workbookMap.allSheets.push(sheet.name);

          // analyze each sheet for ssg-type and scenario/action related properties
          // NOTE sheet.customProperties.getItem does not seem to work reliably.
          // Therefore, using the toJSON method to get them into an object that is more predictable to manipulate and query
          // the documented approach (that's not working)
          // const myProp = sheet.customProperties.getItem("ssg-type");
          // myProp.load(["key", "value"]);
          // await context.sync();
          const customProps = sheet.customProperties.toJSON().items;
          const sheetType = customProps.find((prop) => prop.key === "ssg-type");
          if (sheetType !== undefined) {
            // only proceed if the sheet contains an 'ssg-type' key
            const idKey = customProps.find(
              (prop) => prop.key === `ssg-${sheetType.value}Id`
            );
            // validation
            // scenarios and actions must exist either in localstorage or on cloud database
            // if a given scenario or action doesn't exist locally or on cloud, the worksheet must be invalid
            // todo have some sort of function to build a new action or scenario from a populated worksheet
            // todo - the actual validation... assuming all is valid right now!

            // add to sheets map
            _workbookMap.sheets[sheet.id.toString()] = {
              name: sheet.name,
              type: sheetType.value,
            };
            _workbookMap.sheets[sheet.id.toString()][`${sheetType.value}Id`] =
              idKey.value;
            // add to scenarios/summaryTables/summaryCharts maps
            _workbookMap[`${sheetType.value}s`][idKey.value] = {
              sheetId: sheet.id.toString(),
            };
          }
        });
        // save map to store
        excelStore.$patch((state) => {
          state.workbookMap = _workbookMap;
        });
      });
    } else {
      console.warn(`Excel not found.`);
    }
  };

  /**
   * returns word either "add" or "update" depending on if workbook for specified action exists or not
   * @param {string} id - the id of the action
   * @returns string either "add" or "update" depending on if the workbook exists or not
   */
  const workbookActionAddOrUpdate = (id) => {
    const addOrUpdate = id in workbookMap.value.actions ? "update" : "add";
    return addOrUpdate;
  };

  /** *******************************************
   * WORKSHEET EDITING/CREATING FUNCTIONS
   * functions to create or update scenario summaries, scenario details, charts worksheets
   * *******************************************
   */

  /**
   * saves a scenario to a worksheet
   * if sheet already exists for the scenario it is updated
   * if no sheet exists, a new sheet is created
   * @param {Object} scenario - a scenario object (see /sampleData/scenario.js for an example)
   */
  const saveScenarioToWorksheet = async (
    scenario,
    saveSummaries = true,
    setActive = true
  ) => {
    if ("Excel" in window) {
      generateWorkbookMap().then(() => {
        return window.Excel.run(async (context) => {
          const sheets = context.workbook.worksheets;
          let sheet = null;
          let range = null;

          // objects for tracking dynamic cells and formulas
          const formulas = {}; // to hold key-value pairs with cell ref name and formula generator. example: totalFloorspace: () => `=${formulaRefs.floorspacePerUnit}*${formulaRefs.numberUnits}`
          const formulaRefs = {}; // to hold key-value paris with cell ref name and cell address. example: totalFloorspace: "D12"

          // check if worksheet exists already
          let sheetId =
            scenario.id in excelStore.workbookMap.scenarios
              ? excelStore.workbookMap.scenarios[scenario.id].sheetId
              : null;
          if (sheetId !== null) {
            sheet = context.workbook.worksheets.getItem(sheetId);
            // clear existing content on sheet
            range = sheet.getRange();
            range.clear();
            await context.sync();
          } else {
            const sheetTitle = genericUtils().getUniqueName(
              `${scenario.title}`,
              excelStore.workbookMap.allSheets,
              null,
              25
            );
            sheet = sheets.add(sheetTitle);
            sheet.customProperties.add("ssg-type", "scenario");
            sheet.customProperties.add("ssg-scenarioId", scenario.id);
          }
          // sheet tab color
          sheet.tabColor = "#17b1dc";
          // remove gridlines
          sheet.showGridlines = false;

          // set any specific column widths
          setColumnWidths(sheet, columnWidths.scenario);

          // WRITE DATA TO RANGES
          // initiate currRow
          let currRow = 1;
          // setup array for tracking dynamic cells to be calculated

          // META INFO
          const metaInfo = [
            [t("forms.fields.scenarioTitle"), scenario.title],
            [t("forms.fields.scenarioDescription"), scenario.description],
            [t("forms.fields.province"), scenario.provId],
            [t("forms.fields.buildOutYear"), scenario.year],
            [
              t("forms.fields.neighbourhoodType"),
              neighbourhoodTypesConfig().neighbourhoods[
                scenario.neighbourhoodType
              ].name,
            ],
          ];
          metaInfo.forEach((_range, index) => {
            populateRange(
              sheet,
              _range,
              "A",
              currRow + index,
              cellHeadingFontFormat
            );
          });
          // section formatting
          range = sheet.getRange("A1:E4");
          formatRange(range, scenarioMetaCellFillFormatPrimary);
          // force year to align left
          range = sheet.getRange("B3");
          formatRange(range, { horizontalAlignment: "Left" });

          currRow += metaInfo.length;

          // generated by ssg subtitle and date
          setGeneratedBySubtitle(sheet, currRow, 5);
          currRow += 3;

          // BUILDINGS
          // title
          populateRange(
            sheet,
            [t("scenario.modules.buildings")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioBuildingsCellFillFormatPrimary);
          currRow += 1;
          // building types
          const buildingTypes = Object.keys(scenario.buildings);
          buildingTypes.forEach((_type) => {
            const buildingsInfo = [
              // range values and dynamic cell references
              {
                vals: [buildingsConfig().homeTypes[_type].name],
                format: cellHeadingFontFormat,
              },
              {
                vals: [
                  t("forms.fields.numberDwellings"),
                  scenario.buildings[_type].qty,
                ],
                refs: [`numUnits_${_type}`],
              },
              {
                vals: [
                  t("forms.fields.floorspacePerUnit"),
                  buildingsConfig().homeTypes[_type].size_m2,
                  "m2",
                ],
                refs: [`floorspacePerUnit_${_type}`],
              },
              {
                vals: [
                  t("forms.fields.floorspaceTotal"),
                  scenario.buildings[_type].qty *
                    buildingsConfig().homeTypes[_type].size_m2,
                  "m2",
                ],
                refs: [`totalFloorspace_${_type}`],
              },
              {
                vals: [
                  t("forms.fields.buildingEnergyCodeShort"),
                  buildingsConfig().buildingEnergyCodes[
                    scenario.buildings[_type].buildingEnergyCode
                  ].name,
                ],
              },
              {
                vals: [
                  t("forms.fields.euiShort"),
                  scenario.buildings[_type].eui,
                  "MJ/m2",
                ],
                refs: [`eui_${_type}`],
              },
            ];
            // dynamic formulas
            formulas[`totalFloorspace_${_type}`] = () =>
              `=${formulaRefs[`floorspacePerUnit_${_type}`]}*${
                formulaRefs[`numUnits_${_type}`]
              }`;
            buildingsInfo.forEach((_range, index) => {
              if (index === 0) {
                // buiding type title
                populateRange(sheet, _range.vals, "B", currRow + index);
                range = sheet.getRange(
                  `B${currRow + index}:E${currRow + index}`
                );
                formatRange(range, scenarioBuildingsCellFillFormatSecondary);
              } else {
                const populateParams = [
                  sheet,
                  _range.vals,
                  "C",
                  currRow + index,
                  cellSubheadingFontFormat,
                  cellNumberFormat
                ];
                if ("format" in _range) {
                  populateParams.push(_range.format);
                }
                populateRange(...populateParams);
                // track dynamic cell
                if ("refs" in _range) {
                  _range.refs.forEach((_ref) => {
                    formulaRefs[_ref] = `D${currRow + index}`;
                  });
                }
              }
            });

            // track some cells for calculation
            const inputsStart = currRow + 1;
            currRow += buildingsInfo.length + 1; // add an extra space between each type
            // building energy sources
            populateRange(sheet, [t("forms.fields.energyMix")], "C", currRow);
            currRow += 1;
            const energySources = Object.keys(
              scenario.buildings[_type].energySources
            );
            energySources.forEach((src, index) => {
              const srcRangeVals = [];
              srcRangeVals.push(
                // todo format percentages
                energySourcesConfig().energySources[src].name,
                scenario.buildings[_type].energySources[src].value,
                "%"
              );
              populateRange(sheet, srcRangeVals, "C", currRow + index);
            });
            const inputsEnd = currRow + energySources.length - 1;
            // inputs/defauts merged cell title
            populateRange(
              sheet,
              [t("scenario.inputsDefaults")],
              "B",
              inputsStart
            );
            range = sheet.getRange(`B${inputsStart}:B${inputsEnd}`);
            formatRange(range, scenarioMergedCellFillFormat);
            range.merge();
            formatRange(range, { verticalAlignment: "Center" });

            currRow += energySources.length + 1; // add an extra space between each type

            // building energy and emissions
            const outputsStart = currRow;
            // populateRange(sheet, [t("scenario.energyUse"), useCalculatorUtils().convert(scenario.buildings[_type].energyUse).from("MJ").to("GJ"), "GJ/yr"], "C", currRow);
            // energy use as a spreadsheet formula
            populateRange(
              sheet,
              [
                t("scenario.energyUse"),
                `${t("general.calculating")}...`,
                `GJ/${t("general.yearAbbr")}`,
              ],
              "C",
              currRow,
              cellSubheadingFontFormat,
              cellNumberFormat
            );
            // add dynamic formula
            formulaRefs[`bldgEnergyUse_${_type}`] = `D${currRow}`;
            formulas[`bldgEnergyUse_${_type}`] = () =>
              `=${formulaRefs[`totalFloorspace_${_type}`]}*${
                formulaRefs[`eui_${_type}`]
              }*0.001`;
            currRow += 1;
            populateRange(sheet, [t("scenario.emissions")], "C", currRow);
            // emissions by gas type
            currRow += 1;
            ["CO2", "CH4", "N2O", t("general.total")].forEach((gas, index) => {
              populateRange(
                sheet,
                [
                  gas,
                  scenario.buildings[_type].emissions[gas],
                  `tCO2e/${t("general.yearAbbr")}`,
                ],
                "C",
                currRow + index,
                cellSubheadingFontFormat,
                cellNumberFormat2Dec
              );
            });
            const outputsEnd = currRow + 3;
            // outputs merged cell title
            populateRange(sheet, [t("scenario.outputs")], "B", outputsStart);
            range = sheet.getRange(`B${outputsStart}:B${outputsEnd}`);
            formatRange(range, scenarioMergedCellFillFormat);
            range.merge();
            formatRange(range, { verticalAlignment: "Center" });

            currRow += 5;
          });

          // SERVICES
          currRow +=
            populateScenarioSectorCosts(
              "services",
              sheet,
              t("scenario.modules.services", 2),
              t("scenario.modules.services", 1),
              scenario.services,
              [
                scenarioServicesCellFillFormatPrimary,
                scenarioServicesCellFillFormatSecondary,
              ],
              servicesConfig().serviceTypes,
              currRow
            ) + 1;

          // INFRASTRUCTURE
          currRow +=
            populateScenarioSectorCosts(
              "infrastructure",
              sheet,
              t("scenario.modules.infrastructure"),
              t("scenario.modules.infrastructure"),
              scenario.infrastructure,
              [
                scenarioInfrastructureCellFillFormatPrimary,
                scenarioInfrastructureCellFillFormatSecondary,
              ],
              infrastructureConfig().infrastructureTypes,
              currRow
            ) + 1;

          // TRANSPORTATION
          // title
          populateRange(
            sheet,
            [t("scenario.modules.transportation")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioTransportationCellFillFormatPrimary);
          currRow += 1;
          // transportation types
          const transportationTypes = Object.keys(scenario.transportation);
          transportationTypes.forEach((_type) => {
            const transportationInfo = [];
            // transportation type label
            transportationInfo.push(
              // range values set up in arrays of [[vals], {labelformat}]
              [
                [transportationConfig().transportationTypes[_type].name],
                cellHeadingFontFormat,
              ],
              [
                [
                  t("forms.fields.annualKT"),
                  scenario.transportation[_type].qty,
                  `VKT/${t("general.dwelling")}`,
                ],
              ],
              [
                [
                  "",
                  scenario.transportation[_type].qtyTotal,
                  t("forms.fields.totalVKT"),
                ],
              ]
            );
            transportationInfo.forEach((_range, index) => {
              if (index === 0) {
                // transportation type title
                populateRange(sheet, _range[0], "B", currRow + index);
                range = sheet.getRange(
                  `B${currRow + index}:E${currRow + index}`
                );
                formatRange(
                  range,
                  scenarioTransportationCellFillFormatSecondary
                );
              } else {
                populateRange(
                  sheet,
                  _range[0],
                  "C",
                  currRow + index,
                  _range[1],
                  cellNumberFormat
                );
              }
            });
            // track some cells for calculation
            const inputsStart = currRow + 1;
            let inputsEnd = inputsStart;
            currRow += transportationInfo.length + 1; // add an extra space between each type
            // transportation energy sources
            const isActive =
              "active" in transportationConfig().transportationTypes[_type] &&
              transportationConfig().transportationTypes[_type].active === true
                ? true
                : false;
            if (!isActive) {
              populateRange(sheet, [t("forms.fields.energyMix")], "C", currRow);
              currRow += 1;
              const energySources = Object.keys(
                scenario.transportation[_type].energySources
              );
              energySources.forEach((src, index) => {
                const srcRangeVals = [];
                srcRangeVals.push(
                  // todo format percentages
                  energySourcesConfig().energySources[src].name,
                  scenario.transportation[_type].energySources[src].value,
                  "%"
                );
                populateRange(sheet, srcRangeVals, "C", currRow + index);
              });
              inputsEnd = currRow + energySources.length - 1;
              currRow += energySources.length; // add an extra space between each type
            }
            currRow += 1;
            // inputs/defauts merged cell title
            populateRange(
              sheet,
              [t("scenario.inputsDefaults")],
              "B",
              inputsStart
            );
            range = sheet.getRange(`B${inputsStart}:B${inputsEnd}`);
            formatRange(range, scenarioMergedCellFillFormat);
            range.merge();
            formatRange(range, { verticalAlignment: "Center" });

            // transportation energy and emissions
            if (!isActive) {
              const outputsStart = currRow;
              populateRange(
                sheet,
                [
                  t("scenario.energyUse"),
                  useCalculatorUtils()
                    .convert(scenario.transportation[_type].energyUse)
                    .from("MJ")
                    .to("GJ"),
                  `GJ/${t("general.yearAbbr")}`,
                ],
                "C",
                currRow,
                cellSubheadingFontFormat,
                cellNumberFormat2Dec
              );
              // todo energy use as a spreadsheet formula
              currRow += 1;
              populateRange(sheet, [t("scenario.emissions")], "C", currRow);
              // emissions by gas type
              currRow += 1;
              ["CO2", "CH4", "N2O", t("general.total")].forEach(
                (gas, index) => {
                  populateRange(
                    sheet,
                    [
                      gas,
                      scenario.transportation[_type].emissions[gas],
                      `tCO2e/${t("general.yearAbbr")}`,
                    ],
                    "C",
                    currRow + index
                  );
                  // number formatting
                  range = sheet.getRange(`D${currRow + index}`);
                  range.numberFormat = "0.00"; // "0.00E+00" scientific notation
                }
              );
              const outputsEnd = currRow + 3;
              // outputs merged cell title
              populateRange(sheet, [t("scenario.outputs")], "B", outputsStart);
              range = sheet.getRange(`B${outputsStart}:B${outputsEnd}`);
              formatRange(range, scenarioMergedCellFillFormat);
              range.merge();
              formatRange(range, { verticalAlignment: "Center" });

              currRow += 5;
            }
          });

          // REVENUE
          // title
          populateRange(
            sheet,
            [t("scenario.modules.revenueLong")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioRevenueCellFillFormatPrimary);
          currRow += 1;

          // revenue outputs
          ["developmentCharges", "propertyTaxes"].forEach((_type) => {
            const revenueInfo = [];
            // range values set up in arrays of [[vals], {labelformat}]
            // revenue type label
            if (_type === "developmentCharges") {
              revenueInfo.push([
                [
                  t(`appConfig.revenue.revenueTypes.${_type}`),
                  `$/${t("general.dwelling")}`,
                  `${t("general.total")}`,
                ],
                cellHeadingFontFormat,
              ]);
            } else {
              revenueInfo.push([
                [
                  t(`appConfig.revenue.revenueTypes.${_type}`),
                  `$/${t("general.dwelling")}/${t("general.yearAbbr")}`,
                  `${t("general.total")}/${t("general.yearAbbr")}`,
                ],
                cellHeadingFontFormat,
              ]);
            }
            Object.keys(scenario.revenue[_type]).forEach((key) => {
              revenueInfo.push([
                [
                  t(`appConfig.buildings.homeTypes.${key}`),
                  scenario.revenue[_type][key].perUnit,
                  scenario.revenue[_type][key].total,
                ],
              ]);
            });
            revenueInfo.forEach((_range, index) => {
              if (index === 0) {
                // revenue type title
                populateRange(sheet, _range[0], "B", currRow + index);
                range = sheet.getRange(
                  `B${currRow + index}:E${currRow + index}`
                );
                formatRange(range, {
                  ...scenarioRevenueCellFillFormatSecondary,
                  ...cellSubheadingFontFormat,
                });
                // cell alignment for values titles
                range = sheet.getRange(`C${currRow + index}:E${currRow + index}`)
                formatRange(range, {
                  horizontalAlignment: "Right"
                });
              } else {
                populateRange(
                  sheet,
                  _range[0],
                  "B",
                  currRow + index,
                  _range[1]
                );
              }
            });
            // currency formatting
            range = sheet.getRange(
              `C${currRow}:D${currRow + revenueInfo.length}`
            );
            range.numberFormat = [["$#,##0"]];
            currRow += revenueInfo.length + 1; // add an extra space between each type
          });
          // revenue totals title
          populateRange(
            sheet,
            [t("scenario.modules.revenueTotal")],
            "B",
            currRow
          );
          range = sheet.getRange(`B${currRow}:E${currRow}`);
          formatRange(range, scenarioRevenueCellFillFormatSecondary);
          currRow += 1;
          // values
          const revenueData = Object.keys(scenario.revenue).map(
            (_revenueType) => {
              return [
                _revenueType === "developmentCharges"
                  ? t("appConfig.revenue.revenueTypes.developmentCharges")
                  : t("appConfig.revenue.revenueTypes.propertyTaxes"),
                Object.keys(scenario.revenue[_revenueType]).reduce(
                  (previous, key) => {
                    return previous + scenario.revenue[_revenueType][key].total;
                  },
                  0
                ),
              ];
            }
          );
          revenueData.forEach((_range, index) => {
            populateRange(sheet, _range, "C", currRow + index);
          });

          // currency formatting
          range = sheet.getRange(
            `D${currRow}:D${currRow + revenueData.length}`
          );
          range.numberFormat = [["$#,##0"]];
          // increment currRow
          currRow += revenueData.length + 2;

          // ASSUMPTIONS AND REFERENCES
          // title
          populateRange(
            sheet,
            [t("scenario.assumptionsRefs")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioAssumptionsCellFillFormatPrimary);
          currRow += 1;

          const neighbourhoodTypeObj =
            neighbourhoodTypesConfig().neighbourhoods[
              scenario.neighbourhoodType
            ];

          // buildings assumptions and references
          // general buildings sector
          currRow +=
              populateSectorReferences(sheet, t("scenario.modules.buildingsRefs"), neighbourhoodTypeObj.sectorReferences.homes.references, currRow)
          // references for each unique building code
          const scenarioEnergyCodes = buildingsConfig().getAllBuildingCodesForScenario(scenario);
          scenarioEnergyCodes.forEach((energyCode) => {
            // append energyCode name to start of references list
            const references = 'references' in energyCode ? JSON.parse(JSON.stringify(energyCode.references)) : [];
            references.unshift([energyCode.name]);
            currRow += populateReferences(sheet, references, currRow)
          });
          // add extra blank row
          currRow += 1;

          // reference sections for services, infrastructure
          const referenceSections = [
            [
              t("scenario.modules.servicesRefs"),
              neighbourhoodTypeObj.sectorReferences.services.references,
            ],
            [
              t("scenario.modules.infrastructureRefs"),
              neighbourhoodTypeObj.sectorReferences.infrastructure.references,
            ],
          ];
          referenceSections.forEach((section) => {
            currRow +=
              populateSectorReferences(sheet, section[0], section[1], currRow) +
              1;
          });

          // transportation assumptions and references
          // title
          populateRange(
            sheet,
            [t("scenario.modules.transportationRefs")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioAssumptionsCellFillFormatSecondary);
          currRow += 1;
          populateRange(
            sheet,
            [t("forms.fields.fuelConsumption")],
            "A",
            currRow
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioMergedCellFillFormat);
          currRow += 1;
          // assumptions
          transportationTypes
            .filter((_type) => {
              return "active" in
                transportationConfig().transportationTypes[_type] &&
                transportationConfig().transportationTypes[_type].active ===
                  true
                ? false
                : true;
            })
            .forEach((_type) => {
              populateRange(
                sheet,
                [transportationConfig().transportationTypes[_type].name],
                "A",
                currRow
              );
              currRow += 1;
              const energySources = Object.keys(
                scenario.transportation[_type].energySources
              );
              energySources.forEach((src, index) => {
                const srcRangeVals = [];
                srcRangeVals.push(
                  energySourcesConfig().energySources[src].name,
                  transportationConfig().transportationTypes[_type]
                    .fuelConsumption[src],
                  "MJ/100km"
                );
                populateRange(
                  sheet,
                  srcRangeVals,
                  "A",
                  currRow + index,
                  cellPlainFontFormat
                );
              });
              currRow += energySources.length;
            });

          // transportation references
          populateRange(sheet, [t("general.referencesTitle")], "A", currRow);
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioMergedCellFillFormat);
          currRow += 1;
          currRow +=
            populateReferences(
              sheet,
              neighbourhoodTypeObj.sectorReferences.transportation.references,
              currRow
            ) + 1;

          // Emissions Factors
          // title
          populateRange(
            sheet,
            [t("scenario.energyEFs")],
            "A",
            currRow,
            cellHeadingFontFormat
          );
          range = sheet.getRange(`A${currRow}:E${currRow}`);
          formatRange(range, scenarioAssumptionsCellFillFormatSecondary);
          currRow += 1;

          const scenarioEnergySources =
            energySourcesConfig().getAllEnergySourcesForScenario(scenario);
          const yearIndex = scenario.year - appConfig().startYear;
          currRow +=
            populateEmissionsFactors(
              sheet,
              yearIndex,
              scenarioEnergySources,
              currRow
            ) + 1;

          // GWP
          currRow += populateGWPReferences(
            sheet,
            energySourcesConfig().gwp.references[0],
            currRow
          );

          // activate cell formulas - look up all dynamically defined cell refs and create predefined equations
          Object.keys(formulas).forEach((key) => {
            range = sheet.getRange(formulaRefs[key]);
            range.values = [[formulas[key]()]];
          });

          // UPDATE SUMMARIES
          if (saveSummaries) {
            // console.log(`saveSummaries is true`);
            saveScenarioSummaries(false, false);
          }

          // activate the sheet
          if (setActive) {
            sheet.activate();
          }

          // sync
          await context.sync();
          // update the workbook map
          generateWorkbookMap();
        }).catch(function (error) {
          console.warn("Error: " + error);
          if (error instanceof OfficeExtension.Error) {
            console.warn("Debug info: " + JSON.stringify(error.debugInfo));
          }
        });
      });
    } else {
      console.warn(`Excel not found.`);
    }
  };

  /**
   * saves a scenario and all scenario actions to a worksheet
   * if sheet already exists for the scenario it is updated
   * if no sheet exists, a new sheet is created
   * @param {Object} scenario - a scenario
   */
  const saveScenarioSummaries = async (
    saveScenarios = true,
    setActive = true
  ) => {
    if ("Excel" in window) {
      generateWorkbookMap().then(() => {
        // debugging example scenarios
        // const scenarios = genericUtils().getObjectKeysAsArray(
        //   exampleScenarios()
        // );
        // init chartDataRanges in store
        initChartDataRanges();
        // get scenarios
        const scenarios = scenarioUtils().getScenarios.value;
        // get total homes for later calculations
        scenarios.forEach((scenario) => {
          scenario.totalHomes =
            neighbourhoodTypesConfig().totalHomesForNeighbourhood(
              scenario.buildings
            );
        });

        if (saveScenarios) {
          // save scenario summary sheets
          scenarios.forEach((scenario) => {
            saveScenarioToWorksheet(scenario, false, false);
          });
        }

        // add/update scenario summary sheet
        window.Excel.run(async (context) => {
          const sheets = context.workbook.worksheets;
          let sheet = null;
          let range = null;

          // objects for tracking dynamic cells and formulas
          // const formulas = {}; // to hold key-value pairs with cell ref name and formula generator. example: totalFloorspace: () => `=${formulaRefs.floorspacePerUnit}*${formulaRefs.numberUnits}`
          // const formulaRefs = {}; // to hold key-value paris with cell ref name and cell address. example: totalFloorspace: "D12"
          const chartRanges = []; // to hold range addresses for use on charts worksheet

          // check if worksheet exists already
          // todo set projectId in store with dynamic UUID
          const summaryTableId = "ep28d901-d082-44a0-9027-ca82b105a1ea";
          let sheetId =
            summaryTableId in excelStore.workbookMap.summaryTables
              ? excelStore.workbookMap.summaryTables[summaryTableId].sheetId
              : null;
          if (sheetId !== null) {
            sheet = context.workbook.worksheets.getItem(sheetId);
            // clear existing content on sheet
            range = sheet.getRange();
            range.clear();
            await context.sync();
          } else {
            const sheetTitle = genericUtils().getUniqueName(
              t("worksheets.scenariosSummary"),
              excelStore.workbookMap.allSheets,
              null,
              25
            );
            sheet = sheets.add(sheetTitle);
            sheet.customProperties.add("ssg-type", "summaryTable");
            sheet.customProperties.add("ssg-summaryTableId", summaryTableId);
          }
          // sheet tab color
          sheet.tabColor = "#203564";
          // remove gridlines
          sheet.showGridlines = false;

          // set any specific column widths
          setColumnWidths(sheet, columnWidths.summaryTable);

          // set a title bar on the worksheet
          setSheetTitleBar(
            sheet,
            t("worksheets.scenariosSummary"),
            scenarioSummaryCellFillFormatPrimary
          );

          // write data to ranges
          let currRow = 5;
          // reusable populateScenariosSummaryRow without having to provide all parameters each time
          /**
           * populates a row of the scenario summaries worksheet
           * @param {String} rowLabel - the label to use for the row
           * @param {String} key - the key in the scenario object to lookup
           * @param {Object} rowFormat - format object with cell formatting details - default is cellPlainFontFormat
           * @param {String} startCol - the column to start with - default is "B"
           * @param {Any} defaultKeyVal - default value to put in the cell if no value found in a lookup
           * @param {Boolean} sumCostsForObj - apply the sumCostsForObj function to the key
           * @returns number of rows updated (1)
           */
          const rowPopulater = (
            rowLabel,
            key,
            rowFormat = cellPlainFontFormat,
            startCol = "B",
            defaultKeyVal = 0,
            sumFn = null,
            perHousehold = false
          ) => {
            return populateScenariosSummaryRow(
              sheet,
              rowLabel,
              scenarios,
              key,
              startCol,
              currRow,
              rowFormat,
              defaultKeyVal,
              sumFn,
              perHousehold
            );
          };
          // SCENARIO META DATA SECTION
          // track the range for charts
          chartRanges.push(["scnNameSource", currRow]),
            // header row
            (currRow += rowPopulater(t("general.scenario", 2), "title", {
              ...cellHeadingFontFormat,
              ...scenarioMetaCellFillFormatPrimary,
            }));
          // neighourbhood type
          currRow += rowPopulater(
            t("forms.fields.neighbourhoodType"),
            "neighbourhoodType",
            {
              ...cellSubheadingFontFormat,
              ...scenarioMetaCellFillFormatPrimary,
            }
          );
          // province, year
          [
            [t("forms.fields.province"), "provId"],
            [t("general.year"), "year"],
          ].forEach((row) => {
            currRow += rowPopulater(
              row[0],
              row[1],
              scenarioMetaCellFillFormatPrimary
            );
          });

          // BUILDINGS
          let sectionStart = currRow;
          populateRange(sheet, [t("scenario.modules.buildings")], "A", currRow);
          const buildingTypes = Object.keys(buildingsConfig().homeTypes).map(
            (_type) => [
              buildingsConfig().homeTypes[_type].name,
              `buildings.${_type}.qty`,
            ]
          );
          buildingTypes.forEach((row) => {
            currRow += rowPopulater(row[0], row[1], {
              ...scenarioBuildingsCellFillFormatSecondary,
              ...cellNumberFormat,
            });
          });
          currRow += rowPopulater(t("scenario.totalDwellings"), "totalHomes", {
            ...scenarioBuildingsCellFillFormatSecondary,
            ...cellNumberFormat,
          });
          range = sheet.getRange(`A${sectionStart}:A${currRow - 1}`);
          formatRange(range, scenarioBuildingsCellFillFormatPrimary);
          range.merge();
          formatRange(range, { verticalAlignment: "Center" });

          // SERVICE & INFRASCTRUCTURE COST
          [
            [
              t("scenario.modules.servicesCost"), // label
              "services", // scenario key
              scenarioServicesCellFillFormatPrimary,
              scenarioServicesCellFillFormatSecondary,
              "service", // chartRanges name root
            ],
            [
              t("scenario.modules.infrastructureCost"),
              "infrastructure",
              scenarioInfrastructureCellFillFormatPrimary,
              scenarioInfrastructureCellFillFormatSecondary,
              "inf",
            ],
          ].forEach((section) => {
            sectionStart = currRow;
            populateRange(sheet, [section[0]], "A", currRow);
            [
              [
                `${t("general.capital")} ($/${t("general.dwelling")})`,
                `${section[1]}.capCost`,
                "CapCost",
              ],
              [
                `${t("general.maintenance")} ($/${t("general.dwelling")}/${t("general.yearAbbr")})`,
                `${section[1]}.maintCost`,
                "OMCost",
              ],
            ].forEach((row) => {
              // track the range for charts
              chartRanges.push([`${section[4]}${row[2]}PerHHSource`, currRow]),
                (currRow += rowPopulater(
                  row[0],
                  row[1],
                  { ...cellFillWhiteFormat, ...cellCurrencyFormat },
                  "B",
                  0,
                  useCalculatorUtils().sumCostsForObj,
                  true
                ));
            });
            [
              [
                `${t("general.capital")} (${t("general.total")})`,
                `${section[1]}.capCost`,
                "CapCost",
              ],
              [
                `${t("general.maintenance")} (${t("general.total")}/${t("general.yearAbbr")})`,
                `${section[1]}.maintCost`,
                "OMCost",
              ],
            ].forEach((row) => {
              // track the range for charts
              chartRanges.push([`${section[4]}${row[2]}Source`, currRow]),
                (currRow += rowPopulater(
                  row[0],
                  row[1],
                  { ...section[3], ...cellCurrencyFormat },
                  "B",
                  0,
                  useCalculatorUtils().sumCostsForObj,
                  false
                ));
            });
            range = sheet.getRange(`A${sectionStart}:A${currRow - 1}`);
            formatRange(range, section[2]);
            range.merge();
            formatRange(range, { verticalAlignment: "Center" });
          });

          // TRANSPORTATION
          sectionStart = currRow;
          populateRange(
            sheet,
            [t("scenario.modules.transportation")],
            "A",
            currRow
          );
          const transportationTypes = Object.keys(
            transportationConfig().transportationTypes
          ).map((_type) => [
            transportationConfig().transportationTypes[_type].name,
            `transportation.${_type}.qty`,
            _type,
          ]);
          transportationTypes.forEach((row) => {
            const units = `(VKT/${t("general.dwelling")}/${t("general.yearAbbr")})`;
            const chartRangeName = `${row[2]}PerHHSource`;
            // track the range for charts
            chartRanges.push([chartRangeName, currRow]),
              (currRow += rowPopulater(
                `${row[0]} ${units}`,
                row[1],
                cellNumberFormat
              ));
          });
          transportationTypes.forEach((row) => {
            const units = `(${t("general.total")} VKT/${t("general.yearAbbr")})`;
            const chartRangeName = `${row[2]}Source`;
            // track the range for charts
            chartRanges.push([chartRangeName, currRow]),
              (currRow += rowPopulater(`${row[0]} ${units}`, `${row[1]}Total`, {
                ...scenarioTransportationCellFillFormatSecondary,
                ...cellNumberFormat,
              }));
          });
          range = sheet.getRange(`A${sectionStart}:A${currRow - 1}`);
          formatRange(range, scenarioTransportationCellFillFormatPrimary);
          range.merge();
          formatRange(range, { verticalAlignment: "Center" });

          // REVENUE
          sectionStart = currRow;
          populateRange(
            sheet,
            [t("scenario.modules.revenueLong")],
            "A",
            currRow
          );
          const revenueTypes = Object.keys(scenarios[0].revenue).map(
            (_revenueType) => [
              _revenueType,
              `revenue.${_revenueType}`,
              t(`appConfig.revenue.revenueTypes.${_revenueType}`),
            ]
          );
          revenueTypes.forEach((row) => {
            const units =
              row[0] === "developmentCharges"
                ? `$/${t("general.dwelling")}`
                : `$/${t("general.dwelling")}/${t("general.yearAbbr")}`;
            const chartRangeName =
              row[0] === "developmentCharges"
                ? "devChrgPerHHSource"
                : "taxesPerHHSource";
            // track the range for charts
            chartRanges.push([chartRangeName, currRow]),
              (currRow += rowPopulater(
                `${row[2]} (${units})`,
                row[1],
                { ...cellFillWhiteFormat, ...cellCurrencyFormat },
                "B",
                0,
                useCalculatorUtils().sumRevenueForObj,
                true
              ));
          });
          revenueTypes.forEach((row) => {
            const units =
              row[0] === "developmentCharges"
                ? `${t("general.total")}`
                : `${t("general.total")}/${t("general.yearAbbr")}`;
            const chartRangeName =
              row[0] === "developmentCharges" ? "devChrgSource" : "taxesSource";
            // track the range for charts
            chartRanges.push([chartRangeName, currRow]),
              (currRow += rowPopulater(
                `${row[2]} (${units})`,
                row[1],
                {
                  ...scenarioRevenueCellFillFormatSecondary,
                  ...cellCurrencyFormat,
                },
                "B",
                0,
                useCalculatorUtils().sumRevenueForObj,
                false
              ));
          });
          range = sheet.getRange(`A${sectionStart}:A${currRow - 1}`);
          formatRange(range, scenarioRevenueCellFillFormatPrimary);
          range.merge();
          formatRange(range, { verticalAlignment: "Center" });

          // ENERGY USE & EMISSIONS
          const sections = [
            [
              t("scenario.energyUse"), // label
              scenarioEnergyUseCellFillFormatPrimary, // label cell format
              scenarioEnergyUseCellFillFormatSecondary, // row format
              `GJ/${t("general.dwelling")}/${t("general.year").toLowerCase()}`, // units
              `${t("general.total")} GJ/${t("general.year").toLowerCase()}`, // total units
              useCalculatorUtils().sumEnergyForScenario, // sum function
              "energy", // chartRange name
            ],
            [
              t("scenario.emissions"),
              scenarioEmissionsCellFillFormatPrimary,
              scenarioEmissionsCellFillFormatSecondary,
              `tCO2e/${t("general.dwelling")}/${t(
                "general.year"
              ).toLowerCase()}`,
              `${t("general.total")} tCO2e/${t("general.year").toLowerCase()}`,
              useCalculatorUtils().sumEmissionsForScenario,
              "emissions",
            ],
          ];
          sections.forEach((section) => {
            sectionStart = currRow;
            // track the range for charts
            chartRanges.push([`${section[6]}PerHHSource`, currRow]),
              populateRange(sheet, [section[0]], "A", currRow);
            currRow += rowPopulater(
              section[3],
              "",
              { ...cellFillWhiteFormat, ...cellNumberFormat2Dec },
              "B",
              0,
              section[5],
              true
            );
            // track the range for charts
            chartRanges.push([`${section[6]}Source`, currRow]),
              (currRow += rowPopulater(
                section[4],
                "",
                { ...section[2], ...cellNumberFormat2Dec },
                "B",
                0,
                section[5],
                false
              ));
            range = sheet.getRange(`A${sectionStart}:A${currRow - 1}`);
            formatRange(range, {
              ...cellHeadingFontWhiteFormat,
              ...section[1],
            });
            range.merge();
            formatRange(range, { verticalAlignment: "Center" });
          });

          // make note of data source ranges
          const rangesColStart = "C";
          // const rangesColEnd = endCol("C", scenarios.length);

          chartRanges.forEach((_range) => {
            excelStore.$patch((state) => {
              state.chartDataRanges[
                _range[0]
              ].rangeStart = `${rangesColStart}${_range[1]}`;
            });
          });

          // activate the sheet
          if (setActive) {
            sheet.activate();
          }
          // sync
          await context.sync();
          // update the workbook map
          generateWorkbookMap();
          // save chartDataSheet
          createChartDataSheet().then(async() => {
            await genSummaryCharts();
          });
        });
      });
    } else {
      console.warn(`Excel not found.`);
    }
  };

  /**
   * generate a hidden sheet containing ranges for use in charts
   */
  const createChartDataSheet = async () => {
    if ("Excel" in window) {
      // add/update scenario summary sheet
      return window.Excel.run(async (context) => {
        // debugging extended logging
        // OfficeExtension.config.extendedErrorLogging = true;
        const sheets = context.workbook.worksheets;
        let sheet = null;
        let range = null;

        // todo get a dynamic id
        const chartDataSheetId = "870003d3-3907-47e4-a340-3bf7d8f6980c";

        // check if worksheet exists already
        let sheetId =
          chartDataSheetId in excelStore.workbookMap.chartDataSheets
            ? excelStore.workbookMap.chartDataSheets[chartDataSheetId].sheetId
            : null;
        if (sheetId !== null) {
          sheet = context.workbook.worksheets.getItem(sheetId);
          // clear existing content on sheet
          range = sheet.getRange();
          range.clear();
          await context.sync();
        } else {
          const sheetTitle = genericUtils().getUniqueName(
            `SSG Chart Data`,
            excelStore.workbookMap.allSheets,
            null,
            25
          );
          sheet = sheets.add(sheetTitle);
          sheet.customProperties.add("ssg-type", "chartDataSheet");
          sheet.customProperties.add("ssg-chartDataSheetId", chartDataSheetId);
        }

        // ADD RANGES FOR CHARTS
        const numScenarios = scenarioUtils().numScenarios.value;
        // columns to store data in
        const dataStartCol = "B";
        const dataEndCol = endCol(dataStartCol, numScenarios);

        // get list of chartRanges from excelStore
        // get all ranges that include 'ChartCopy' in the key
        const chartRanges = Object.keys(excelStore.getChartDataRanges).filter(
          (key) => key.includes("ChartCopy")
        );
        // console.log(`chart ranges... ${Object.keys(excelStore.getChartDataRanges)}`);

        // set range with scenario names
        const scenarioNamesRange =
          excelStore.getChartDataRanges.scnNameSource.rangeStart;

        chartRanges.forEach((_range, index) => {
          const srcRangeName = `${_range.split("ChartCopy")[0]}Source`;
          const srcRangeAddress =
            excelStore.getChartDataRanges[srcRangeName].rangeStart;
          // console.log(`NEW RANGE.... srcRangeAddress:`, srcRangeAddress);

          const numRowsPerRange = 3;
          const startRow = index * numRowsPerRange + 1;

          const titleRange = sheet.getRange(`A${startRow}:A${startRow + 1}`);
          // console.log(`titleRange:`, `A${startRow}:A${startRow + 1}`)
          const dataTitles = [
            [t("general.scenario", 1)],
            [excelStore.getChartDataRanges[srcRangeName].title],
          ];
          // console.log(`dataTitles:`, dataTitles)
          titleRange.values = dataTitles;

          const scenarioTitleRange = sheet.getRange(
            `${dataStartCol}${startRow}:${dataEndCol}${startRow}`
          );
          // console.log(`scenarioTitleRange:`, `${dataStartCol}${startRow}:${dataEndCol}${startRow}`)
          // console.log(`scenarioTitleRange formulas:`,`='${t('worksheets.scenariosSummary')}'!${scenarioNamesRange}`)
          scenarioTitleRange.formulas = `='${t(
            "worksheets.scenariosSummary"
          )}'!${scenarioNamesRange}`;

          const dataValsRange = sheet.getRange(
            `${dataStartCol}${startRow + 1}:${dataEndCol}${startRow + 1}`
          );
          // console.log(`dataValsRange:`, `${dataStartCol}${startRow + 1}:${dataEndCol}${startRow + 1}`)
          // console.log(`dataValsRange formulas:`,`='${t('worksheets.scenariosSummary')}'!${srcRangeAddress}`)
          dataValsRange.formulas = `='${t(
            "worksheets.scenariosSummary"
          )}'!${srcRangeAddress}`;

          // add range details to store object - store the range that contains the chart values
          excelStore.$patch((state) => {
            state.chartDataRanges[_range].range = `${dataStartCol}${
              startRow + 1
            }:${dataEndCol}${startRow + 1}`;
          });
          // hide worksheet
          sheet.visibility = Excel.SheetVisibility.hidden;
        });
      }).catch(function (error) {
        console.warn("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
          console.warn("Debug info: " + JSON.stringify(error.debugInfo));
        }
      });
    } else {
      console.warn(`Excel not found.`);
    }
  };

  const genSummaryCharts = async () => {
    if ("Excel" in window) {
      generateWorkbookMap().then(() => {
        // add/update scenario summary sheet
        window.Excel.run(async (context) => {
          const sheets = context.workbook.worksheets;
          let chartWorksheet = null;
          let dataWorksheet = null;
          // let range = null;
          let chart = null;
          // let newSeries = null;

          // todo make sheet id's dynamic
          const chartDataSheetId = "870003d3-3907-47e4-a340-3bf7d8f6980c";

          // check if worksheet exists already
          // todo set projectId in store with dynamic UUID
          const summaryChartId = "l2jb9901-d082-44a0-9027-ca82b105a1ea";
          let sheetChartId =
            summaryChartId in excelStore.workbookMap.summaryCharts
              ? excelStore.workbookMap.summaryCharts[summaryChartId].sheetId
              : null;
          let sheetDatatId =
            chartDataSheetId in excelStore.workbookMap.chartDataSheets
              ? excelStore.workbookMap.chartDataSheets[chartDataSheetId].sheetId
              : null;
          if (sheetChartId !== null) {
            chartWorksheet = context.workbook.worksheets.getItem(sheetChartId);
            dataWorksheet = context.workbook.worksheets.getItem(sheetDatatId);
          } else {
            const sheetTitle = genericUtils().getUniqueName(
              t("worksheets.chartsSummary"),
              excelStore.workbookMap.allSheets,
              null,
              25
            );
            chartWorksheet = sheets.add(sheetTitle);
            chartWorksheet.customProperties.add("ssg-type", "summaryChart");
            chartWorksheet.customProperties.add(
              "ssg-summaryChartId",
              summaryChartId
            );
            dataWorksheet = context.workbook.worksheets.getItem(sheetDatatId);
          }
          // sheet tab color
          chartWorksheet.tabColor = "#203564";
          chartWorksheet.showGridlines = false;
          // set any specific column widths
          setColumnWidths(chartWorksheet, columnWidths.summaryCharts);
          // set a title bar on the worksheet
          setSheetTitleBar(
            chartWorksheet,
            t("worksheets.chartsSummary"),
            scenarioSummaryCellFillFormatPrimary
          );

          // clear any existing charts
          // Get all the charts on the worksheet
          const charts = chartWorksheet.charts;
          // Delete all the charts
          charts.load("items");
          context
            .sync()
            .then(function () {
              charts.items.forEach(function (chart) {
                chart.delete();
              });
            })
            .then(context.sync)
            .then(async () => {
              // get list of chartRanges from excelStore
              const chartRanges = [
                // ordered list of charts to display on summary charts worksheet
                // only charts listed here will be displayed on worksheet
                // chart names should match the keys in useExcelStore().getChartDataRanges with the "Source" or "ChartCopy" substrings removed from the keys. Example, "transit" will refer to the collection of chartRanges ["transitSource", "transitPerHHSource", "transitChartCopy", "transitPerHHChartCopy"]
                "energy",
                "emissions",
                "serviceCapCost",
                "serviceOMCost",
                "infCapCost",
                "infOMCost",
                "devChrg",
                "taxes",
                "puv",
                "transit",
                "bike",
                "walk",
              ];
              const sheetStartRow = 5; // row where first chart should begin

              chartRanges.forEach((_range, index) => {
                // make 2 columns of charts: 1 for totals, one for per HH
                [
                  ["", "A", "C"], // [key substring, startCol, endCol]
                  ["PerHH", "D", "F"],
                ].forEach((chartTheme) => {
                  const startRowChart = sheetStartRow + index * 15;
                  const endRowChart = startRowChart + 14;

                  // add chart data
                  const chartRangeObj = `${_range}${chartTheme[0]}ChartCopy`;
                  // console.log(
                  //   `chart data... ${chartRangeObj}`,
                  //   excelStore.getChartDataRanges[chartRangeObj]
                  // );
                  const seriesRange = dataWorksheet.getRange(
                    excelStore.getChartDataRanges[chartRangeObj].range
                  );
                  chart = chartWorksheet.charts.add(
                    Excel.ChartType.columnClustered,
                    seriesRange,
                    Excel.ChartSeriesBy.columns
                  );

                  // clear automatic category names
                  const xaxis = chart.axes.getItem(
                    Excel.ChartAxisType.category
                  );
                  xaxis.setCategoryNames([""]);
                  // add scenario names
                  scenarioUtils().getScenarios.value.forEach(
                    (_scen, _index) => {
                      const series = chart.series.getItemAt(_index);
                      series.name = _scen.title;
                    }
                  );

                  // make charts values in thousands
                  chart.axes.valueAxis.displayUnit = "Thousands";
                  chart.axes.valueAxis.minimum = 0;

                  // get chart titles
                  const chartRangesObj =
                    excelStore.getChartDataRanges[
                      `${_range}${chartTheme[0]}Source`
                    ];
                  chart.title.text = chartRangesObj.title;
                  chart.axes.valueAxis.title.text = chartRangesObj.units;
                  chart.setPosition(
                    `${chartTheme[1]}${startRowChart}:${chartTheme[2]}${endRowChart}`
                  );
                  // add legend
                  chart.legend.position = Excel.ChartLegendPosition.right;
                });
              });

              // sync
              await context.sync();
              // update the workbook map
              generateWorkbookMap();
            })
            .catch(function (error) {
              console.warn("Error: " + error);
              if (error instanceof OfficeExtension.Error) {
                console.warn("Debug info: " + JSON.stringify(error.debugInfo));
              }
            });
        }).catch(function (error) {
          console.warn("Error: " + error);
          if (error instanceof OfficeExtension.Error) {
            console.warn("Debug info: " + JSON.stringify(error.debugInfo));
          }
        });
      });
    } else {
      console.warn(`Excel not found.`);
    }
  };

  return {
    workbookMap,
    generateWorkbookMap,
    workbookActionAddOrUpdate,
    saveScenarioToWorksheet,
    saveScenarioSummaries,
    createChartDataSheet,
    genSummaryCharts,
  };
}
