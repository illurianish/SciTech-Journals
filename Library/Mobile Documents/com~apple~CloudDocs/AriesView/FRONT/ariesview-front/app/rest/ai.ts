import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from './http';

// Types
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface RAGQueryRequest {
  question: string;
}

export interface RAGQueryResponse {
  answer: string;
}

// Send RAG query to AI
export function useRAGQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: string) => {
      const res = await http.post('/api/ai/rag-query', { question });
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate any AI-related queries if needed
      queryClient.invalidateQueries({ queryKey: ['ai-chat'] });
    },
  });
}



// Chat management utilities
export const createInitialChatHistory = (): ChatMessage[] => [
  {
    role: 'system',
    content: 'Welcome to AriesView AI Assistant. How can I help you with your portfolio and document analysis today?'
  }
];

export const addUserMessage = (chatHistory: ChatMessage[], message: string): ChatMessage[] => [
  ...chatHistory,
  { role: 'user', content: message }
];

export const addAssistantMessage = (chatHistory: ChatMessage[], message: string): ChatMessage[] => [
  ...chatHistory,
  { role: 'assistant', content: message }
];

export const addErrorMessage = (chatHistory: ChatMessage[]): ChatMessage[] => [
  ...chatHistory,
  {
    role: 'assistant',
    content: 'Sorry, I encountered an error while processing your request. Please try again later.',
  }
];
