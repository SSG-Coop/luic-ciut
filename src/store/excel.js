// © Copyright 2023, LUIC-CIUT's Contributors
// excel worksheet mapping state storage
import { defineStore } from "pinia";
// import i18n from "@/plugins/i18n";
// const t = i18n.global.t;

export const useExcelStore = defineStore({
  id: "excel",
  state: () => ({
    workbookMap: {
      // to store the workbook map that tracks scenarios, scenarios, worksheets and associated meta info and id's specific to the current Excel file
      sheets: {},
      summaryTables: {},
      chartDataSheets: {},
      summaryCharts: {},
      scenarios: {},
      allSheets: [],
      /** EXAMPLE WORKBOOK MAP:
     {
       sheets: {                                                    // list of all ssg sheets in the current workbook -- determined by whether or not a sheet contains customProperties set with "ssg-type"
         "{54b3bfc0-d0fe-4d2b-8394-1c448c256542}": {                // the excel sheet id (changes between file loads - in the form of a string "{uuid-number-inside-curly-brackets}")
           name: "Neighbourhood Summary",                           // excel sheet name
           type: "summaryTable",                                   // ssg sheet type
           summaryTableId: "ep28d901-d082-44a0-9027-ca82b105a1ea", // summaryTables id if type is summaryTables
         },
         "{c40ec434-95aa-4efb-85db-da91980b1e54}": {                // the excel sheet id (changes between file loads - in the form of a string "{uuid-number-inside-curly-brackets}")
           name: "Chart Data",                                      // excel sheet name
           type: "chartDataSheet",                                       // ssg sheet type
           chartDataSheetId: "870003d3-3907-47e4-a340-3bf7d8f6980c",     // chartData sheet id if type is chartData
         },
         "{h3dcb02f-d0fe-4d2b-8394-1c448c255167}": {                // the excel sheet id (changes between file loads - in the form of a string "{uuid-number-inside-curly-brackets}")
           name: "Summary Charts",                                  // excel sheet name
           type: "summaryChart",                                   // ssg sheet type
           summaryChartId: "l2jb9901-d082-44a0-9027-ca82b105a1ea", // summaryCharts id if type is summaryCharts
         },
         "{95b3bfc0-d0fe-4d2b-8394-1c448c255976}": {                // the excel sheet id (changes between file loads - in the form of a string "{uuid-number-inside-curly-brackets}")
           name: "my scenario name",                                // excel sheet name
           type: "scenario",                                        // ssg sheet type
           scenarioId: "b0f3d901-d082-44a0-9027-ca82b105a1ea",      // scenario id if type is scenario
         },
         "{b0dcb02f-972c-4d5a-b85e-c28e5f3fec59}": {
           name: "another scenario name",
           type: "scenario",
           scenarioId: "f67ba815-a440-4d1f-836b-29285b61ce81",      // scenario id if type is scenario
         },
       },
       summaryTables: {                                             // list of all summaryTables identified in current workbook and their corresponding sheets. Determined by analyzing sheets in workbook -- NOT by analyzing the scenariosStore or online database
         "ep28d901-d082-44a0-9027-ca82b105a1ea": {                  // the scenario id
           sheetId: "{54b3bfc0-d0fe-4d2b-8394-1c448c256542}",       // corresponding sheet id
         },
       },
       chartDataSheets: {                                             // list of all summaryCharts identified in current workbook and their corresponding sheets. Determined by analyzing sheets in workbook -- NOT by analyzing the scenariosStore or online database
         "870003d3-3907-47e4-a340-3bf7d8f6980c": {                  // the scenario id
           sheetId: "{c40ec434-95aa-4efb-85db-da91980b1e54}",       // corresponding sheet id
         },
       },
       summaryCharts: {                                             // list of all summaryCharts identified in current workbook and their corresponding sheets. Determined by analyzing sheets in workbook -- NOT by analyzing the scenariosStore or online database
         "l2jb9901-d082-44a0-9027-ca82b105a1ea": {                  // the scenario id
           sheetId: "{h3dcb02f-d0fe-4d2b-8394-1c448c255167}",       // corresponding sheet id
         },
       },
       scenarios: {                                                 // list of all scenarios identified in current workbook and their corresponding sheets. Determined by analyzing sheets in workbook -- NOT by analyzing the scenariosStore or online database
         "b0f3d901-d082-44a0-9027-ca82b105a1ea": {                  // the scenario id
           sheetId: "{95b3bfc0-d0fe-4d2b-8394-1c448c255976}",       // corresponding sheet id
         },
         "f67ba815-a440-4d1f-836b-29285b61ce81": {                  // the scenario id
           sheetId: "{b0dcb02f-972c-4d5a-b85e-c28e5f3fec59}",       // corresponding sheet id
         },
       },
       allSheets: [                                                 // list of all sheets as sheet names (ssg and otherwise) in current workbook
          "Neighbourhood Summary",
          "Summary Charts",
          "my scenario name",
          "another scenario name",
          "some other worksheet that the user created",
       ],
     }
     */
    },
    chartDataRanges: {
      // to track ranges for chart data
    },
  }),
  getters: {
    getWorkbookMap() {
      return this.workbookMap;
    },
    getChartDataRanges() {
      return this.chartDataRanges;
    },
  },
});
