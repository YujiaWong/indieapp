'use client';
import { useState, useRef } from 'react';
import { Textarea, Button } from '@nextui-org/react';

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
    <div className="w-full">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 my-1 bg-gray-100 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow"
          minRows={3}
        />
        <Button onPress={handleSendMessage} className="ml-2">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Home;


