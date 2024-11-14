import { Question, QuestionSection, QuestionTag } from '../types/question';

export const importedSections: Omit<QuestionSection, 'id'>[] = [
  {
    name: "Supplier 1 Details",
    description: "Coating, finishing, processing aid supplier information",
    order: 7
  },
  {
    name: "Supplier 1 Contact",
    description: "Coating, finishing, processing aid supplier contact information",
    order: 8
  },
  {
    name: "Supplier 1 Compliance",
    description: "Coating, finishing, processing aid supplier compliance information",
    order: 9
  }
];

export const importedQuestions: Omit<Question, 'id'>[] = [
  // Tier 1 - Supplier 1 Compliance
  {
    text: "Do you have a documented Environmental Management System (EMS)?",
    type: "yesNo",
    tags: ["Tier 1"],
    required: true,
    sectionId: "Supplier 1 Compliance",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Is your Environmental Management System (EMS) certified to ISO 14001?",
    type: "yesNo",
    tags: ["Tier 1"],
    required: true,
    sectionId: "Supplier 1 Compliance",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Do you have a documented Quality Management System (QMS)?",
    type: "yesNo",
    tags: ["Tier 1"],
    required: true,
    sectionId: "Supplier 1 Compliance",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Is your Quality Management System (QMS) certified to ISO 9001?",
    type: "yesNo",
    tags: ["Tier 1"],
    required: true,
    sectionId: "Supplier 1 Compliance",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Do you have a documented Health and Safety Management System?",
    type: "yesNo",
    tags: ["Tier 1"],
    required: true,
    sectionId: "Supplier 1 Compliance",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Tier 4 - Supplier 1 Details
  {
    text: "Coating, Finishing, and Processing Aid",
    type: "multipleChoice",
    tags: ["Tier 4"],
    required: true,
    options: [
      "Coatings (Including paint, varnishes, stains, lacquers, powder coatings, specialty coatings such as UV-Resistant Coatings or Fire-Retardant Coatings)",
      "Finishing Techniques (Including Surface Treatments, Plating, Anodizing (for aluminum), Laser Finishing, Etching, Printing Finishes, Textile Finishing (dyeing, waterproofing, and wrinkle resistance)",
      "Processing Aids (Including Lubricants, Release Agents, Additives, Surfactants, Thickeners, Foaming Agents, Filler Materials)",
      "Sealants and Adhesives",
      "Protective Films and Barriers (Including Shrink Films, Protective Laminates, and Barrier Coatings (for moisture, gas)",
      "Functional Coatings with Special Features (Including Functional Coatings)"
    ],
    sectionId: "Supplier 1 Details",
    order: 91,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Factory Number",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 92,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Factory English Name",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 93,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Factory English Address",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 94,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Factory Local Name",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 95,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Factory Local Address",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 96,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "City",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 97,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Region",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 98,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Province",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 99,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Country",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Postal Code",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 101,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Telephone",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 102,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Fax",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 103,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Email",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 104,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Port Of Loading (Ocean)",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 105,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Port Of Loading (Air)",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 106,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Business Reg.#",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 107,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Inspection address",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 108,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Last Audit Type",
    type: "multipleChoice",
    tags: ["Tier 4"],
    required: true,
    options: [
      "BSCI by Amfori - Grade C or better",
      "SMETA by SEDEX - 4 Pillar Only",
      "SA8000 by SAI",
      "Better Work by ILO (International Labor Organization) - apparel only",
      "WRAP (Worldwide Responsible Accredited Production) - apparel, footwear, and sewn products sectors",
      "WCA (Workplace Conditions Assessment) by Intertek",
      "ERSA (Ethical Responsible Sourcing Assessment) by LRQA"
    ],
    sectionId: "Supplier 1 Details",
    order: 109,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Last Audit Date",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Details",
    order: 110,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Tier 4 - Supplier 1 Contact
  {
    text: "Document Completed by (Name)",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 111,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Position",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 112,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Telephone No.",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 113,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Mobile No.",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 114,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Fax No.",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 115,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "Email",
    type: "text",
    tags: ["Tier 4"],
    required: true,
    sectionId: "Supplier 1 Contact",
    order: 116,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const initializeImportedQuestions = async (): Promise<void> => {
  try {
    // First add sections
    for (const section of importedSections) {
      // Add section logic here
    }

    // Then add questions
    for (const question of importedQuestions) {
      // Add question logic here
    }

    console.log('Imported questions initialized successfully');
  } catch (error) {
    console.error('Error initializing imported questions:', error);
    throw error;
  }
};
