import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Question, QuestionTag } from '../types/question';

const QUESTIONS_COLLECTION = 'questions';
const TAGS_COLLECTION = 'questionTags';

// Add supplier questionnaire tags
const supplierTags: Omit<QuestionTag, 'id'>[] = [
  {
    name: 'Tier 1',
    color: '#2563EB',
    description: 'Direct supplier information'
  },
  {
    name: 'Tier 2',
    color: '#7C3AED',
    description: 'Factory information'
  },
  {
    name: 'Tier 3',
    color: '#059669',
    description: 'Material and packaging supplier information'
  },
  {
    name: 'Tier 4',
    color: '#DC2626',
    description: 'Sub-supplier information'
  },
  {
    name: 'Packaging Supplier Details',
    color: '#0891B2',
    description: 'Specific packaging supplier information'
  },
  {
    name: 'Material Supplier Details',
    color: '#D97706',
    description: 'Specific material supplier information'
  },
  {
    name: 'Supplier 1 Details',
    color: '#4B5563',
    description: 'Specific supplier information'
  }
];

// Complete list of supplier questions
const supplierQuestions: Omit<Question, 'id'>[] = [
  // Tier 1 Questions
  {
    text: 'Vendor Number',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Vendor English Name',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'English Address',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Vendor Local Name',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Local Address',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'City',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Region',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Province',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Country',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Postal Code',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 9,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Vendor Classification',
    type: 'multipleChoice',
    options: ['Factory'],
    tags: ['Tier 1'],
    required: true,
    order: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Vendor Type',
    type: 'multipleChoice',
    options: ['Inline'],
    tags: ['Tier 1'],
    required: true,
    order: 11,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Telephone',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Fax',
    type: 'text',
    tags: ['Tier 1'],
    required: false,
    order: 13,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'PO Email',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 14,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Website Address',
    type: 'text',
    tags: ['Tier 1'],
    required: false,
    order: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Business Reg.#',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 16,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Document Completed by (Name)',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 17,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Position',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Telephone No.',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 19,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Mobile No.',
    type: 'text',
    tags: ['Tier 1'],
    required: false,
    order: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Fax No.',
    type: 'text',
    tags: ['Tier 1'],
    required: false,
    order: 21,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Email',
    type: 'text',
    tags: ['Tier 1'],
    required: true,
    order: 22,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Tier 2 Questions
  {
    text: 'Factory Number',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 23,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Factory English Name',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 24,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Factory English Address',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Factory Local Name',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 26,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Factory Local Address',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 27,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'City',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Region',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 29,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Province',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Country',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 31,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Postal Code',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 32,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Telephone',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 33,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Fax',
    type: 'text',
    tags: ['Tier 2'],
    required: false,
    order: 34,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Email',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 35,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Port Of Loading (Ocean)',
    type: 'text',
    tags: ['Tier 2'],
    required: false,
    order: 36,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Port Of Loading (Air)',
    type: 'text',
    tags: ['Tier 2'],
    required: false,
    order: 37,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Business Reg.#',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 38,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Inspection address',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 39,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Last Audit Type',
    type: 'multipleChoice',
    options: [
      'BSCI by Amfori - Grade C or better',
      'SMETA by SEDEX – 4 Pillar Only',
      'SA8000 by SAI',
      'Better Work by ILO (International Labor Organization) – apparel only',
      'WRAP (Worldwide Responsible Accredited Production) – apparel, footwear, and sewn products sectors',
      'WCA (Workplace Conditions Assessment) by Intertek',
      'ERSA (Ethical Responsible Sourcing Assessment) by LRQA'
    ],
    tags: ['Tier 2'],
    required: true,
    order: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Last Audit Date',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 41,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Document Completed by (Name)',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 42,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Position',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 43,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Telephone No.',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 44,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Mobile No.',
    type: 'text',
    tags: ['Tier 2'],
    required: false,
    order: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Fax No.',
    type: 'text',
    tags: ['Tier 2'],
    required: false,
    order: 46,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: 'Email',
    type: 'text',
    tags: ['Tier 2'],
    required: true,
    order: 47,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Tier 3 - Packaging Supplier Questions
  {
    text: 'Packaging Type',
    type: 'multipleChoice',
    options: [
      'Primary Packaging (Including: bottles, containers, cans, tubes, and jars containing liquid or solid products, Flexible Polybags and Pouches, Gift Boxes)',
      'Secondary Packaging (Including: carton, cardboard, corrugated, plastic and rigid boxes, shrink wrap/sleeves, multipacks, protective packaging)',
      'Labels and Tags (Including: hangtag and woven labels)'
    ],
    tags: ['Tier 3', 'Packaging Supplier Details'],
    required: true,
    order: 48,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const addQuestion = async (question: Omit<Question, 'id'>): Promise<void> => {
  try {
    const questionData = {
      ...question,
      createdAt: Timestamp.fromDate(question.createdAt),
      updatedAt: Timestamp.fromDate(question.updatedAt)
    };
    await addDoc(collection(db, QUESTIONS_COLLECTION), questionData);
  } catch (error) {
    console.error('Error adding question:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add question');
  }
};

export const addTag = async (tag: QuestionTag): Promise<void> => {
  try {
    await addDoc(collection(db, TAGS_COLLECTION), tag);
  } catch (error) {
    console.error('Error adding tag:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add tag');
  }
};

export const getTags = async (): Promise<QuestionTag[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, TAGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuestionTag));
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tags');
  }
};

export const getQuestions = async (): Promise<Question[]> => {
  try {
    const q = query(collection(db, QUESTIONS_COLLECTION), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Question));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch questions');
  }
};

export const initializeQuestions = async (): Promise<void> => {
  try {
    const snapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    if (snapshot.empty) {
      await initializeSupplierQuestions();
    }
  } catch (error) {
    console.error('Error initializing questions:', error);
    throw error;
  }
};

export const initializeSupplierQuestions = async (): Promise<void> => {
  try {
    // First add all tags
    for (const tag of supplierTags) {
      const tagSnapshot = await getDocs(
        query(collection(db, TAGS_COLLECTION))
      );
      const existingTag = tagSnapshot.docs.find(
        doc => doc.data().name === tag.name
      );
      
      if (!existingTag) {
        await addDoc(collection(db, TAGS_COLLECTION), tag);
      }
    }

    // Then add all questions
    for (const question of supplierQuestions) {
      // Get tag IDs
      const tagSnapshot = await getDocs(collection(db, TAGS_COLLECTION));
      const tagMap = new Map<string, string>();
      tagSnapshot.docs.forEach(doc => {
        tagMap.set(doc.data().name, doc.id);
      });

      // Map tag names to IDs
      const tagIds = question.tags.map(tagName => tagMap.get(tagName) || '').filter(Boolean);

      const questionData = {
        ...question,
        tags: tagIds,
        createdAt: Timestamp.fromDate(question.createdAt),
        updatedAt: Timestamp.fromDate(question.updatedAt)
      };

      await addDoc(collection(db, QUESTIONS_COLLECTION), questionData);
    }

    console.log('Supplier questions and tags initialized successfully');
  } catch (error) {
    console.error('Error initializing supplier questions:', error);
    throw error;
  }
};