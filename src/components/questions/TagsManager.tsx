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
  FormErrorMessage,
  VStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { QuestionTagSchema, type QuestionTag } from '../../types/question';
import { addTag } from '../../services/questions';

interface TagsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tags: QuestionTag[];
  onTagsUpdated: () => void;
}

export const TagsManager = ({
  isOpen,
  onClose,
  tags,
  onTagsUpdated,
}: TagsManagerProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    color: '#4299E1',
    description: '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const newTag = {
        ...formData,
        id: Date.now().toString(),
      };

      const validationResult = QuestionTagSchema.safeParse(newTag);

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.issues.forEach(issue => {
          formattedErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(formattedErrors);
        return;
      }

      await addTag(newTag);
      
      toast({
        title: 'Tag added successfully',
        status: 'success',
        duration: 3000,
      });
      
      onTagsUpdated();
      setFormData({
        name: '',
        color: '#4299E1',
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Error adding tag',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Box w="full">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Tag</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tags.map((tag) => (
                    <Tr key={tag.id}>
                      <Td>
                        <Tag
                          size="md"
                          borderRadius="full"
                          variant="subtle"
                          bgColor={tag.color + '20'}
                        >
                          {tag.name}
                        </Tag>
                      </Td>
                      <Td>{tag.description || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Box w="full" pt={6} borderTop="1px" borderColor="gray.200">
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Tag Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tag name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.color}>
                  <FormLabel>Color</FormLabel>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                  <FormErrorMessage>{errors.color}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Description (Optional)</FormLabel>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter tag description"
                  />
                </FormControl>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Add Tag
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};