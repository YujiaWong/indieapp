import React, { memo, useRef, useState, useEffect } from 'react';
import { Textarea, Button, Avatar } from '@nextui-org/react';
import { getCurrUserAvatarUrl } from '@/utils';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { Logo } from '@/components/icons';
import SkeletonMessages from '@/components/SkeletonMessages';
import ResultFail from '@/components/ResultFail';

export default memo((props: any) => {
  const { messages = [], loading, onSend, actionExtra, showSkeleton, showFail, onRest } = props;
  
  const { userInfo } = useGlobalState();
  const containerRef : any = useRef();
  const textareaRef: any = useRef();
  const [textValue, setTextValue] = useState('');
  const [charWarning, setCharWarning] = useState(false);

  const isDisabled = !!charWarning || showSkeleton || showFail;

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages.length])

  const handleSendMessage = () => {
    onSend(textValue);
    setTextValue('');
    setCharWarning(false);
  };

  const handleTextareaChange = (ev: any) => {
    const value = ev.target.value;
    setTextValue(value);
    if (value.length > 10000) {
      setCharWarning(true);
    } else {
      setCharWarning(false);
    }
  };

  return (
    <div className='w-full h-full flex flex-col'>
      {/* 消息列表 */}
      <div className='flex-1 overflow-y-auto space-y-4 p-6' ref={containerRef}>
        {showFail && (
          <ResultFail 
            description='The conversation content request failed.'
            onRest={onRest}
          />
        )}
        {showSkeleton ? (
          <SkeletonMessages />
        ): (
          <>
            {messages.map((msg: any, index: number) => (
              <div key={index} className={`flex items-start space-x-3 mb-6`}>
                <div className='w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center border border-gray-200'>
                  {msg.type === 'robot' ? <Logo /> : <Avatar src={getCurrUserAvatarUrl(userInfo)} size='sm' /> }
                </div>
                <div className='p-1 rounded-lg flex-1 text-[14px]'>
                  <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.content}</pre>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* 输入框固定在底部 */}
      <div className='sticky p-4 border-t border-gray-100 relative'>
        {actionExtra}
        <Textarea
          className='w-full rounded-lg border resize-none bg-white'
          classNames={{
            inputWrapper: '!bg-transparent',
            // input: 'placeholder:text-[13px]'
          }}
          placeholder='Follow up your thoughts here...'
          minRows={5}
          ref={textareaRef}
          value={textValue}
          onChange={handleTextareaChange}
          isDisabled={isDisabled}
        />
        {charWarning && (
          <div className='absolute text-sm text-red-500'>
            You have exceeded the 10,000 character limit!
          </div>
        )}
        <div className='absolute bottom-6 z-10 right-4 px-4'>
          <Button
            className='bg-black'
            color='primary' 
            size='sm' 
            isLoading={loading} 
            onPress={handleSendMessage} 
            isDisabled={isDisabled}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
});


