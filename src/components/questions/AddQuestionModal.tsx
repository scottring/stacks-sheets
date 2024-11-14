import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  FormErrorMessage,
  VStack,
  useToast,
  Tag,
  TagLabel,
  HStack,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QuestionSchema, type QuestionTag } from '../../types/question';
import { addQuestion } from '../../services/questions';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded: () => void;
  tags: QuestionTag[];
}

export const AddQuestionModal = ({
  isOpen,
  onClose,
  onQuestionAdded,
  tags,
}: AddQuestionModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    text: '',
    type: 'text',
    tags: [] as string[],
    required: true,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const now = new Date();
      const newQuestion = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };

      const validationResult = QuestionSchema.safeParse(newQuestion);

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.issues.forEach(issue => {
          formattedErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(formattedErrors);
        return;
      }

      await addQuestion(newQuestion);
      
      toast({
        title: 'Question added successfully',
        status: 'success',
        duration: 3000,
      });
      
      onQuestionAdded();
      onClose();
      setFormData({
        text: '',
        type: 'text',
        tags: [],
        required: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding question',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Question</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.text}>
              <FormLabel>Question Text</FormLabel>
              <Input
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your question"
              />
              <FormErrorMessage>{errors.text}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Question Type</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="text">Text</option>
                <option value="yesNo">Yes/No</option>
                <option value="multipleChoice">Multiple Choice</option>
                <option value="scale">Scale</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={!!errors.tags}>
              <FormLabel>Tags</FormLabel>
              <Box>
                <HStack spacing={2} flexWrap="wrap">
                  {tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      size="md"
                      borderRadius="full"
                      variant={formData.tags.includes(tag.id) ? 'solid' : 'subtle'}
                      bgColor={formData.tags.includes(tag.id) ? tag.color : tag.color + '20'}
                      cursor="pointer"
                      onClick={() => toggleTag(tag.id)}
                    >
                      <TagLabel>{tag.name}</TagLabel>
                    </Tag>
                  ))}
                </HStack>
              </Box>
              <FormErrorMessage>{errors.tags}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
              >
                Required question
              </Checkbox>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Add Question
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};