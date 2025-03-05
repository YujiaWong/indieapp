'use client';
import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/services';
import Toast from '@/components/base/toast';
import { Image } from '@heroui/react';
import ProjectList from '@/components/ProjectList';

export default memo(() => {
  const router = useRouter();

  const getProjectList = async ({ pageNum, pageSize }: any) => {
    try {
      const res = await API.user.savedProjects({
        pageNum,
        pageSize
      });

      return {
        success: res.suc,
        data: {
          ...res?.data,
          list: res?.data?.data
        }
      }
    } catch (error) {
      Toast.notify({ type: 'error', message: error || 'projects request failed.' });
    }
  };

  const handleItemClick = (code: any, data: any) => {
    if (data.step === 'DESIGN') {
      router.push(`/design?projectCode=${code}`);
      return;
    }
    router.push(`/demand?projectCode=${code}`);
  };

  return (
    <div className='w-full flex-col h-full p-6 overflow-y-auto'>
      <div className='font-medium text-[20px] leading-[24px] mb-12'>My Collection</div>
      {getProjectList? null: <div className='flex flex-col items-center justify-center'>
        <Image 
          src='/assets/data_empty.png'
          width={240}
        />
        <div>No data found</div>
      </div>}
      
      <ProjectList 
        getDataSource={getProjectList} 
        onItemCick={handleItemClick}
        //onItemRemove={handleItemRemove}
        type='self'
      />
    </div>
  );
})
