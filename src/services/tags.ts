import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Tag } from '../types/tag';

const TAGS_COLLECTION = 'tags';

export const getTags = async (): Promise<Tag[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, TAGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tag));
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tags');
  }
};

export const addTag = async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
  try {
    const docRef = await addDoc(collection(db, TAGS_COLLECTION), tag);
    return {
      id: docRef.id,
      ...tag
    };
  } catch (error) {
    console.error('Error adding tag:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to add tag');
  }
};

export const deleteTag = async (tagId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, TAGS_COLLECTION, tagId));
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete tag');
  }
};
