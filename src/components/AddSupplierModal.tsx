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
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { SupplierSchema } from '../types/supplier';
import { addSupplier } from '../services/suppliers';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierAdded: () => void;
}

export const AddSupplierModal = ({ isOpen, onClose, onSupplierAdded }: AddSupplierModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    primaryContact: '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const newSupplier = {
        ...formData,
        id: Date.now().toString(),
        taskProgress: 0,
        status: 'pending' as const,
        lastUpdated: new Date(),
      };

      const validationResult = SupplierSchema.safeParse(newSupplier);

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        validationResult.error.issues.forEach(issue => {
          formattedErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(formattedErrors);
        setIsLoading(false);
        return;
      }

      await addSupplier(newSupplier);
      
      toast({
        title: 'Supplier added successfully',
        status: 'success',
        duration: 3000,
      });
      
      onSupplierAdded();
      onClose();
      setFormData({ name: '', primaryContact: '' });
    } catch (error) {
      toast({
        title: 'Error adding supplier',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Supplier</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Supplier Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter supplier name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.primaryContact}>
              <FormLabel>Primary Contact Email</FormLabel>
              <Input
                type="email"
                value={formData.primaryContact}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryContact: e.target.value }))}
                placeholder="Enter contact email"
              />
              <FormErrorMessage>{errors.primaryContact}</FormErrorMessage>
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
            Add Supplier
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};