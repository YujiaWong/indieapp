'use client'
import React, { useEffect, useRef } from 'react';
import { Input, Spinner, Button, Link } from '@nextui-org/react';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import API from '@/services';
import { useSet } from '@/utils/hooks';
import { useRouter } from 'next/navigation';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Toast from '@/components/base/toast';
import { SandpackRenderer } from './SandpackRenderer';

const extractCodeContent = (text: string): string => {
  const codeRegex = /\$code\$([\s\S]*?)\$desc\$/;
  const match = text.match(codeRegex);
  return match ? match[1].trim() : '';
};

const extractDescContent = (text: string): string => {
  // 使用正则表达式匹配 $desc$ 后面的内容，[\s\S]*? 可以匹配所有字符，包括换行符
  const match = text.match(/\$desc\$(.*?)$/s);  // 使用正则中的s修饰符来匹配多行文本
  
  // 如果匹配到，则返回 $desc$ 后面的内容，否则返回 null
  return match ? match[1].trim() : null;
};


export default () => {
  const router = useRouter();
  const isCloseRef = useRef<boolean>();

 
  
  const [state, setState] = useSet({
    messages: [],
    userInput: '',
    generateLoading: false,
    projectCode: null,
    assetCode: '',
  });
  const { messages, userInput, projectCode, assetCode, generateLoading } = state;

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    setState({ projectCode: params.get('projectCode') });
  }, []);

  useEffect(() => {
    if (!projectCode) {
      return;
    }
    const generateKey = `${projectCode}-prompt-create`;
    const value = localStorage.getItem(generateKey);
    if (!value) {
      getChatHistory();
      getAssetCode();
      return;
    }
    handleGenerate(value);
    localStorage.removeItem(generateKey);
  }, [projectCode]);

  const handleGenerate = async (value: string) => {
    if (!value.trim()) {
      return
    }
    const _msgList = handleSendMessage(messages, value, 'user');
    setState({ generateLoading: true });
    isCloseRef.current = false;

    // 将用户输入添加到聊天历史
    let generatedCode = ''

    try {
      const params = {
        headers: {
          'Content-Type': 'application/json',
          // 确保在请求头中加入正确的 Authorization
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          projectCode: projectCode || 'default_project_code', // 使用从 URL 获取的 projectCode
          prompt: value,
          payload: ''
        })
      };

      console.log('/v1/projects/ai/assets-入参:', params);
      await fetchEventSource(
        'https://api.indieapp.ai/v1/projects/ai/chat',
        {
          method: 'POST',
          ...params,
          async onopen(response) {
            if (!response.ok || response.headers.get('content-type') !== 'text/event-stream') {
              throw new Error('建立连接失败')
            }
          },
          openWhenHidden: true,
          onmessage(event) {
            const line = event.data.replace(/data:\s*/g, '');
            generatedCode += line || ' ';
            // const extractedCode = extractCodeContent(generatedCode);
            // setState({ assetCode: extractedCode });
          },
          onerror(err) {
            throw err
          },
          onclose() {
            if (isCloseRef.current) {
              return;
            }
            isCloseRef.current = true;
            const finalExtractedCode = extractCodeContent(generatedCode);
            const finalExtractedDesc = extractDescContent(generatedCode);

            if (finalExtractedDesc) {
              handleSendMessage(_msgList, finalExtractedDesc, 'robot');
            }
            setState({ generateLoading: false });
            setState({ assetCode: finalExtractedCode });
          }
        }
      )
    } catch (error) {
      setState({ generateLoading: false });
    }
  };

  const getAssetCode = async () => {
    if (!projectCode) {
      return;
    }
    try {
      const params = { projectCode };
      const response = await API.project.artifacts(params);
      
      if (response?.data?.artifacts?.length > 0) {
        const artifact = response.data.artifacts[0];
        setState({ assetCode: artifact.content || '' });
      } else {
        console.log('No artifacts found or invalid response structure');
      }
    } catch (error) {
      console.error('No artifacts found or invalid response structure:', error);
    }
  };

  const getChatHistory = async () => {
    try {
      const params = {
        cursor: null,
        pageSize: 100,  // 可以根据需要调整
        projectCode,
        asc: true,
      };
      const res = await API.project.chatHistory(params);
      const data = res?.data?.data;

      const list = data?.map((item: any) => ({
        id: item.id,
        content: item.message,
        type: item.sender === 'assistant' ? 'robot' : 'user'
      })).reverse();  // 反转数组顺序

      setState({ messages: list });
    } catch (error) {
      Toast.notify({
        type: 'error',
        message: 'Description Failed to obtain the dialog content'
      });
    }
  };

  const handleSendMessage = (messages: any[], value: string, type: string) => {
    if (!value.trim()) {
      return;
    }

    const messageList = [
      ...messages,
      { content: value, type }
    ];
    setState({ userInput: '', messages: messageList });
    return messageList;
  };

  const handleBack = () => {
    router.push('/me');
  };
  
  return (
    <div className='h-screen flex flex-col'>
      {/* Top bar */}
      <div className='w-full bg-white flex items-center justify-between p-1.5 sticky top-0 z-10  border-b border-gray-100'>
        <Link href='./' className='text-gray-800 flex  items-center'>
          <svg fill='none' height='36' viewBox='0 0 32 32' width='36'>
            <path
              d='M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z'
              fill='currentColor'
            ></path>
          </svg>
          <strong>Indieapp</strong>
        </Link>
        <Button color='primary' size='sm' onPress={handleBack}>返回</Button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Left side - AI chat */}
        <div className='w-1/4 max-w-[420px] bg-gray-100 p-2 flex flex-col'>
          <div className='flex-1 overflow-y-auto'>
            <div className='space-y-4'>
              {messages.map((msg: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${msg.type === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.type === 'robot' ? (
                    <>
                      <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white'>
                        <span role='img' aria-label='AI' className='text-xl'>🤖</span>
                      </div>
                      <div className='p-2 rounded-lg max-w-xs bg-blue-200'>
                        <p className='text-sm'>{msg.content}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='p-2 rounded-lg max-w-xs bg-green-200'>
                        <p className='text-sm'>{msg.content}</p>
                      </div>
                      <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white'>
                        <span role='img' aria-label='User' className='text-xl'>👤</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center space-x-2'>
              <Input
                type='text'
                value={userInput}
                onChange={(e) => setState({ userInput: e.target.value })}
                className='w-full border border-gray-400 rounded-lg'
                placeholder='请输入消息...'
                endContent={
                  generateLoading ? (
                    <Spinner color='secondary' labelColor='secondary' size='sm' />
                  ) : (
                    <PaperAirplaneIcon className='h-5 w-5 cursor-pointer' onClick={() => handleGenerate(userInput)} />
                  )
                }
              />
            </div>
          </div>
        </div>

       {/* Right side - Content */}
        <div className='flex-1 bg-white overflow-y-auto'>
          {!!assetCode && <SandpackRenderer code={assetCode} />}
        </div>
      </div>
    </div>
  );
}
