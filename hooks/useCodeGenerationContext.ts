// @/hooks/useCodeGenerationContext.ts
import { useContext } from 'react';
import { CodeGenerationContext } from '@/contexts/CodeGenerationContext';

export const useCodeGenerationContext = () => {
  const context = useContext(CodeGenerationContext);
  if (context === undefined) {
    throw new Error('useCodeGenerationContext must be used within a CodeGenerationContextProvider');
  }
  return context;
};