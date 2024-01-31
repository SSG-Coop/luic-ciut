/**
 * © Copyright 2023, LUIC-CIUT's Contributors
 * generic utilities for managing arrays and objects
 */

export default function genericUtils() {
  /**
   * returns an Object whose keys are regular Objects as an Array of objects, optionally filtered to a list of keys
   * Returned Objects are sorted alphabetically if they contain a 'name' key
   * @param {[String]} keys - an array of energySource id's (strings) to filter the list to
   * @returns an array of energySource objects
   */
  const getObjectKeysAsArray = (Obj, keys = null) => {
    if (keys !== null && !Array.isArray(keys)) {
      console.warn("filter keys not passed as an array to getObjectKeysArray");
    }
    const keysArray =
      keys !== null ? keys.map((_key) => Obj[_key]) : Object.values(Obj);
    return "name" in keysArray[0]
      ? keysArray.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      : keysArray;
  };

  /**
   * resolves a string representation of a path in an Object and returns the value at that path.
   * Objects can be nested and may contain arrays.
   * Thanks to https://stackoverflow.com/a/43849204 for this nice bit of code
   * @param {Object} object - object being referenced
   * @param {String} path - the string representation of the path (example: myObj.nestedObj.anotherOb[0].value)
   * @param {*} defaultValue - default value to return
   * @returns value at the specified path location in the object
   */
  const resolveObjPath = (object, path, defaultValue) =>
    path
      .split(/[.[\]'"]/)
      .filter((p) => p)
      .reduce((o, p) => o?.[p] ?? defaultValue, object);
  // .reduce((o, p) => (o ? o[p] : defaultValue), object);

  /**
   * finds a unique name given a proposed name and a list of existing names. If the name already exists, an incremental number is automatically appended before the delimiter
   * @param {String} newName - the proposed name
   * @param {[String]} nameCollection - array of existing names to test against
   * @param {String} delimiter - the delimiter/ending of the string to keep constant (example, a file extension like '.jpg', or a worksheet attribute like '(Action)')
   * @param {Int} maxLength - the max number of characters the returned name can be, including the delimiter
   * @returns a unique name as a string
   */

  const getUniqueName = (newName, nameCollection, delimiter = null, maxLength = 0) => {
    let uniqueName = newName;

    let originalName = delimiter !== null ? newName.split(delimiter)[0] : newName;
    // trim if the name is too long
    if (maxLength > 0 && uniqueName.length > maxLength) {
      const charsToTrim = uniqueName.length - maxLength;
      originalName = originalName.slice(0, -charsToTrim);
      uniqueName = delimiter !== null ? `${originalName}${delimiter}` : `${originalName}`;
    }

    // test if name is unique
    let i = 1;
    while (nameCollection.includes(uniqueName)) {
      // if not unique, append number increment before the delimiter
      uniqueName = delimiter !== null ? `${originalName} (${i})${delimiter}` : `${originalName} (${i})`;
      i++;
    }
    return uniqueName;
  };

  /**
   * generates an image url for an image in the /assets folder
   * @param {string} name filename for the image
   * @returns full path to image for use in app
   */
  const getImageUrl = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
  };

  return { getObjectKeysAsArray, resolveObjPath, getUniqueName, getImageUrl };
}
