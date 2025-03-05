// @/components/codeGenerator.tsx
import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useNode, useEditor, Editor, Element } from '@craftjs/core';
import { debounce } from 'lodash';


import { SandpackRenderer } from '@/components/SandpackRenderer';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { CodeGenerationContext } from '@/contexts/CodeGenerationContext';
import styles from './dialog.module.css';
import { SandpackWrapper } from './SandpackWrapper';



const fallbackCode = `export default function App() {
  return <h1>Welcome to the AI Code!</h1>
}`;

const createCraftElement = (component) => {
  if (typeof component !== 'object' || component === null) {
    return component;
  }

  const { type, props } = component;
  const Component =  type;

  if (!Component) {
    console.error(`Component type "${type}" not found in componentMap`);
    return null;
  }

  const craftProps = { ...props };

  if (props && props.children) {
    craftProps.children = Array.isArray(props.children)
      ? props.children.map(createCraftElement)
      : createCraftElement(props.children);
  }

  return (
    <Element canvas is={Component} {...craftProps}>
      {craftProps.children}
    </Element>
  );
};

export const CodeGenerator = ({ id, defaultCode }) => {

  const { 
    // ... 其他上下文值
    functionList,
    setFunctionsList,
    generatedCodes, 
    setGeneratedCodes,
    isGenerating, 
    selectedId, 
    sendCodeToBackend,
    prompt,
    setPrompt,
    handleGenerate,
    // chatHistory,
    // setChatHistory
  } = useContext(CodeGenerationContext);

  const { active, related, query, actions } = useEditor((state, query) => ({
    active: query.getEvent('selected').first(),
    related: state.nodes[query.getEvent('selected').first()]?.related
  }))

  const { connectors: { connect, drag }} = useNode();
  
  // 使用 selectedId 来获取代码
  const codeToDisplay = generatedCodes[selectedId] || defaultCode;

  console.log('CodeGenerator: selectedId', selectedId);
  console.log('CodeGenerator: generatedCodes', generatedCodes);
  console.log('CodeGenerator: codeToDisplay', codeToDisplay);

  useEffect(() => {
    if (generatedCodes[id] && generatedCodes[id] !== codeToDisplay) {
      console.log('Updating code from generatedCodes:', generatedCodes[id]);
      // 如果需要，这里可以触发其他操作
    }
  }, [generatedCodes, id, codeToDisplay]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [codeVariants, setCodeVariants] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)

  const lastGeneratedCodeRef = useRef(defaultCode);

  useEffect(() => {
    if (defaultCode !== lastGeneratedCodeRef.current && !isGenerating) {
      lastGeneratedCodeRef.current = defaultCode;
      handleGenerate();
    }
  }, [defaultCode, handleGenerate, isGenerating]);
  
  

  const generateCodeVariant = useCallback(async (originalCode, index) => {
    try {
      let variantCode = '';
      setCodeVariants(prev => {
        const newVariants = [...prev];
        newVariants[index] = { code: '', isGenerating: true };
        return newVariants;
      });

      await fetchEventSource(
        'https://api.indieapp.ai/v1/projects/ai/assets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhaWN0b3B1cyIsImlhdCI6MTcyNDAyOTYzNiwiZXhwIjoxODk2ODI5NjM2fQ.2B2fARX74hql9eeZyqbc9Wh2ibtMLTaH0W2Ri0XnEINcoKT41tcQBF0zn-shdx_s30CRtPpwzrCkFg7BZVKCkA'
          },
          body: JSON.stringify({
            projectCode: '98776655'+ index,
            prompt,
            payload: ''
          }),
        async onopen(response) {
          if (!response.ok || response.headers.get('content-type') !== 'text/event-stream') {
            throw new Error('Failed to establish connection');
          }
        },
        onmessage(event) {
          const line = event.data.replace(/data:\s*/g, '');
          variantCode += line || ' ';
          setCodeVariants(prev => {
            const newVariants = [...prev];
            newVariants[index] = { code: variantCode, isGenerating: true };
            return newVariants;
          });
        },
        onerror(err) {
          console.error('Error in fetchEventSource:', err);
          throw err;
        },
        onclose() {
          setCodeVariants(prev => {
            const newVariants = [...prev];
            newVariants[index] = { code: variantCode, isGenerating: false };
            return newVariants;
          });
        },
        openWhenHidden: true,
      });
    } catch (error) {
      console.error('Error generating code variant:', error);
      setError('An error occurred while generating code variants. Please try again.');
      setCodeVariants(prev => {
        const newVariants = [...prev];
        newVariants[index] = { code: '', isGenerating: false };
        return newVariants;
      });
    }
  }, []);

  const handleGenerateVariants = async () => {
    setError(null);
    setCodeVariants(Array(5).fill({ code: '', isGenerating: true }));
    setIsDialogOpen(true);

    try {
      for (let i = 0; i < 5; i++) {
        await generateCodeVariant(codeToDisplay, i);
      }
    } catch (error) {
      console.error('Error generating variants:', error);
      setError('An error occurred while generating code variants. Please try again.');
    }
  };





  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGenerate();
  };

  const placeholders = [
    "Enter your prompt...",
    "Describe your component...",
    "What would you like to create?",
    "Type your idea here...",
  ];

  const chatHistory = [];

  // const filesToDisplay = files || {
    const filesToDisplay = {
    "/App.js": {
      code: defaultCode || fallbackCode,
      active: true
    }
  };

  useEffect(() => {
    console.log('generatedCodes updated:', generatedCodes);
    console.log('Current codeToDisplay:', codeToDisplay);
  }, [generatedCodes, codeToDisplay]);

  useEffect(() => {
    console.log('generatedCodes in CodeGenerator:', generatedCodes);
    console.log('id in CodeGenerator:', id);
    console.log('selectedId in CodeGenerator:', selectedId);
    console.log('defaultCode in CodeGenerator:', defaultCode);
    console.log('codeToDisplay in CodeGenerator:', codeToDisplay);
  }, [generatedCodes, id, selectedId, defaultCode, codeToDisplay]);

  useEffect(() => {
    console.log('CodeGenerator: generatedCodes updated', generatedCodes);
    console.log('CodeGenerator: current id', id);
    console.log('CodeGenerator: current selectedId', selectedId);
    console.log('CodeGenerator: current codeToDisplay', codeToDisplay);
  }, [generatedCodes, id, selectedId, codeToDisplay]);

  return (
    <div 
      ref={(ref) => connect(drag(ref) as any)}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
     

      <SandpackWrapper
        code={codeToDisplay}
        isGenerating={isGenerating}
        id={id}
        selectedId={selectedId}
      />
    </div>
  );
};

CodeGenerator.craft = {
  displayName: 'AI Code Generator',
  props: {
    defaultCode: ''
  },
  related: {
    toolbar: () => (
      <div>
        <h3 className="text-sm font-medium mb-2">AI Code Generator Settings</h3>
        <p className="text-xs">Customize settings as needed</p>
      </div>
    ),
  },
};
