import {
  Box,
  Text,
  Tag,
  TagLabel,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import type { Question, QuestionTag } from '../../types/question';

interface QuestionCardProps {
  question: Question;
  tags: QuestionTag[];
}

export const QuestionCard = ({ question, tags }: QuestionCardProps) => {
  const getTagColor = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag?.color || 'gray.500';
  };

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor="gray.100"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <VStack align="stretch" spacing={4}>
        <Text fontSize="md" fontWeight="medium">
          {question.text}
        </Text>

        <HStack spacing={2}>
          <Badge colorScheme="blue">
            {question.type}
          </Badge>
          {question.required && (
            <Badge colorScheme="red">
              Required
            </Badge>
          )}
        </HStack>

        <Box>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Tags:
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {question.tags.map((tagId) => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <Tag
                  key={tagId}
                  size="sm"
                  borderRadius="full"
                  variant="subtle"
                  bgColor={tag.color + '20'}
                >
                  <TagLabel>{tag.name}</TagLabel>
                </Tag>
              ) : null;
            })}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};