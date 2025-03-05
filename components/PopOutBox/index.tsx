import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Image,
} from '@heroui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { BsBookmark, BsBoxArrowUpRight } from 'react-icons/bs';
import { getCurrUserAvatarUrl } from '@/utils';
import { MdArrowForwardIos } from 'react-icons/md';
import { FaBookmark } from 'react-icons/fa';
import API from '@/services';


interface ModalCardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: any;
  onItemClick: (projectCode: string, item: any) => void;
  type?: string;
  username: string;
  nickname: string;
  avatarUrl: string;
  title: string;
  description: string;
  featureList: string;
  projectCode: string;
  coverArt: string;
  getRandomImageUrl: () => string;
  savedNumber: number;
}


const ModalCard: React.FC<ModalCardProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onItemClick,
  type,
  username,
  nickname,
  avatarUrl,
  title,
  description,
  featureList,
  projectCode,
  coverArt,
  getRandomImageUrl,
  savedNumber,
}) => {
  const [Collect, setCollect] = useState(false);
  const handleCollect = () => {
    setCollect(true);
  };

  const [showFeatures, setShowFeatures] = useState(false); //---------------------展示FeatureList
  const handleFeatureShow = () => {
    setShowFeatures(!showFeatures);
  };

  const save = async () => {
    try {
      const { suc, msg } = await API.project.saveProject({
        projectCode: projectCode,
      });
      console.log(projectCode);
      if (suc) {
        console.log('saved successfully');
      }
    } catch (error) {
      console.log('save fail...');
    }
  };
  // const [savedNumber, setSavedNumber] = useState(0);
  // const saveNum = async() =>{
  //   try{
  //     const { data } = await API.project.saveNum({
  //       projectCode: projectCode,
  //     });
  //     setSavedNumber(data);
  //     console.log(data);
  //   }catch(error){
  //     console.log('saveNum fetch fail...');
  //   }
  // }
  return (
    <div>
      <Modal
        isOpen={isOpen}
        size="4xl"
        onClose={onClose}
        style={{
          position: 'relative',
          top: '50px',
          bottom: '10px',
        }}
        closeButton={
          <div
            style={{
              position: 'fixed',
              top: '50%',
              right: '50%',
              transform: 'translate(500px,-330px)',
              cursor: 'pointer',
              backgroundColor: '#D4D4D8',
              padding: '5px',
              borderRadius: '50%',
              zIndex: 99,
            }}
          >
            <XMarkIcon
              style={{
                width: '20px',
                height: '20px',
                color: 'black',
              }}
              onClick={() => {
                onClose(); //----------------------------关弹窗
                //setShowOverlay(false); //----------------------------关半透明背景
              }}
            />
          </div>
        }
      >
        <ModalContent className="relative mt-10 w-full">
          <ModalHeader className="flex flex-col gap-1 py-1">
            <div className="flex flex-col md:flex-row justify-between items-center p-1">
              <div className="flex flex-col gap-1 pt-2">
                <p className="text-[20px]">{title}</p>
                <div className="flex flex-row">
                  {type !== 'self' && (
                    <div className="flex flex-row justify-center items-center">
                      <Avatar
                        src={getCurrUserAvatarUrl(selectedItem?.creatorInfo)}
                        className="w-[28px] h-[28px]"
                      />
                      <span className="ml-2 text-[#11181c] text-[14px] font-normal">
                        {selectedItem?.creatorInfo?.nickname}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <Button
                  size="md"
                  color="default"
                  startContent={
                    (Collect) ? (
                      <FaBookmark size={18} color="#fdd14a" />
                    ) : (
                      <BsBookmark size={18} />
                    )
                  }
                  variant="bordered"
                  className="font-semibold"
                  onPress={() => {
                    handleCollect();
                    save();
                  }}
                >
                  Save<span>({savedNumber})</span>
                </Button>
                <Button
                  size="md"
                  style={{
                    backgroundColor: '#27272A',
                    color: 'white',
                  }}
                  startContent={
                    <BsBoxArrowUpRight size={18} style={{ fontWeight: 700 }} />
                  }
                  onPress={() =>
                    onItemClick(selectedItem.projectCode, selectedItem)
                  }
                >
                  Visit Prototype
                </Button>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="w-full">
            <div className="flex flex-col ">
              <p className="text-sm leading-loose text-[14px]">
                {description} 此处description无数据，字段对应ui待确认
              </p>

              <div className="flex flex-col gap-2 justify-center items-center">
                {/* <div className="w-[100%] h-[540px] bg-[#D9D9D9] "></div> */}

                <Image
                  src={coverArt || getRandomImageUrl()}
                  alt="HeroUI hero Image with delay"
                  height={540}
                  className="w-full cursor-pointer"
                  loading="lazy"
                />
                <div>
                  {/* <div className='border border-gray-200 rounded-lg flex flex-row gap-1 items-center pl-1'>
                    <Button
                      disableRipple
                      size='sm'
                      className='bg-white px-0 py-0'
                      onPress={handleFeatureShow}
                    >
                      {showFeatures ? (
                        <MdArrowForwardIos size={15} className='rotate-90' />
                      ) : (
                        <MdArrowForwardIos size={15} />
                      )}
                    </Button>
                    <p className='16px text-black py-[20px]'>Feature List</p>
                  </div> */}
                  {/* {showFeatures ? (
                    <div className='flex flex-col gap-3 border border-gray-200 rounded-lg p-4 pl-6 border-t-0'>
                      <p className='text-sm'>
                        The demo includes features as follow:
                      </p>
                      <ul className='list-disc pl-5 space-y-2 text-sm'>
                        <li>{featureList}</li>
                        <li>Feature 2</li>
                        
                      </ul>
                    </div>
                  ) : null} */}
                </div>
              </div>

              {/* <div className='flex flex-row justify-between items-center bg-[#EBF5FF] rounded-lg h-[84px] px-8 border-gray-200 border-2'>
                <p className='font-semibold'>Meet the creator</p>
                <div className='flex flex-row'>
                  {type !== 'self' && (
                    <div className='flex flex-row justify-center items-center'>
                      <Avatar
                        src={getCurrUserAvatarUrl(selectedItem?.creatorInfo)}
                        className='w-[28px] h-[28px]'
                      />
                      <span className='ml-2'>
                        {selectedItem?.creatorInfo?.nickname}
                      </span>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </ModalBody>
          {/* <ModalFooter></ModalFooter> */}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalCard;
