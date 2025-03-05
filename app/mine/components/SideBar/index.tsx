import React, { useState, useEffect } from 'react';
import { RxExit } from 'react-icons/rx';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdFavoriteBorder, MdWorkOutline } from 'react-icons/md';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Link, 
  useDisclosure,
  Button, 
  Avatar,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { getCurrUserAvatarUrl } from '@/utils';
import { useGlobalState } from '@/contexts/GlobalStateContext';

export default function SideBar() {
  const router = useRouter();
  const { userInfo } = useGlobalState();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [active, setActive] = useState('');

  useEffect(() => {
    const path =location?.pathname?.split('/mine/')?.[1] || 'mine';
    setActive(path);
  }, []);

  const handleChangePath = (path: string) => {
    setActive(path);
    router.replace(`/mine/${path}`);
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    router.replace('/');
  };

  return (
    <div className='flex flex-col h-full p-4 min-w-[317px] border-r border-gray-100'>
      <div className='h-0 flex-1'>
        <div>
          <Button
            size='lg'
            color='default'
            variant={active === 'projects' ? 'flat' : 'light'}
            className='w-full text-gray-800 flex justify-start'
            startContent={<MdWorkOutline className='size-4 text-gray-800' />}
            onPress={() => handleChangePath('projects')}
          >
            Project
          </Button>   
          
          <Button
            size='lg'
            color='default'
            variant={active === 'collections' ? 'flat' : 'light'}
            className='w-full text-gray-800 flex justify-start my-2'
            startContent={<MdFavoriteBorder className='size-4 text-gray-800' />}
            onPress={() => handleChangePath('collections')}
          >
            Collection
          </Button>   
        </div>
        <hr className='border-gray-150 my-2' />
        <Button
          color='default'
          size='lg'
          variant={active === 'profile' ? 'flat' : 'light'}
          className='w-full text-gray-800 mb-3 flex justify-start'
          startContent={<IoSettingsOutline className='size-4 text-gray-800' />}
          onPress={() => handleChangePath('profile')}
        >
          Profile
        </Button>   
      </div>
      <div className='px-2 mb-2'>
       <hr className='border-gray-150 mb-5' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center '>
            <Avatar
              isBordered
              src={getCurrUserAvatarUrl(userInfo)}
            />
            <div className='ml-4 text-gray-800'>{userInfo?.nickname}</div>
          </div>
          <Link
            onPress={onOpen}
            className='cursor-pointer text-gray-800 ml-4'
          >
            <RxExit size={20}/>
          </Link>
        </div>
      </div>
      <Modal
          size='sm'
          isOpen={isOpen}
          hideCloseButton
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Confirmation
                </ModalHeader>
                <ModalBody>
                  <p>Do you want to log out?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color='default' size='sm' onPress={onClose}>
                    Close
                  </Button>
                  <Button color='primary' size='sm' onPress={() => handleLogOut()}>
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  );
}
