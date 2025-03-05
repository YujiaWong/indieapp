// 主组件
'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Link,
  Button,
  Chip,
  useDisclosure,
  Spinner,
  Input,
} from '@heroui/react';
import API from '@/services';
import { FaCircleCheck, FaLock, FaUnlock } from 'react-icons/fa6';
import { HiCloudUpload, HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReactFlowProvider } from '@xyflow/react';
import Toast from '@/components/base/toast';
import { getUrlParams } from '@/utils';
import { Logo } from '@/components/icons';
import ChatView from '@/components/ChatView';
import ProjectFeatures from '@/components/ProjectFeatures';
import FlowView from './PageView';
import PublishModal from '@/components/publishModal';// 导入封装好的弹窗组件
import { useSet } from '@/utils/hooks';
import { PiGearBold } from 'react-icons/pi';
import ProjectSettingModal from '@/components/projSetting';

export default () => {
  const [leftWidth, setLeftWidth] = useState(480);
  const isCloseRef = useRef<boolean>();
  const receiveMark = useRef('');
  const firstRef = useRef(true);
  const featureRef: any = useRef();
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //此为控制publish弹窗
  const { isOpen: isOpenSetting, onOpen:onOpenSetting, onOpenChange:onOpenChangeSetting } = useDisclosure();  //此为控制项目设置的弹窗
  const [loading, setLoading] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [copy, setCopy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);

  const [state, setState] = useSet({
    messages: [],
    features: [],
    detail: null,
    userInput: '',
    generateLoading: false,
    projectCode: null,
    assetCode: '',
    optStep: 'CLARIFY_IDEA',
    codeString: '',
    displayType: 'demo',
  });

  if (loadingFinished) {
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }

  const handleCopy = () => {
    setCopy(true);
  };
 //-----------title1&desc1方法用来传给弹窗，弹窗更新值来useEffect自动获取。区分title1起到传递使更新，title为弹窗内部值变化记录---------------
  const [title1,setTitle1] = useState('');
  const[desc1, setDesc1] = useState('');
  
  const [artifactSetCode, setArtifactSetCode] = useState('');
  const [time, setTime] = useState(0); //时间戳
  const [attribute, setAttribute] = useState('');

  //-----------------------------得到公开or私有属性------------
  const getProjectAttributes = async() =>{
    try{
      const response = await API.project.projectAttributes({projectCode});
      //console.log('data 是' + response.data);
      if(!response.data?.visibility){
        console.log('retrieve visibility fail or null');
      }
      setAttribute(response.data.visibility);
      console.log(response.data.visibility + '.....');
    }catch(error) {
      console.log('get visibility fail...',error); 
    }
  }


  //----------------------------得到artifactSetCode---------------------------

  const getPublicationInfo = async () => {
    try {
      console.log('Fetching publication info for project code:', projectCode);
      const response = await API.project.chatHistory({
        projectCode,
        asc: true,
        pageSize: 100,
      });
      console.log('Publication info response:', response);

      const { data } = response.data;
      console.log('Publication info data:', data);
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('Data is not ready yet');
      } else {
        console.log('First element:', data[0]);
      }
      
      const {artifactSetCode} = data[0];
      const {sentAt} = data[0];
      setTime(sentAt);
      //console.log(sentAt);
      console.log('artifactSetCode is:', artifactSetCode);
      if (!artifactSetCode) {
        Toast.notify({
          type: 'error',
          message:
            'Failed to get project information: artifactSetCode is missing',
        });
        return;
      }
      setArtifactSetCode(artifactSetCode);
      console.log('Artifact set code:', artifactSetCode);
    } catch (error) {
      console.error('Failed to get project info:', error);
      let errorMessage = 'Failed to get project information';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error: Please check your internet connection';
      } else {
        errorMessage = error.message || errorMessage;
      }
      Toast.notify({ type: 'error', message: errorMessage });
    }
  };
  
  // useEffect(() => {
  //   if (!projectCode) {
  //     Toast.notify({ type: 'error', message: 'Project code is missing...' });
  //     return;
  //   }
  //   getPublicationInfo();
  // }, []);

  const handlePublish = async () => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoadingFinished(true), setLoading(false);
    // }, 3000);
    if (!artifactSetCode) {
      Toast.notify({ type: 'error', message: 'Artifact set code is missing' });
      return;
    }
    setLoading(true); //转圈圈，两个publish按钮变灰
    try {
      const response = await API.project.publish({
        projectCode,
        artifactSetCode,
      });
      console.log('status is' + response.status);
      if (response.suc) {
        setLoadingFinished(true);
        setShowSuccess(true);
        console.log('成功publish');
      } else {
        // 如果状态码不是200，表示可能有问题
        setShowSuccess(false);
        Toast.notify({ type: 'error', message: 'Project publish failure...' });
      }
    } catch (error) {
      setShowSuccess(false);
      Toast.notify({ type: 'error', message: 'Project publish failure' });
    } finally {
      setLoading(false);
    }
  };
  //----------------更新detail状态---------------
  // const handleSave = (updatedData) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     detail: {
  //       ...prevState.detail,
  //       title: updatedData.title,
  //       description: updatedData.description,
  //     },
  //   }));
  // };

  const {
    messages,
    projectCode,
    codeString,
    generateLoading,
    detail,
    displayType,
    features,
  } = state;

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (event: MouseEvent) => {
      let newWidth = Math.max(360, startWidth + event.clientX - startX);
      if (newWidth > 480) {
        newWidth = 480;
      }
      setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    const params = getUrlParams();
    const _projectCode = params.get('projectCode');
    if (!_projectCode) {
      Toast.notify({
        type: 'error',
        message: 'Invalid access path',
      });
      router.replace('/');
      return;
    }

    setState({ projectCode: _projectCode });
  }, []);

  useEffect(() => {
    if (!projectCode) {
      return;
    }
    getDemandDetail();
    getChatHistory();
    getArtifacts();
    getProjectAttributes();
  }, [projectCode]);

  useEffect(() => {
    if (messages?.length === 0) {
      return;
    }
    const generateKey = `${projectCode}-generate-demo`;
    const userPrompt: any = localStorage.getItem(generateKey);
    if (!!userPrompt && firstRef.current && detail?.step === 'PRE_DESIGN') {
      handleGenerate(
        'Generate Demo based on the file below.',
        JSON.parse(userPrompt),
        () => {
          localStorage.removeItem(generateKey);
        }
      );
      firstRef.current = false;
    }
  }, [messages?.length, detail?.step]);

  const getDemandDetail = async () => {
    const { suc, data } = await API.project.detail({ projectCode });
    if (!suc) {
      return;
    }
    setState({ detail: data });
  };
  useEffect(() =>{
    getDemandDetail();
  },[title1, desc1])

  const getChatHistory = async () => {
    const { suc, data, hasMore } = await API.project.chatHistory({
      projectCode,
      asc: true,
      pageSize: 100,
    });

    if (!suc) {
      return;
    }

    const messages = (data?.data || [])
      .map((item: any) => {
        return {
          type: item?.sender?.includes('Assistant') ? 'robot' : 'user',
          content: item.message,
          time: item.sentAt,
        };
      })
      .reverse();

    setState({ messages });
  };

  const getArtifacts = async () => {
    const { suc, data } = await API.project.artifacts({ projectCode });
    if (!suc) {
      return;
    }

    let features = [];
    let codeString = '';
    (data?.artifacts || []).forEach((item: any) => {
      if (item.type === 'FEATURE_LIST') {
        features = JSON.parse(item.content || '[]').map(
          (feature: any, index: number) => ({ id: index, ...feature })
        );
      }
      if (item.type === 'DEMO') {
        codeString = item.content;
      }
    });
    setState({ features, codeString });
  };

  const handleGenerate = async (
    value: string,
    other?: any,
    finishCall?: any
  ) => {
    const { step, attachments } = other || {};
    if (!value.trim()) {
      return;
    }
    const _msgList = handleSendMessage(messages, value, 'user');
    setState({ generateLoading: true });
    isCloseRef.current = false;

    try {
      const params = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          projectCode,
          prompt: value,
          opt: step || 'MODIFY_PROTO',
          attachments,
        }),
      };
      await fetchEventSource('https://api.indieapp.ai/v1/projects/ai/chat', {
        method: 'POST',
        ...params,
        async onopen(response: any) {
          if (
            !response.ok ||
            response.headers.get('content-type') !== 'text/event-stream'
          ) {
            throw new Error('建立连接失败');
          }
        },
        openWhenHidden: true,
        onmessage(event: any) {
          const line = event.data.replace(/data:\s*/g, '');

          if (['#fls#', '#dcs#', '#end#'].includes(line)) {
            receiveMark.current = line;
            return;
          }

          if (!receiveMark.current) {
            handleSendMessage(_msgList, line, 'robot');
          }

          if (receiveMark.current === '#fls#') {
            setState({ features: JSON.parse(line || '[]') });
          }

          if (receiveMark.current === '#dcs#') {
            setState({ codeString: line });
          }

          if (line === '#end#' && !!finishCall) {
            finishCall();
          }
        },
        onerror(err: any) {
          throw err;
        },
        onclose() {
          if (isCloseRef.current) {
            return;
          }
          isCloseRef.current = true;
          receiveMark.current = '';
          setState({ generateLoading: false });
        },
      });
    } catch (error) {
      setState({ generateLoading: false });
    }
  };

  const handleSendMessage = (messages: any[], value: string, type: string) => {
    if (!value.trim()) {
      return;
    }

    const messageList = [...messages, { content: value, type }];
    setState({ userInput: '', messages: messageList });
    return messageList;
  };

  const handleGenerateDemo = (funcList: any) => {
    const params = {
      attachments: [
        {
          type: 'FEATURE_LIST',
          content: JSON.stringify(
            funcList.map((item: any) => ({
              name: item.name,
              description: item.description,
            }))
          ),
        },
      ],
    };

    handleGenerate('Generate Demo based on the file below.', params);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full bg-white flex items-center justify-between py-3 px-8 sticky top-0 z-10 border-b border-gray-100 fixed">
        <Link href="/" className="text-gray-800 flex items-center">
          <Logo />
        </Link>
        <div className="flex-1 flex items-center">
          <p className="font-medium text-inherit ml-4">
            {detail?.title || 'Indieapp'}
          </p>
          {!!detail?.visibility && (
            <Chip
              className="ml-2 px-2"
              size="sm"
              variant="flat"
              startContent={
                detail.visibility === 'PUBLIC' ? (
                  <HiLockOpen />
                ) : (
                  <HiLockClosed />
                )
              }
            >
              {detail.visibility === 'PUBLIC' ? 'Public' : 'Private'}
            </Chip>
          )}
          {/* <button>
            <div className='flex flex-row gap-1 items-center ml-6 border-gray-300 border-1 rounded-[15px] px-2 py-1'>
              {attribute === 'PUBLIC' ? <FaUnlock size={12} />:  <FaLock size={12} />}
              <p className='text-[13px]'>{attribute === 'PUBLIC' ? 'Public':'Private'}</p>
            </div>
          </button> */}
        </div>
        <button onClick={onOpenSetting}>
          <PiGearBold size={24} color="black" className="mr-3" />
        </button>
        <ProjectSettingModal
          isOpen={isOpenSetting}
          onOpenChange={onOpenChangeSetting}
          projectCode={projectCode}
          //onSave={handleSave}
          setTitle1={setTitle1}
          setDesc1={setDesc1}
        />

        {loadingFinished ? (
          <Button className="bg-[#D9EBFF]">
            <div className="w-[12PX] h-[12PX] rounded-[50%] border-4 border-[#c0ddff] bg-[#006FEE]"></div>
            <p className="text-[14px] text-[#006FEE]">Manage Published</p>
          </Button>
        ) : (
          <Button
            className={
              loading ? 'bg-[#A1A1AA] h-[30px]' : 'bg-gray-800 h-[30px]'
            }
            color="primary"
            size="sm"
            startContent={
              loading ? (
                <Spinner color="default" size="sm" />
              ) : (
                <HiCloudUpload fontSize="16" />
              )
            }
            onPress={() => {
              onOpen();
              getPublicationInfo();
            }}
          >
            Publish
          </Button>
        )}
      </div>
      <div className="relative">
        {loadingFinished ? (
          showSuccess ? (
            <div
              className="bg-[#16BE5E] w-[345px] h-[45px] rounded-md flex flex-row gap-2 justify-center items-center absolute right-5 top-[-20px]"
              style={{ zIndex: '110' }}
            >
              <FaCircleCheck color="#ffffff" />
              <p className=" text-white text-[14px]">
                Your prototype was published successfully
              </p>
            </div>
          ) : null
        ) : null}
      </div>
      <PublishModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        loading={loading}
        loadingFinished={loadingFinished}
        onPublish={handlePublish}
        handleCopy={handleCopy}
        copy={copy}
        showSuccess={showSuccess}
        time={time}
        projectCode={projectCode}
        visibility={attribute}
        setAttribute={setAttribute}
      />
      <div className="h-0 flex-1 flex bg-[#f8f8f8]">
        <div style={{ width: leftWidth }}>
          <ChatView
            messages={messages}
            loading={generateLoading}
            onSend={handleGenerate}
          />
        </div>
        <div
          className="w-[1px] bg-gray-200 cursor-col-resize"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'col-resize' }}
        />
        <div className="flex flex-1 h-full flex-col">
          <div className="bg-white py-3 px-6 flex items-center">
            {displayType === 'demo' ? (
              <>
                <Button
                  className="h-[36px] mr-2 bg-gray-100"
                  radius="sm"
                  onPress={() => setState({ displayType: 'demo' })}
                >
                  Demo
                </Button>
                <Button
                  className="h-[36px]"
                  variant="light"
                  onPress={() => setState({ displayType: 'feature' })}
                >
                  Feature List
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="h-[36px]"
                  radius="sm"
                  variant="light"
                  onPress={() => setState({ displayType: 'demo' })}
                >
                  Demo
                </Button>
                <Button
                  className="h-[36px] mr-2 bg-gray-100"
                  onPress={() => setState({ displayType: 'feature' })}
                >
                  Feature List
                </Button>
              </>
            )}
            {displayType === 'feature' && (
              <div className="flex-1 text-right">
                <Button
                  color="primary"
                  className="h-[36px]"
                  onPress={() => {
                    featureRef?.current?.generateDemo();
                    setState({ displayType: 'demo' });
                  }}
                >
                  Generate Demo
                </Button>
              </div>
            )}
            {/* <Tabs aria-label='Options' size='sm'>
              <Tab key='mobile' title={<FiZoomIn />} />
              <Tab key='tablet' title={<FiZoomOut />} />
            </Tabs>

            <Tabs aria-label='Options' size='sm' className='mx-4' defaultSelectedKey='pc'>
              <Tab key='mobile' title={<FiSmartphone />} />
              <Tab key='tablet' title={<FiTablet />} />
              <Tab key='pc' title={<FiMonitor />} />
            </Tabs>

            <Button
              startContent={<HiOutlineCursorClick />}
              variant='light'
              size='sm'
            >
              New Edit
            </Button> */}
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayType === 'demo' ? (
              <ReactFlowProvider>
                <FlowView codeString={codeString} loading={generateLoading} />
              </ReactFlowProvider>
            ) : (
              <ProjectFeatures
                ref={featureRef}
                data={features}
                disabled={generateLoading}
                onGenerateDemo={handleGenerateDemo}
                showSkeleton={generateLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
