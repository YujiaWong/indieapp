'use client';
import { Link, Tabs, Tab, Input, Button } from '@heroui/react';
import API from '@/services';
import ProjectList from '@/components/ProjectList';
import Navbar from '../home/navbar';
import { IoSearch } from 'react-icons/io5';
import { TbPencilMinus } from 'react-icons/tb';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default () => {
  const handleCardClick = (code: any) => {
    window.open(`/preview?projectCode=${code}`, '_blank');
  };

  const getProjectList = async ({ pageNum }: any) => {
    try {
      const res = await API.project.pubList({
        pageNum,
        pageSize: 12,
      });
      return {
        success: res.suc,
        data: {
          ...res?.data,
          list: res?.data?.data,
          total: res?.data.total,
        },
      };
    } catch (error) {}
  };

  return (
    <ReactFlowProvider>
      <div className="relative flex flex-col h-screen home-page">
        <Navbar />
        <main className="container w-[95%] max-w-[1440px] mx-auto flex-grow pb-16">
          <div>
            <div className="relative">
              <div className="flex flex-col justify-center items-center mx-auto mb-20 mt-20">
                <img
                  src="/assets/user.png"
                  alt="user"
                  className="w-[48px] pb-6"
                />
                <div className="text-center text-[24px] font-medium z-10 leading-[40px]">
                  Mike Lofthouse
                </div>
                <div className="text-center leading-loose mb-5 z-10 text-[14px]  leading-[30px]">
                  @mikelh123
                </div>
                <div className="flex flex-row gap-2 items-center justify-center mt-2">
                  <TbPencilMinus size={18} className="font-bold" />{' '}
                  <p className="text-[14px] font-medium">Edit</p>
                  
                </div>

                {/* <div className='w-full max-w-[800px]'>
                  <Input
                    className='bg-white'
                    type='search'
                    variant='bordered'
                    placeholder='Search app here'
                    startContent={<IoSearch />}
                    size='lg'
                  />
                </div> */}
              </div>
              <div className="flex justify-center mb-8">
                <Tabs aria-label="Tabs sizes">
                  <Tab key="My Projects" title="My Projects" />
                  <Tab key="Saved" title="Saved" />
                </Tabs>
              </div>
              <ProjectList
                getDataSource={getProjectList}
                onItemCick={handleCardClick}
              />
            </div>
          </div>
        </main>
        <footer className="w-full flex items-center justify-center py-5">
          <Link className="flex items-center gap-1 text-current" title="app">
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">Indieapp</p>
          </Link>
        </footer>

        <Background
          gap={30}
          size={3}
          color="#c6c6c6"
          variant={BackgroundVariant.Dots}
        />
      </div>
    </ReactFlowProvider>
  );
};
