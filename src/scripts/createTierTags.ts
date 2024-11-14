import { addTag } from '../services/questions';
import type { QuestionTag } from '../types/question';

const createTierTags = async () => {
  const tierTags: QuestionTag[] = [
    { 
      id: '', // Will be set by Firestore
      name: 'Tier 1',
      color: '#FF6B6B',
      description: 'Highest priority tier'
    },
    {
      id: '',
      name: 'Tier 2',
      color: '#4ECDC4',
      description: 'High priority tier'
    },
    {
      id: '',
      name: 'Tier 3',
      color: '#45B7D1',
      description: 'Medium priority tier'
    },
    {
      id: '',
      name: 'Tier 4',
      color: '#96CEB4',
      description: 'Standard priority tier'
    }
  ];

  try {
    for (const tag of tierTags) {
      await addTag(tag);
      console.log(`Created tag: ${tag.name}`);
    }
    console.log('All tier tags created successfully');
  } catch (error) {
    console.error('Error creating tier tags:', error);
  }
};

createTierTags();
