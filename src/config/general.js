// © Copyright 2023, LUIC-CIUT's Contributors
// list of neighbourhood types and associated config details
export default function generalTypesConfig() {
  const general = {
    /**
     * general attributes
     *
     * example attribute definition

     childPerPerson: {
      id: "childPerPerson", // id - same as key
      name: "Children per Person", // user friendly name
      description: `number of children per person in the neighbourhood`,
      value: 123, // number of people per building type
      globalReferences: {
        // the following objects can be used to describe model logic and assumptions behind each sector.
        // If there is no notable description or logic to be used, leave the object empty (like the revenue example below)
        description: `This text can be used to describe the assumptions and logic behind the inputs and defaults for the BUILDINGS section.`,
        references: [
          // OPTIONAL list of references in the form of ["text", "https://my.link.com"]. Link is optional for each reference.
          ["this is a reference with a link", "https://ssg.coop"],
          ["this is a reference with text only and no link"],
        ]
        },
     },
    */
    childPerHousehold: {
      id: "childPerHousehold", // id - same as key
      name: "Children per Household", // common name
      description: `Number of children per household in the neighbourhood`,
      value: 0.29,
      references: [
        [
          "Statistics Canada - Profile table, Census Profile, 2021 Census of Population - Canada [Country]",
          "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&SearchText=Canada&DGUIDlist=2021A000011124&GENDERlist=1,2,3&STATISTIClist=1&HEADERlist=0",
        ],
      ],
    },

    personPerHousehold: {
      id: "personPerHousehold", // id - same as key
      name: "Person per Household", // common name
      description: `Number of people per household in the neighbourhood`,
      value: 2.4,
      references: [
        [
          "Statistics Canada - Profile table, Census Profile, 2021 Census of Population - Canada [Country]",
          "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&SearchText=Canada&DGUIDlist=2021A000011124&GENDERlist=1,2,3&STATISTIClist=1&HEADERlist=0",
        ],
      ],
    },
  };

  return {
    general,
  };
}
