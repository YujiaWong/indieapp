'use client';
import React, { memo } from 'react';
import { Button, Modal, ModalContent, Tabs, Tab, useDisclosure } from '@heroui/react';
import { useRouter } from 'next/navigation';

import API from '@/services';
import { HiPlus } from 'react-icons/hi';
import Toast from '@/components/base/toast';
import ProjectList from '@/components/ProjectList';
import InputPrompt from '../../home/InputPrompt';

export default memo(() => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getProjectList = async ({ pageNum, pageSize }: any) => {
    try {
      const res = await API.user.projects({
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

  const handleItemRemove = async (code: string) => {
    try {
      const { suc, error } = await API.project.remove({
        projectCodes: [code]
      });

      if (!suc) {
        Toast.notify({ type: 'error', message: error || 'project delete failed.' });
      }

      return suc;
    } catch (error) {
      Toast.notify({ type: 'error', message: error || 'project delete failed.' });
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
      <div className='font-medium text-[20px] leading-[24px] mb-12'>My Project</div>
      <div className='flex items-center justify-between mb-5'>
        <Tabs aria-label='Tabs sizes'>
          <Tab key='all' title='All' />
          <Tab key='published' title='Published' />
          <Tab key='drafts' title='Drafts' />
        </Tabs>
        <Button
          color='primary'
          radius='md'
          className='bg-black'
          startContent={<HiPlus />}
          onPress={onOpen}
        >
          new project
        </Button> 
      </div>
      <ProjectList 
        getDataSource={getProjectList} 
        onItemCick={handleItemClick}
        onItemRemove={handleItemRemove}
        type='self'
      />
      <Modal
        isOpen={isOpen}
        hideCloseButton
        onOpenChange={onOpenChange}
        size='xl'
      >
        <ModalContent>
          {(onClose) => (
            <InputPrompt />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
})
