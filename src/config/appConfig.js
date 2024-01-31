/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * high level generic app settings
 */

export default function appConfig() {
  const startYear = 2023;
  const endYear = 2050;
  const latestIntroAvailable = "1.0.0 Beta";

  /**
   * gets an array of years ranging from the app start year to the app end year
   * @param {Integer|String} startAt - the start year to begin the years array with. Default = app config startYear
   * @returns an array of all years from startAt to the app config endYear
   */
  const getYearsArray = (startAt = startYear) => {
    let arr = [];
    for (let i = parseInt(startAt); i <= endYear; arr.push(i++));
    return arr;
  };

  /**
   * gets an array of years represented as strings ranging from the app start year to the app end year
   * @param {Integer|String} startAt - the start year to begin the years array with. Default = app config startYear
   * @returns an array of all years in string format from startAt to the app config endYear
   */
  const getYearsArrayAsStrings = (startAt = startYear) => {
    let arr = [];
    for (let i = parseInt(startAt); i <= endYear; arr.push((i++).toString()));
    return arr;
  };

  return {
    startYear,
    endYear,
    getYearsArray,
    getYearsArrayAsStrings,
    latestIntroAvailable,
  };
}
