'use client';
import { useRef } from 'react';
import { Button, Link } from '@heroui/react';
import API from '@/services';
import ProjectList from '@/components/ProjectList';
import Navbar from './home/navbar';
import WoaaIcon from '@/components/svg/WoaaIcon';
import SnakeIcon from '@/components/svg/SnakeIcon';
import StartIcon from '@/components/svg/StartIcon';
import SpeakIcon from '@/components/svg/SpeakIcon';
import EmailIcon from '@/components/svg/EmailIcon';
import Headline from '@/components/svg/Headline';
import JoinIcon from '@/components/svg/JoinIcon';
import InputPrompt from './home/InputPrompt';

import {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * 平台首页入口
 *
 */
export default () => {
  const textareaRef = useRef(null);

  const handleCardClick = (code: any) => {
    window.open(`/preview?projectCode=${code}`, '_blank');
  };

  const handleScrollAndFocus = () => {
    if (textareaRef.current) {
      // 滚动到 Textarea 的位置
      textareaRef.current.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'center', // 居中显示
      });

      // 聚焦 Textarea，稍微延迟确保滚动完成后再触发
      setTimeout(() => {
        textareaRef.current.focus();
      }, 500); // 延迟时间视情况调整
    }
  };

  const getProjectList = async ({ pageNum }: any) => {
    try {
      const res = await API.project.pubList({
        username:'',
        keyword:'',
        sortField:'creation_time',
        asc:false,
        pageNum,
        pageSize: 12,
      });
      return {
        success: res.suc,
        data: {
          ...res?.data,
          list: res?.data?.data,
        },
      };
    } catch (error) {}
  };

  return (
    <ReactFlowProvider>
      <div className='relative flex flex-col h-screen home-page overflow-x-hidden'>
        <Navbar />
        <main className='container w-[95%] max-w-[1440px] mx-auto flex-grow py-16'>
          <div className='mt-3'>
            <div className='flex flex-col items-center'>
              <Headline />
              <h1 className='text-center leading-loose'>
                Turn your ideas into live sites, products or platforms within
                few lines. <br />
                You shoot for the moon; leave rocket building to us.
              </h1>
            </div>
            <div className='flex justify-center items-center gap-4 w-4/5 mx-auto mb-[240px]'>
              <div className='flex flex-wrap md:flex-nowrap mb-6 md:mb-0 w-[100%] md:w-[75%] gap-4 mt-11'>
                <InputPrompt textareaRef={textareaRef} />
              </div>
            </div>
            <div className='relative'>
              <SnakeIcon className='absolute right-[-5%] -top-[35px] ' />
              <div className='flex flex-col justify-center items-center mx-auto mb-[168px] mt-8'>
                <WoaaIcon />
                <div className='text-center text-[48px] font-medium z-10 leading-[58px] my-6'>
                  Build With Us
                </div>
                <div className='text-center leading-loose z-10 leading-[30px]'>
                  We hold a strong and active community for all the independent
                  creators, <br />
                  early startups and potential investors to level your idea up
                </div>
              </div>
              <ProjectList
                getDataSource={getProjectList}
                onItemCick={handleCardClick}
                showPagination={false}
              />
            </div>
          </div>
          <div className='flex justify-center items-center mt-[72px]'>
            <Button className='bg-white border border-gray-300'>
              Go to Community
            </Button>
            <Button
              color='primary'
              className='ml-4'
              startContent={<StartIcon />}
              onPress={handleScrollAndFocus}
            >
              Try Indieapp
            </Button>
          </div>
          <div className='rounded-lg w-full bg-black h-[256px] mt-[140px] text-white flex justify-between items-center p-12 gap-4'>
            <div>
              <div className='text-[26px] md:text-[48px] relative font-medium'>
                Speak it aloud
                <SpeakIcon className='absolute left-[75%] -top-[5px]' />
              </div>
              <div className='mt-5'>
                Any thoughts? Share with us on Discord or email us!
              </div>
            </div>
            <div>
              <Button
                className='text-white'
                variant='light'
                startContent={<EmailIcon />}
              >
                Email us
              </Button>
              <Button
                className='text-white'
                variant='light'
                startContent={<JoinIcon />}
              >
                Join Discord
              </Button>
            </div>
          </div>
        </main>
        <footer className='w-full flex items-center justify-center py-5'>
          <Link className='flex items-center gap-1 text-current' title='app'>
            <span className='text-default-600'>Powered by</span>
            <p className='text-primary'>Indieapp</p>
          </Link>
        </footer>
        <Background
          gap={30}
          size={3}
          color='#c6c6c6'
          variant={BackgroundVariant.Dots}
        />
      </div>
    </ReactFlowProvider>
  );
};
