// components/PublishModal.tsx
import { useState } from 'react';
import API from '@/services';
import dayjs from 'dayjs';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Button,
  Spinner,
  Link,
} from '@heroui/react';
import { FaUnlock, FaLock, FaCheck } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { PiBrowserBold } from 'react-icons/pi';
import CopyButton from '../clipBoard';
import { FaLink } from 'react-icons/fa6';

type PublishModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loading: boolean;
  loadingFinished: boolean;
  onPublish: () => void;
  handleCopy: () => void;
  copy: boolean;
  showSuccess: boolean;
  time:any;
  projectCode:string;
  visibility:string;
  setAttribute:(attribute:string) =>void;
};
const copyURL = 'https://indieapp.ai/community/projectcode';



const PublishModal = ({
  isOpen,
  onOpenChange,
  loading,
  loadingFinished,
  onPublish,
  handleCopy,
  copy,
  showSuccess,
  time,
  projectCode,
  visibility,
  setAttribute,
}: PublishModalProps) => {
  const formattedDate = dayjs(time).format('MM/DD/YYYY HH:mm');

  const switchPrivacy = async (projectCode, visibility) => {
    try {
      const { data } = await API.project.switchPrivacy({
        projectCode,
        visibility,
      });
      console.log('成功switch');
      setAttribute('Private');
      return data;
    } catch (error) {
      console.log('switch privacy fail...', error);
    }
  };
  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      backdrop="transparent"
      onOpenChange={onOpenChange}
      closeButton={<div></div>}
    >
      <ModalContent className="absolute top-[-10px] right-[5px] ">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <p className="text-[14px] pb-4">
                  {loadingFinished
                    ? 'Current Published'
                    : 'Publish to community'}
                </p>
                {loadingFinished ? null : (
                  <p className="text-[14px]  leading-loose">
                    Publish this prototype to inspire our community. People can
                    view and remix your work. But your chat remains private.
                  </p>
                )}
                {loadingFinished ? null : (
                  <div className="flex items-center justify-center">
                    <img src="/assets/prototype.png" alt="" width={'412px'} />
                  </div>
                )}
                {/* 
                <div className="bg-[#F4F4F5] rounded-md border border-[#E4E4E7] p-4 flex flex-row items-center">
                  <div>
                    <div className="flex flex-row gap-3 items-center">
                      {loadingFinished ? (
                        <div className="flex flex-row gap-3 items-center">
                          <FaUnlock size={12} />
                          <p className="text-[13px]">Public</p>
                        </div>
                      ) : (
                        <div className="flex flex-row gap-3 items-center">
                          <FaLock size={12} />
                          <p className="text-[13px]">Private</p>
                        </div>
                      )}
                    </div>
                    {loadingFinished ? (
                      <p className="text-[13px] pl-6">
                        Everyone in the community can view and remix with the
                        project prototype.
                      </p>
                    ) : (
                      <p className="text-[13px] pl-6">
                        Only you can view and edit the project prototype.
                      </p>
                    )}
                  </div>
                  {loadingFinished ? (
                    <Button
                      color="primary"
                      variant="light"
                      className="pl-4"
                      onPress={() => {
                        switchPrivacy(projectCode, visibility);
                      }}
                    >
                      Reset to Private
                    </Button>
                  ) : null}
                </div> */}
                {loadingFinished ? (
                  <div className="flex flex-col gap-4 mt-1">
                    {/* <hr />
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-[12PX] h-[12PX] rounded-[50%] border-4 border-[#D9EBFF] bg-[#006FEE]"></div>
                      <p className="text-[14px]">Live prototype</p>
                    </div> */}
                    <div className="h-[66px] rounded-md border-1 border-[#E4E4E7] flex flex-row justify-between items-center px-4">
                      <div className="flex flex-row gap-4 items-center">
                        <PiBrowserBold size={16} />
                        <div className="flex flex-col">
                          <p className="text-black text-[14px]">Prototype</p>
                          <p className="text-[#71717A] text-[10px]">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                      <button className="mr-4">
                        <div className="flex flex-row justify-center items-center gap-2 ">
                          <FaLink color="#006fee" size={20} />
                          <p className="text-[#006fee] text-[14px]">
                            Copy Link
                          </p>
                        </div>
                      </button>
                      {/* <div className="w-[46px] h-[18px] bg-[#D7F4E4] rounded-md p-1">
                        <p className="text-[#16BE5E] text-[10px] text-center">
                          latest
                        </p>
                      </div> */}
                    </div>
                    {/* <div className="flex flex-row justify-center items-center">
                      <div className="w-[90%] h-[49px] border-1 border-[#E4E4E7] bg-[#ECECEE] rounded-md rounded-r-none text-[#A1A1AA] text-[14px] p-4 flex items-center">
                        {copyURL}
                      </div>
                      <button
                        className="w-[10%] h-[49px] bg-white rounded-md rounded-l-none border-1 border-l-0 border-[#E4E4E7] flex flex-row justify-center items-center"
                        onClick={handleCopy}
                      >
                        {copy ? (
                          <FaCheck color="black" size={18} />
                        ) : (
                          <CopyButton text={copyURL} />
                        )}
                      </button>
                    </div> */}
                  </div>
                ) : null}
              </div>
            </ModalBody>
            <ModalFooter>
              {/* //finished完成就出现2个button，gocommunity&unpublish */}
              {loadingFinished ? (
                <div className="flex flex-row justify-end items-center gap-2">
                  <Button color="default" variant="bordered" size="md">
                    Unpublish
                  </Button>
                  <Button className="bg-black text-white">
                    <Link href='/community' className='text-white text-[14px]'>View in Community</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  className={
                    loading
                      ? 'bg-[#A1A1AA] w-[100%] disabled:cursor-not-allowed'
                      : loadingFinished
                        ? 'bg-black w-[100%]'
                        : 'bg-black w-[100%]'
                  }
                  onPress={onPublish}
                >
                  <p className="text-white py-4">
                    {loadingFinished ? 'Publish selected prototype' : 'Publish'}
                  </p>
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PublishModal;
