import {
  Box,
  Flex,
  Button,
  Heading,
  useDisclosure,
  Grid,
  Text,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Question, QuestionTag } from '../../types/question';
import { getQuestions, getTags, initializeSupplierQuestions } from '../../services/questions';
import { AddQuestionModal } from './AddQuestionModal';
import { QuestionCard } from './QuestionCard';
import { TagsManager } from './TagsManager';
import { ImportQuestionsModal } from './ImportQuestionsModal';

export const QuestionsView = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTagsOpen,
    onOpen: onTagsOpen,
    onClose: onTagsClose
  } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose
  } = useDisclosure();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<QuestionTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Initialize supplier questions if none exist
      await initializeSupplierQuestions();
      
      const [questionsData, tagsData] = await Promise.all([
        getQuestions(),
        getTags()
      ]);
      
      setQuestions(questionsData);
      setTags(tagsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error fetching data',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Question Bank</Heading>
        <HStack spacing={4}>
          <Button onClick={onTagsOpen}>Manage Tags</Button>
          <Button onClick={onImportOpen}>Import Questions</Button>
          <Button onClick={onOpen}>Add New Question</Button>
        </HStack>
      </Flex>

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Text>Loading questions...</Text>
      ) : questions.length === 0 ? (
        <VStack spacing={4} py={8}>
          <Text color="gray.500">No questions available</Text>
          <HStack spacing={4}>
            <Button onClick={onImportOpen}>Import Questions</Button>
            <Button onClick={onOpen}>Add Your First Question</Button>
          </HStack>
        </VStack>
      ) : (
        <Grid
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={6}
          mt={6}
        >
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              tags={tags}
            />
          ))}
        </Grid>
      )}

      <AddQuestionModal
        isOpen={isOpen}
        onClose={onClose}
        onQuestionAdded={fetchData}
        tags={tags}
      />

      <TagsManager
        isOpen={isTagsOpen}
        onClose={onTagsClose}
        tags={tags}
        onTagsUpdated={fetchData}
      />

      <ImportQuestionsModal
        isOpen={isImportOpen}
        onClose={onImportClose}
        onQuestionsImported={fetchData}
        tags={tags}
        sections={[]}
      />
    </Box>
  );
};