import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Chip,
  useDisclosure,
} from '@heroui/react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useGlobalState } from '@/contexts/GlobalStateContext';
import { getCurrUserAvatarUrl } from '@/utils';
import React from 'react';
import ModalCard from '../PopOutBox'; // 引入新的 ModalCard 组件
import Pagination from '@/components/Pagination';
import SkeletonList from '@/components/SkeletonList';
import { useSet } from '@/utils/hooks';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import API from '@/services';
import { Descriptions } from 'antd';

const getRandomImageUrl = () => {
  const random = Math.floor(Math.random() * 3) + 1; // 生成 1, 2 或 3
  return `/assets/project_image_empt_${random}.png`;
};

export default (props: any) => {
  const {
    getDataSource,
    onItemCick,
    onItemRemove,
    showPagination = true,
    type,
  } = props;
  const { userInfo } = useGlobalState();
  const [showOverlay, setShowOverlay] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [state, setState] = useSet({
    category: 'ASSET',
    loading: false,
    dataSource: [],
    pageNum: 1,
    pageSize: 20,
    total: 0,
  });
  const { category, loading, pageNum, pageSize, dataSource, total } = state;

  useEffect(() => {
    getDataList();
  }, [category, pageNum]);

  const [cardDetails, setCardDetails] = useSet({
    username:'',
    nickname:'',
    avatarUrl:'',
    title:'',
    description:'',
    featureList:'',
  });
  const{username,
    nickname,
    avatarUrl,
    title,
    description,
    featureList} = cardDetails;

  const getCardDetails = async(projectCode:string) =>{
    try{
      const {data} = await API.project.projectDetails({projectCode});
      const {creatorInfo,title,description,featureList} = data;
      const {username, nickname, avatarUrl} = creatorInfo;
      setCardDetails({username,nickname,avatarUrl,title,description,featureList});
    }catch(error){
      console.log('get project details failure...', error);
    }
  }

  const[coverArt, setCoverArt] = useState('');

  const getDataList = async () => {
    setState({ loading: true });
    try {
      const { success, data } = await getDataSource({
        pageNum,
        pageSize,
      });

      if (!success) {
        setState({ loading: false });
        return;
      }
      const { list, total } = data || {};
      setState({ dataSource: list, total, loading: false });
    } catch (error) {
      setState({ loading: false });
    }
  };

  const handleOpen = (item: any) => {
    setSelectedItem(item);
    setShowOverlay(true);
    onOpen();
  };

  const removeItem = async (data: any) => {
    const result = await onItemRemove(data?.projectCode, data);
    if (result) {
      getDataList();
    }
  };

  const [projectCode,setProjectCode] = useState('');

  //-----------------------收藏的数量-----------------------
  const [savedNumber, setSavedNumber] = useState(0);
  const saveNum = async(projectCode:string) =>{
    try{
        const { data } = await API.project.saveNum({
          projectCode: projectCode,
        });
        setSavedNumber(data);
        console.log(data);
      }catch(error){
        console.log('saveNum fetch fail...');
      }
  }
  return (
    <div>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          {showOverlay && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50"></div>
          )}
          <div>
            <ModalCard
              projectCode={projectCode}
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setShowOverlay(false);
              }}
              selectedItem={selectedItem}
              onItemClick={onItemCick}
              type={type}
              username={username}
              nickname={nickname}
              avatarUrl={avatarUrl}
              title={title}
              description={description}
              featureList={featureList}
              coverArt={coverArt}
              getRandomImageUrl={getRandomImageUrl}
              savedNumber = {savedNumber}
            />
          </div>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {dataSource.map((item: any) => (
              <Card
                key={item.projectCode}
                className="rounded-lg p-4"
                shadow="md"
              >
                <CardBody
                  className="overflow-visible p-0 pb-2"
                  // onClick={() => {
                  //   setShowOverlay(true);
                  //   handleOpen(item);
                  // }}
                  onClick={() => {
                    if (type === 'self') {
                      onItemCick(item.projectCode, item);
                      setProjectCode(item.projectCode);
                    } else {
                      setShowOverlay(true);
                      handleOpen(item);
                      getCardDetails(item.projectCode);
                      setProjectCode(item.projectCode);
                      setCoverArt(item.coverArt);
                      saveNum(item.projectCode);
                    }
                  }}
                >
                  <div className="rounded-lg overflow-hidden h-[200px] flex justify-center bg-gray-100 relative">
                    {type !== 'self' && item.creator === userInfo?.username && (
                      <Chip
                        className="absolute left-4 top-3 bg-white"
                        size="sm"
                        radius="sm"
                        color="success"
                      >
                        mine
                      </Chip>
                    )}
                    <Image
                      src={item.coverArt || getRandomImageUrl()}
                      alt="HeroUI hero Image with delay"
                      height={180}
                      className="w-full cursor-pointer"
                      loading="lazy"
                    />
                  </div>
                </CardBody>
                <CardFooter className="text-sm justify-between p-0 rounded-none">
                  <div className="max-w-xs truncate rounded-none">
                    {item.title}
                  </div>
                  {type !== 'self' && (
                    <div className="flex flex-row gap-1">
                      <MdOutlineRemoveRedEye
                        className="flex-shrink-0"
                        color="#71717A"
                        size={20}
                      />{' '}
                      <p>{item.pv}</p>
                    </div>
                  )}
                  {type === 'self' && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          startContent={<HiDotsHorizontal size={18} />}
                          variant="light"
                          size="sm"
                          className="px-0 w-[30px] min-w-[30px] h-[24px]"
                        />
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="edit"
                          onPress={() => onItemCick(item.projectCode, item)}
                        >
                          Edit project
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onPress={() => removeItem(item)}
                        >
                          Delete project
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </CardFooter>
                {type !== 'self' && (
                  <CardFooter className="justify-left p-0 pt-2 text-sm">
                    <Avatar
                      src={getCurrUserAvatarUrl(item?.creatorInfo)}
                      className="w-[28px] h-[28px]"
                    />
                    <span className="ml-2">{item?.creatorInfo?.nickname}</span>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
          {!!total && showPagination && (
            <div className="mt-8 w-full">
              <Pagination
                className="max-w-[640px] mx-auto flex justify-center"
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onChange={(pageNum: number) => setState({ pageNum })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
