import React, { useState, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { CodeGenerator } from './codeGenerator';
import { UserComponent } from '@craftjs/core';

interface TextGeneratorProps {
  children: string;
}

export const TextGenerator: React.FC<TextGeneratorProps> & UserComponent = ({ children }) => {
  const { id } = useNode();
  const { actions, query } = useEditor();
  const [text, setText] = useState(children);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setText(children);
  }, [children]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    actions.setProp(id, (props: any) => props.children = newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      convertToCodeGenerator();
    }
  };

  const convertToCodeGenerator = () => {
    console.log('convertToCodeGenerator', text);
    // const codeGeneratorElement = React.createElement(CodeGenerator, { id: id, files: {}, defaultCode: text });
    const codeGeneratorElement = React.createElement(CodeGenerator, { id: id, defaultCode: text });
    const nodeTree = query.parseReactElement(codeGeneratorElement).toNodeTree();
    actions.addNodeTree(nodeTree);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="text-generator" onDoubleClick={toggleEdit}>
      {isEditing ? (
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={toggleEdit}
          // autoFocus
          className="w-full p-2 border rounded"
        />
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
};

TextGenerator.craft = {
  props: {
    children: 'Default Text'
  },
  rules: {
    canDrag: () => true
  }
};