import { initializeSupplierQuestions } from '../services/questions';

const importQuestions = async () => {
  try {
    await initializeSupplierQuestions();
    console.log('Questions imported successfully');
  } catch (error) {
    console.error('Error importing questions:', error);
  }
};

importQuestions();
