import { addTag } from '../services/tags.ts';

const createTierTags = async () => {
  const tierTags = [
    { name: 'Tier 1', color: '#FF6B6B', description: 'Highest priority tier' },
    { name: 'Tier 2', color: '#4ECDC4', description: 'High priority tier' },
    { name: 'Tier 3', color: '#45B7D1', description: 'Medium priority tier' },
    { name: 'Tier 4', color: '#96CEB4', description: 'Standard priority tier' }
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
