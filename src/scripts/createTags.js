import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { addTag } from '../services/questions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tierTags = [
  { 
    id: '',
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

async function createTags() {
  try {
    for (const tag of tierTags) {
      await addTag(tag);
      console.log(`Created tag: ${tag.name}`);
    }
    console.log('All tier tags created successfully');
  } catch (error) {
    console.error('Error creating tier tags:', error);
  }
}

createTags();
