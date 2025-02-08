'use client';
import React, { useEffect, useRef, memo } from 'react';
import { Button, Link, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useUpdateEffect } from 'ahooks';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import API from '@/services';
import { useSet } from '@/utils/hooks';
import { getUrlParams } from '@/utils';
import { Logo } from '@/components/icons';
import ChatView from '@/components/ChatView';
import Toast from '@/components/base/toast';
import ProjectFeatures from '@/components/ProjectFeatures';

export default memo(() => {
  const isCloseRef = useRef<boolean>();
  const receiveMark = useRef('');
  const featureRef: any = useRef();

  const router = useRouter();
  const [state, setState] = useSet({
    messages: [],
    features: [],
    userInput: '',
    generateLoading: false,
    projectCode: null,
    assetCode: '',
    optStep: 'CLARIFY_IDEA',
    showFeatures: false,
    showMsgSkeleton: false,
    showMessageFail: false,
  });
  const { messages, features, optStep, projectCode, generateLoading, showMsgSkeleton, showMessageFail, showFeatures } = state;

  useEffect(() => {
    const params = getUrlParams();
    const projectCode = params.get('projectCode');
    if (!projectCode) {
      Toast.notify({
        type: 'error',
        message: 'Invalid access path',
      });
      router.replace('/');
      return;
    }
    setState({ projectCode });
  }, []);

  useUpdateEffect(() => {
    if (!projectCode) {
      return;
    }
   
    const generateKey = `${projectCode}-prompt-create`;
    const userPrompt = localStorage.getItem(generateKey);

    // 说明是第一次，直接创建
    if (userPrompt) {
      handleGenerate(userPrompt);
      localStorage.removeItem(generateKey);
      return;
    }
    getDemandDetail();
    getChatHistory();
    getArtifacts();
  }, [projectCode]);

  const getDemandDetail = async () => {
    const { suc, data } = await API.project.detail({ projectCode });
    if (!suc) {
      return;
    }
    if (data?.step === 'PRE_DESIGN') {
      setState({ optStep: 'MODIFY_FL', showFeatures: true })
    }
    if (data?.step === 'DESIGN') {
      location.replace(`/design?projectCode=${projectCode}`);
    }
  };

  const getChatHistory = async () => {
    setState({ showMessageFail: false, showMsgSkeleton: true });
    try {
      const { suc, data, hasMore, msg } = await API.project.chatHistory({
        projectCode,
        asc: true,
        pageSize: 100,
      });
      setState({ showMsgSkeleton: false });
      if (!suc) {
        Toast.notify({
          type: 'error',
          message: msg || 'The conversation content request failed.',
        });
        setState({ showMessageFail: true });
        return;
      }

      const messages = (data?.data || []).map((item : any) => {
        return {
          type: item?.sender?.includes('Assistant') ? 'robot' : 'user',
          content: item.message,
          time: item.sentAt
        }
      }).reverse();

      setState({ messages });
    } catch (error) {
      setState({ showMsgSkeleton: false,  showMessageFail: true });
    }
  };

  const getArtifacts = async () => {
    const { suc, data } = await API.project.artifacts({ projectCode });
    if (!suc) {
      return;
    }

    let features = [];
    (data?.artifacts || []).forEach((item: any) => {
      if (item.type === 'FEATURE_LIST') {
        features = JSON.parse(item.content || '[]').map((feature: any, index: number) => ({ id: index, ...feature }));
      }
    });
    setState({ features });
  };

  const handleGenerate = async (value: string, other?: any) => {
    const { step, attachments } = other || {};
    if (!value.trim()) {
      return
    }
    const _msgList = handleSendMessage(messages, value, 'user');
    isCloseRef.current = false;
    const opt = step || optStep;
    setState({ generateLoading: true, showFeatures: !['CLARIFY_IDEA', 'SKIP_CUR_QUESTION'].includes(opt) });

    try {
      const params = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          opt,
          projectCode,
          prompt: value,
          attachments
        })
      };

      await fetchEventSource(
        'https://api.indieapp.ai/v1/projects/ai/chat',
        {
          method: 'POST',
          ...params,
          async onopen(response: any) {
            if (!response.ok || response.headers.get('content-type') !== 'text/event-stream') {
              throw new Error('建立连接失败')
            }
          },
          openWhenHidden: true,
          onmessage(event: any) {
            const line = event.data.replace(/data:\s*/g, '');
            if (['#fls#', '#dcs#', '#end#'].includes(line)) {
              receiveMark.current = line;
              if (line === '#fls#') {
                setState({ showFeatures: true });
              }
              return;
            }

            if (!receiveMark.current) {
              handleSendMessage(_msgList, line, 'robot');
            }

            if (receiveMark.current === '#fls#') {
              setState({ features: JSON.parse(line || '[]').map((feature: any, index: number) => ({ id: index, ...feature })) })
            }

            if (receiveMark.current === '#dcs#') {
              router.replace(`/design?projectCode=${projectCode}`);
            }
          },
          onerror(err: any) {
            throw err
          },
          onclose() {
            if (isCloseRef.current) {
              return;
            }
            isCloseRef.current = true;
            receiveMark.current = '';
            setState({ generateLoading: false });
          }
        }
      )
    } catch (error) {
      setState({ generateLoading: false });
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

  const handleNavigate = () => {
    handleGenerate('Skip all  questions', { step: 'SKIP_PRE_DESIGN' });
  };

  const handleGenerateDemo = (funcList: any) => {
    const params = {
      step: 'GEN_DEMO_FROM_FL', 
      attachments: [
        {
          type: 'FEATURE_LIST',
          content: JSON.stringify(funcList.map((item: any) => ({ name: item.name, description: item.description })))
        }
      ]
    };

    localStorage.setItem(`${projectCode}-generate-demo`, JSON.stringify(params));
    location.href = `/design?projectCode=${projectCode}`;
  };

  const handleSkipQuestion = () => {
    handleGenerate('Skip question', {step: 'SKIP_CUR_QUESTION'});
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='w-full bg-white flex items-center justify-between p-3 sticky top-0 z-10 border-b border-gray-100 fixed'>
        <Link href='./' className='text-gray-800 flex items-center'>
          <Logo />
          <p className='font-medium text-inherit ml-2'>Indieapp</p>
        </Link>
      </div>
      <div className='h-0 flex-1 flex bg-[#f8f8f8] relative'>
        <div
          style={{ width: showFeatures ? '540px' : '60%' }} /* 设置初始宽度 */
          className='flex justify-center relative mx-auto' /* 仅水平居中 */
        >
          <div className='w-full max-w-[800px] flex flex-col'>
            <ChatView 
              messages={messages}
              loading={generateLoading}
              showSkeleton={showMsgSkeleton}
              showFail={showMessageFail}
              onRest={getChatHistory}
              onSend={handleGenerate}
              actionExtra={(!showFeatures && !showMsgSkeleton && !showMessageFail) &&(
                <div className='flex mb-4'>
                  <Button 
                    size='sm' 
                    variant='faded' 
                    className='border' 
                    onPress={handleSkipQuestion}
                    isDisabled={generateLoading}
                  >
                    Skip question
                  </Button>
                  <Spacer x={4} />
                  <Button
                    className='border' 
                    size='sm' 
                    variant='faded'
                    isDisabled={generateLoading}
                    onPress={handleNavigate}
                  >
                    End chat &gt; start demo now
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
        {showFeatures && (
          <div className='w-[1px] bg-gray-200' />
        )}
        {showFeatures && (
           <div className='flex flex-1 h-full flex-col'>
            <div className='bg-white py-3 px-6 flex items-center'>
              <div className='font-medium'>Feature List</div>
              <div className='flex-1 text-right'>
                <Button 
                  color='primary' 
                  className='h-[36px] bg-black' 
                  radius='md'
                  isDisabled={generateLoading}
                  onPress={() => {
                    featureRef?.current?.generateDemo();
                  }}
                >
                  Generate Demo
                </Button>
              </div>
           </div>

           <div className='flex-1 overflow-y-auto'>
              <ProjectFeatures
                ref={featureRef}
                data={features}
                disabled={generateLoading}
                onGenerateDemo={handleGenerateDemo}
                showSkeleton={generateLoading}
              />
           </div>
         </div>
        )}
      </div>
    </div>
  );
})