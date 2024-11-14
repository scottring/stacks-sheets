import { collection, addDoc, getDocs, query, orderBy, Timestamp, writeBatch, doc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Question, QuestionTag, QuestionGroup } from '../types/question';
import { importQuestionsFromSpreadsheet } from './importQuestions';

const QUESTION_COLLECTIONS = 'questionCollections';
const QUESTIONS_COLLECTION = 'questions';
const TAGS_COLLECTION = 'questionTags';
const SECTIONS_COLLECTION = 'questionSections';
const GROUPS_COLLECTION = 'questionGroups';

// Add supplier questionnaire tags
const supplierTags: Omit<QuestionTag, 'id'>[] = [
  {
    name: 'Tier 1',
    color: '#2563EB',
    description: 'Highest priority tier'
  },
  {
    name: 'Tier 2',
    color: '#7C3AED',
    description: 'High priority tier'
  },
  {
    name: 'Tier 3',
    color: '#059669',
    description: 'Medium priority tier'
  },
  {
    name: 'Tier 4',
    color: '#96CEB4',
    description: 'Standard priority tier'
  }
];

export const addQuestion = async (question: Omit<Question, 'id'>, collectionId: string, groupId?: string): Promise<void> => {
  try {
    const questionData = {
      ...question,
      createdAt: Timestamp.fromDate(question.createdAt),
      updatedAt: Timestamp.fromDate(question.updatedAt)
    };

    const collectionRef = doc(db, QUESTION_COLLECTIONS, collectionId);

    if (groupId) {
      const groupRef = doc(collectionRef, GROUPS_COLLECTION, groupId);
      const questionRef = collection(groupRef, QUESTIONS_COLLECTION);
      await addDoc(questionRef, questionData);
    } else {
      const questionRef = collection(collectionRef, QUESTIONS_COLLECTION);
      await addDoc(questionRef, questionData);
    }
  } catch (error) {
    console.error('Error adding question:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add question');
  }
};

export const addQuestionGroup = async (group: Omit<QuestionGroup, 'id'>, collectionId: string): Promise<string> => {
  try {
    const groupData = {
      ...group,
      createdAt: Timestamp.fromDate(group.createdAt),
      updatedAt: Timestamp.fromDate(group.updatedAt)
    };

    const collectionRef = doc(db, QUESTION_COLLECTIONS, collectionId);
    const groupRef = collection(collectionRef, GROUPS_COLLECTION);
    const docRef = await addDoc(groupRef, groupData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question group:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add question group');
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

export const getQuestions = async (collectionId: string, groupId?: string, filterTags?: string[]): Promise<Question[]> => {
  try {
    let querySnapshot;
    const collectionRef = doc(db, QUESTION_COLLECTIONS, collectionId);

    if (groupId) {
      const groupRef = doc(collectionRef, GROUPS_COLLECTION, groupId);
      const questionRef = collection(groupRef, QUESTIONS_COLLECTION);
      const q = query(questionRef, orderBy('order', 'asc'));
      querySnapshot = await getDocs(q);
    } else {
      const questionRef = collection(collectionRef, QUESTIONS_COLLECTION);
      const q = query(questionRef, orderBy('order', 'asc'));
      querySnapshot = await getDocs(q);
    }

    let questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Question));

    // Filter by tags if provided
    if (filterTags && filterTags.length > 0) {
      questions = questions.filter(question => 
        filterTags.every(tagId => question.tags.includes(tagId))
      );
    }

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch questions');
  }
};

export const getQuestionGroups = async (collectionId: string, tier?: string): Promise<QuestionGroup[]> => {
  try {
    const collectionRef = doc(db, QUESTION_COLLECTIONS, collectionId);
    const groupRef = collection(collectionRef, GROUPS_COLLECTION);
    
    let q;
    if (tier) {
      q = query(groupRef, where('tier', '==', tier), orderBy('order', 'asc'));
    } else {
      q = query(groupRef, orderBy('order', 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as QuestionGroup));
  } catch (error) {
    console.error('Error fetching question groups:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch question groups');
  }
};

export const getQuestionCollections = async (): Promise<{ id: string; name: string; createdAt: Date; updatedAt: Date; }[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, QUESTION_COLLECTIONS), orderBy('createdAt', 'desc')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || `Collection ${doc.id}`,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching question collections:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch question collections');
  }
};

export const deleteAllData = async (): Promise<void> => {
  try {
    // Delete all question collections and their contents
    const collectionSnapshot = await getDocs(collection(db, QUESTION_COLLECTIONS));
    const batch = writeBatch(db);
    
    for (const collectionDoc of collectionSnapshot.docs) {
      // Delete groups and their questions
      const groupSnapshot = await getDocs(collection(collectionDoc.ref, GROUPS_COLLECTION));
      for (const groupDoc of groupSnapshot.docs) {
        const questionsSnapshot = await getDocs(collection(groupDoc.ref, QUESTIONS_COLLECTION));
        questionsSnapshot.docs.forEach((questionDoc) => {
          batch.delete(questionDoc.ref);
        });
        batch.delete(groupDoc.ref);
      }
      
      // Delete sections
      const sectionsSnapshot = await getDocs(collection(collectionDoc.ref, SECTIONS_COLLECTION));
      sectionsSnapshot.docs.forEach((sectionDoc) => {
        batch.delete(sectionDoc.ref);
      });
      
      // Delete standalone questions
      const questionsSnapshot = await getDocs(collection(collectionDoc.ref, QUESTIONS_COLLECTION));
      questionsSnapshot.docs.forEach((questionDoc) => {
        batch.delete(questionDoc.ref);
      });
      
      batch.delete(collectionDoc.ref);
    }
    
    // Delete all tags
    const tagSnapshot = await getDocs(collection(db, TAGS_COLLECTION));
    tagSnapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
    console.log('All data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete data');
  }
};

export const initializeSupplierQuestions = async (): Promise<void> => {
  try {
    // Add tags, checking for duplicates
    const tagIds = new Map<string, string>();
    for (const tag of supplierTags) {
      // Check if tag already exists
      const tagSnapshot = await getDocs(
        query(
          collection(db, TAGS_COLLECTION),
          where('name', '==', tag.name)
        )
      );

      if (tagSnapshot.empty) {
        const docRef = await addDoc(collection(db, TAGS_COLLECTION), tag);
        tagIds.set(tag.name, docRef.id);
      } else {
        tagIds.set(tag.name, tagSnapshot.docs[0].id);
      }
    }

    // Import questions from spreadsheet
    const collectionId = await importQuestionsFromSpreadsheet();
    console.log('Created new question collection:', collectionId);

    console.log('Supplier questions and tags initialized successfully');
  } catch (error) {
    console.error('Error initializing supplier questions:', error);
    throw error;
  }
};
