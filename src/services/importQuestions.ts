import { collection, addDoc, getDocs, query, where, Timestamp, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { importedQuestions, importedSections } from './importedQuestions';
import type { Question, QuestionSection, QuestionTag, QuestionGroup } from '../types/question';

const QUESTION_COLLECTIONS = 'questionCollections';
const QUESTIONS_COLLECTION = 'questions';
const SECTIONS_COLLECTION = 'questionSections';
const TAGS_COLLECTION = 'questionTags';
const GROUPS_COLLECTION = 'questionGroups';

export const processExcelFile = async (
  file: File,
  tags: QuestionTag[],
  sections: QuestionSection[],
  setProgress: (progress: number) => void,
  fileUnderstanding: any | null
): Promise<Question[]> => {
  // For now, we'll return our pre-defined questions since we're manually importing from a screenshot
  setProgress(100);
  return importedQuestions.map(q => ({
    ...q,
    id: '', // ID will be assigned by Firestore
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

export const importQuestionsFromSpreadsheet = async (): Promise<string> => {
  try {
    // Create a new question collection
    const collectionData = {
      name: `Question Collection ${new Date().toISOString()}`,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const collectionRef = await addDoc(collection(db, QUESTION_COLLECTIONS), collectionData);
    const collectionId = collectionRef.id;

    // First add all sections under this collection
    const sectionIds = new Map<string, string>();
    for (const section of importedSections) {
      const sectionRef = collection(collectionRef, SECTIONS_COLLECTION);
      const docRef = await addDoc(sectionRef, section);
      sectionIds.set(section.name, docRef.id);
    }

    // Get all tags and create a map of tag names to IDs
    const tagSnapshot = await getDocs(collection(db, TAGS_COLLECTION));
    const tagIds = new Map<string, string>();
    tagSnapshot.docs.forEach(doc => {
      const tagData = doc.data();
      tagIds.set(tagData.name, doc.id);
    });

    // Create question groups based on sections and tiers under this collection
    const groupIds = new Map<string, string>();
    for (const section of importedSections) {
      // Create a group for each tier that has questions in this section
      const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
      for (const tier of tiers) {
        const questionsInTierAndSection = importedQuestions.filter(q => 
          q.tags.includes(tier) && q.sectionId === section.name
        );

        if (questionsInTierAndSection.length > 0) {
          const group: Omit<QuestionGroup, 'id'> = {
            name: `${section.name} - ${tier}`,
            description: `${section.description} (${tier})`,
            tier: tier as "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4",
            category: section.name,
            order: section.order,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const groupRef = collection(collectionRef, GROUPS_COLLECTION);
          const newGroupRef = await addDoc(groupRef, group);
          groupIds.set(`${section.name}-${tier}`, newGroupRef.id);
        }
      }
    }

    // Add questions to their respective groups under this collection
    for (const question of importedQuestions) {
      // Get the tier tag from the question
      const tier = question.tags.find(tag => tag.startsWith('Tier '));
      if (tier && question.sectionId) {
        const groupId = groupIds.get(`${question.sectionId}-${tier}`);
        if (groupId) {
          // Map tag names to tag IDs
          const questionTagIds = question.tags
            .map(tagName => tagIds.get(tagName))
            .filter((id): id is string => id !== undefined);

          const questionData = {
            ...question,
            tags: questionTagIds,
            sectionId: sectionIds.get(question.sectionId),
            createdAt: Timestamp.fromDate(question.createdAt),
            updatedAt: Timestamp.fromDate(question.updatedAt)
          };

          // Add question to the group's questions subcollection
          const groupRef = doc(collectionRef, GROUPS_COLLECTION, groupId);
          const questionRef = collection(groupRef, QUESTIONS_COLLECTION);
          await addDoc(questionRef, questionData);
        }
      }
    }

    console.log('Questions imported successfully from spreadsheet');
    return collectionId;
  } catch (error) {
    console.error('Error importing questions from spreadsheet:', error);
    throw error;
  }
};
