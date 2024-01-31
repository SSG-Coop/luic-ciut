// © Copyright 2023, LUIC-CIUT's Contributors
// composition functions using neighbourhoodTypes config data
import neighbourhoodTypesConfig from "@/config/neighbourhoodTypes.js";

export default function useNeigbhourhoodTypeUtils() {

    /**
     * gets references for a single neighbourhoodType based on neighbourhoodType ID
     * @param {String} neighourhoodType - the neighbourhoodType ID to lookup references for
     * @param {String} sector - optional - the sector to get references for. If null, references for all sectors will be returned
     * @returns {Object} - a references object containing a description and optional array of references
     */
    const getReferencesForNeighbourhoodType = (neighourhoodType, sector=null) => {
        const allRefs = 'sectorReferences' in neighbourhoodTypesConfig().neighbourhoods[neighourhoodType] ? neighbourhoodTypesConfig().neighbourhoods[neighourhoodType].sectorReferences : {};
        if (sector !== null) {
            const sectorRefs = sector in allRefs ? allRefs[sector] : {};
            return sectorRefs;
        }
        return allRefs;
    }

  return {
    getReferencesForNeighbourhoodType,
  };
}
