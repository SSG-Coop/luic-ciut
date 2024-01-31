/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * generic excel utilities for interacting with excel
 */

/** *******************************************
 * GENERIC EXCEL UTILS
 * *******************************************
 */

/**
 * sets all borders on a range to the same style setting
 * @param {Object} range - excel Range object
 * @param {String} style - excel Range borderStyle https://docs.microsoft.com/en-us/javascript/api/excel/excel.rangeborder?view=excel-js-preview
 */
const setAllBordersForRange = (range, style) => {
  if (Array.isArray(style)) {
    // separate borders defined
    const _borders = [
      "EdgeTop",
      "EdgeRight",
      "EdgeBottom",
      "EdgeLeft",
      "InsideHorizontal",
      "InsideVertical",
    ];
    _borders.forEach((_border, index) => {
      range.format.borders.getItem(_border).style = style[index];
    });
  } else {
    // all borders get the same treatment
    range.format.borders.getItem("EdgeTop").style = style;
    range.format.borders.getItem("EdgeRight").style = style;
    range.format.borders.getItem("EdgeBottom").style = style;
    range.format.borders.getItem("EdgeLeft").style = style;
    range.format.borders.getItem("InsideHorizontal").style = style;
    range.format.borders.getItem("InsideVertical").style = style;
  }
};

/**
 * sets some basic formatting on a range
 * @param {Object} range - excel Range object
 * @param {[String]} options - list of options
 */
const formatRange = (range, options) => {
  // font formatting
  if (Object.keys(options).includes("font")) {
    if (options.font.includes("bold")) {
      range.format.font.bold = true;
    }
    if (options.font.includes("italic")) {
      range.format.font.italic = true;
    }
    // size
    const sizeOpts = options.font.filter((opt) => opt.startsWith("size-"));
    if (sizeOpts.length) {
      range.format.font.size = parseInt(sizeOpts[0].split("-")[1]);
    }
    // color - hex
    const colorOpts = options.font.filter((opt) => opt.startsWith("#"));
    if (colorOpts.length) {
      range.format.font.color = colorOpts[0];
    }
  }
  // borders
  if (Object.keys(options).includes("borders")) {
    setAllBordersForRange(range, options.borders);
  }
  // fill
  if (Object.keys(options).includes("fill")) {
    range.format.fill.color = options.fill;
  }
  // horizontalAlignment
  if (Object.keys(options).includes("horizontalAlignment")) {
    range.format.horizontalAlignment = options.horizontalAlignment;
  }
  // verticalAlignment
  if (Object.keys(options).includes("verticalAlignment")) {
    range.format.verticalAlignment = options.verticalAlignment;
  }
  // number formatting
  if (Object.keys(options).includes("numberFormat")) {
    range.numberFormat = [[options.numberFormat]];
  }
};

/**
 * determines the next column based on the input column
 * @param {String} col - the excel column name (examples: "A", "B", or "AA")
 * @returns excel column name for the next column
 */
const nextCol = (col) => {
  if (!col) return "A"; // return 'A' if col is empty or null

  let tail = "";
  let i = col.length - 1;
  let char = col[i];
  // find the index of the first character from the right that is not a 'Z'
  while (char === "Z" && i > 0) {
    i--;
    char = col[i];
    tail = "A" + tail; // tail contains a string of 'A'
  }
  if (char === "Z")
    // the string was made only of 'Z'
    return "AA" + tail;
  // increment the character that was not a 'Z'
  return col.slice(0, i) + String.fromCharCode(char.charCodeAt(0) + 1) + tail;
};

/**
 * gets the last column name in a range when given the start column and the number of columns
 * @param {String} startCol - the column to start at (example: "B")
 * @param {Integer} numCols - how many cols in the range
 * @returns the column name for the last column in the described range
 */
const endCol = (startCol, numCols) => {
  let index = 1;
  let endCol = startCol;
  while (index < numCols) {
    endCol = nextCol(endCol);
    index += 1;
  }
  return endCol;
}

/**
 * get a dynamic range based on a start position, offset, number of rows and number of columns
 * @param {String} startPos - cell address of start position (example "A1")
 * @param {Number} offset - how many rows to offset the range by
 * @param {Number} rows - how many rows in the range
 * @param {Number} cols - how many cols
 * @returns range address as a string
 */
const getDynamicRange = (startPos, offset = 1, rows = 1, cols = 1) => {
  const startRowStr = startPos.match(/\d+/).shift();
  const startRow = parseInt(startRowStr) + offset;
  const endRow = startRow + rows - 1;
  const startCol = startPos.replace(startRowStr, "");
  let endCol = startCol;
  while (cols > 1) {
    endCol = nextCol(endCol);
    cols = cols - 1;
  }
  const address = `${startCol}${startRow}:${endCol}${endRow}`;
  return address;
};

/**
 * converts a js date to an excel serial date
 * from https://stackoverflow.com/a/70840742
 * @param {Date} jsDate - input date in js date type to convert to serial date
 * @returns date in excel serial date format
 */
const JSDateToExcelDate = (jsDate) => {
  return (
    25569.0 +
    (jsDate.getTime() - jsDate.getTimezoneOffset() * 60 * 1000) /
      (1000 * 60 * 60 * 24)
  );
};

/**
 * converts an excel serial date to js date
 * from https://stackoverflow.com/a/67130235
 * @param {Date} excelSerialDate - date in excel serial date format
 * @returns date in js date type format
 */
// const SerialDateToJSDate = (excelSerialDate) => {
//   return new Date(Date.UTC(0, 0, excelSerialDate - 1));
// }

export {
    setAllBordersForRange,
    formatRange,
    nextCol,
    endCol,
    getDynamicRange,
    JSDateToExcelDate,
}