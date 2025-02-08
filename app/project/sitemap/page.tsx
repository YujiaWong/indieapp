'use client';
import { useState, useRef } from 'react';
import { Textarea, Button } from '@nextui-org/react';

import ChatWindow from './ChatWindow';

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages((prev) => [...prev, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧对话框 */}
      <div className="flex flex-col w-1/4 border-r border-gray-300 p-4">
        <ChatWindow />
      </div>

      {/* 右侧 React Flow 编辑器 */}
      <div className="flex-grow p-4">
        {/* <ReactFlow
          elements={[]} // 这里可以添加你要显示的元素
          style={{ width: '100%', height: '100%' }}
        /> */}
      </div>
    </div>
  );
};

export default Home;


