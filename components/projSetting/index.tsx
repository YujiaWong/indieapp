import React, { useEffect, useState } from 'react';
import API from '@/services';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
} from '@heroui/react';

export default function ProjectSettingModal({isOpen, onOpenChange,projectCode,setTitle1, setDesc1}) {
  const[title, setTitle] = useState(' ');
  const[desc, setDesc] = useState(' ');
  const handleTitle = (eTitle:any) =>{
    setTitle(eTitle.target.value);
  }
  const handleDesc = (eDesc:any) =>{
    setDesc(eDesc.target.value);
  } 

  const editProject = async(projectCode) =>{
    try{
        const {suc, msg} = await API.project.editProjectInfo({projectCode,title, description:desc});
        if(suc) {
            console.log('update successfully!');
            //onSave({ title, description: desc });
        }
    }catch(error){
        console.log('update information fail...')
    }
  }
  useEffect(() =>{
    editProject(projectCode);
  },[title,desc]);
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='md'
        backdrop='transparent'
        closeButton={<div></div>}
        className='absolute top-[-10px] right-[110px]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Project Setting
              </ModalHeader>
              <ModalBody className='flex flex-col gap-5'>
                <Input
                  radius='sm'
                  className=' w-[100%]'
                  placeholder='Change your Title'
                  label='Project Title'
                  labelPlacement='outside'
                  variant='bordered'
                  // eslint-disable-next-line no-console
                  onClear={() => console.log('input cleared')}
                  onChange={handleTitle}
                />
                <Textarea
                  radius='sm'
                  className='w-full'
                  label='Project Description'
                  labelPlacement='outside'
                  placeholder='Change your description'
                  variant='bordered'
                  onChange={handleDesc}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className='bg-white border-2 border-gray-300 text-black'
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button className='bg-black text-white' onPress={() => {onClose(), editProject(projectCode), setDesc1(desc), setTitle1(title)}}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
