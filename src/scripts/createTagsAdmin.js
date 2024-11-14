import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const TAGS_COLLECTION = 'questionTags';

const tierTags = [
  { 
    name: 'Tier 1',
    color: '#FF6B6B',
    description: 'Highest priority tier'
  },
  {
    name: 'Tier 2',
    color: '#4ECDC4',
    description: 'High priority tier'
  },
  {
    name: 'Tier 3',
    color: '#45B7D1',
    description: 'Medium priority tier'
  },
  {
    name: 'Tier 4',
    color: '#96CEB4',
    description: 'Standard priority tier'
  }
];

async function createTags() {
  try {
    for (const tag of tierTags) {
      const docRef = await addDoc(collection(db, TAGS_COLLECTION), tag);
      console.log(`Created tag ${tag.name} with ID: ${docRef.id}`);
    }
    console.log('All tier tags created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tier tags:', error);
    process.exit(1);
  }
}

createTags();
