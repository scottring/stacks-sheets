import {
  Box,
  Flex,
  Button,
  Heading,
  useDisclosure,
  Text,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Select,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Question, QuestionTag, QuestionGroup } from '../../types/question';
import { getQuestions, getTags, initializeSupplierQuestions, deleteAllData, getQuestionGroups, getQuestionCollections } from '../../services/questions';
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
  
  const [questionGroups, setQuestionGroups] = useState<(QuestionGroup & { questions: Question[] })[]>([]);
  const [tags, setTags] = useState<QuestionTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string; createdAt: Date }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const toast = useToast();

  const fetchCollections = async () => {
    try {
      const collectionsData = await getQuestionCollections();
      setCollections(collectionsData);
      if (collectionsData.length > 0 && !selectedCollection) {
        setSelectedCollection(collectionsData[0].id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error fetching collections',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchData = async () => {
    if (!selectedCollection) return;

    try {
      setError(null);
      setIsLoading(true);
      
      // Fetch tags first
      const tagsData = await getTags();
      setTags(tagsData);

      // Fetch groups for the selected collection
      const groups = await getQuestionGroups(selectedCollection);
      
      // Fetch questions for each group
      const groupsWithQuestions = await Promise.all(
        groups.map(async (group) => {
          const questions = await getQuestions(selectedCollection, group.id);
          return {
            ...group,
            questions
          };
        })
      );

      setQuestionGroups(groupsWithQuestions);
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

  const handleInitializeQuestions = async () => {
    try {
      setIsLoading(true);
      await initializeSupplierQuestions();
      await fetchCollections();
      await fetchData();
      toast({
        title: 'Success',
        description: 'Questions initialized successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error initializing questions',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmptyQuestionBank = async () => {
    try {
      setIsLoading(true);
      await deleteAllData();
      setSelectedCollection(null);
      await fetchCollections();
      setQuestionGroups([]);
      toast({
        title: 'Success',
        description: 'Question bank has been emptied',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error emptying question bank',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filterQuestionsByTags = (questions: Question[]) => {
    if (selectedTags.length === 0) return questions;
    return questions.filter(question =>
      selectedTags.every(tagId => question.tags.includes(tagId))
    );
  };

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch data when selected collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchData();
    }
  }, [selectedCollection]);

  const emptyButtonBg = useColorModeValue('red.500', 'red.600');
  const emptyButtonHoverBg = useColorModeValue('red.600', 'red.700');
  const groupBg = useColorModeValue('gray.50', 'gray.700');

  const totalQuestions = questionGroups.reduce((sum, group) => sum + group.questions.length, 0);

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" mb={4}>Question Bank</Heading>
          {collections.length > 0 && (
            <Select
              value={selectedCollection || ''}
              onChange={(e) => setSelectedCollection(e.target.value)}
              width="300px"
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </Select>
          )}
        </Box>
        <HStack spacing={4}>
          <Button onClick={onTagsOpen}>Manage Tags</Button>
          <Button onClick={onImportOpen}>Import Questions</Button>
          <Button onClick={onOpen}>Add New Question</Button>
          <Button
            onClick={handleEmptyQuestionBank}
            bg={emptyButtonBg}
            color="white"
            _hover={{ bg: emptyButtonHoverBg }}
            isDisabled={totalQuestions === 0}
          >
            Empty Question Bank
          </Button>
        </HStack>
      </Flex>

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Tag Filter Section */}
      <Box mb={6}>
        <Text mb={2} fontWeight="bold">Filter by Tags:</Text>
        <HStack spacing={2} wrap="wrap">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              px={2}
              py={1}
              borderRadius="full"
              cursor="pointer"
              backgroundColor={selectedTags.includes(tag.id) ? tag.color : 'gray.100'}
              color={selectedTags.includes(tag.id) ? 'white' : 'gray.800'}
              onClick={() => handleTagSelect(tag.id)}
              _hover={{ opacity: 0.8 }}
            >
              {tag.name}
            </Badge>
          ))}
        </HStack>
      </Box>

      {isLoading ? (
        <Text>Loading questions...</Text>
      ) : totalQuestions === 0 ? (
        <VStack spacing={4} py={8}>
          <Text color="gray.500">No questions available</Text>
          <HStack spacing={4}>
            <Button onClick={onImportOpen}>Import Questions</Button>
            <Button onClick={onOpen}>Add Your First Question</Button>
            <Button onClick={handleInitializeQuestions} colorScheme="blue">
              Initialize Default Questions
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Accordion allowMultiple>
          {questionGroups.map((group) => {
            const filteredQuestions = filterQuestionsByTags(group.questions);
            if (filteredQuestions.length === 0) return null;

            return (
              <AccordionItem key={group.id} bg={groupBg} mb={4} borderRadius="md">
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Flex align="center" justify="space-between">
                      <Text fontWeight="bold">{group.name}</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="blue">{group.tier}</Badge>
                        <Badge colorScheme="green">{group.category}</Badge>
                        <Badge colorScheme="purple">{filteredQuestions.length} Questions</Badge>
                      </HStack>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack spacing={4} align="stretch" width="100%">
                    {filteredQuestions.map((question) => (
                      <Box key={question.id} width="100%">
                        <QuestionCard
                          question={question}
                          tags={tags}
                        />
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      <AddQuestionModal
        isOpen={isOpen}
        onClose={onClose}
        onQuestionAdded={fetchData}
        tags={tags}
        collectionId={selectedCollection || undefined}
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
        collectionId={selectedCollection || undefined}
      />
    </Box>
  );
};
