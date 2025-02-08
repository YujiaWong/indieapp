import { useEffect, useState } from "react";
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
  Modal,
  ModalFooter,
  ModalContent,
  ModalBody,
  ModalHeader,
} from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BsBookmark } from "react-icons/bs";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { useSet } from "@/utils/hooks";
import Pagination from "@/components/Pagination";
import SkeletonList from "@/components/SkeletonList";
import { HiDotsHorizontal } from "react-icons/hi";
import { useGlobalState } from "@/contexts/GlobalStateContext";
import { getCurrUserAvatarUrl } from "@/utils";
import React from "react";

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
  const [showOverlay, setShowOverlay] = useState(false); //--------------------------控制黑色半透明背景
  const { isOpen, onOpen, onClose } = useDisclosure(); //------------------------ nextUI 弹窗控制
  const [size, setSize] = useState<
    "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full"
  >("3xl");

  const [state, setState] = useSet({
    category: "ASSET",
    loading: false,
    dataSource: [],
    pageNum: 1,
    pageSize: 20,
    total: 0,
  });
  const [selectedItem, setSelectedItem] = useState<any>(null); //----------------------------捕获当前item
  const { category, loading, pageNum, pageSize, dataSource, total } = state;

  useEffect(() => {
    getDataList();
  }, [category, pageNum]);

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
    //------------------------------handle弹窗方法
    setSelectedItem(item);
    setShowOverlay(true);
    if (window.innerWidth < 768) {
      setSize("2xl");
    } else {
      setSize("3xl");
    }
    onOpen();
  };

  const removeItem = async (data: any) => {
    const result = await onItemRemove(data?.projectCode, data);
    if (result) {
      getDataList();
    }
  };

  return (
    <div>
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          {/* //-------------------------------黑色半透明显示-------------------- */}
          {showOverlay && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50"></div>
          )}

          <div>
            <Modal
              isOpen={isOpen}
              size={size}
              closeButton={
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    right: "50%",
                    transform: "translate(420px,-300px)",
                    cursor: "pointer",
                    backgroundColor: "#D4D4D8",
                    padding: "5px",
                    borderRadius: "50%",
                    zIndex: 99,
                  }}
                >
                  <XMarkIcon
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "black",
                    }}
                    onClick={() => {
                      onClose(); //----------------------------关弹窗
                      setShowOverlay(false); //----------------------------关半透明背景
                    }}
                  />
                </div>
              }
            >
              <ModalContent className="relative">
                <ModalHeader className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row justify-between items-center p-1">
                    <p>Crypto portfolio tracker</p>
                    <div className="flex flex-row gap-2">
                      <Button
                        size="sm"
                        color="default"
                        startContent={<BsBookmark size={15} />}
                        variant="bordered"
                        className="font-semibold"
                      >
                        Save<span>(400+)</span>
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#27272A",
                          color: "white",
                        }}
                        startContent={
                          <BsBoxArrowUpRight
                            size={16}
                            style={{ fontWeight: 700 }}
                          />
                        }
                        onPress={() =>
                          onItemCick(selectedItem.projectCode, selectedItem)
                        }
                      >
                        Visit Prototype
                      </Button>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm leading-loose text">
                      An crypto tracker app for mid-level crypto investors to
                      manage their crypto wallets, see unified portfolio
                      instantly, get immediate insights on asset allocation and
                      risk.
                    </p>

                    <div className="flex flex-row  gap-5 ">
                      <div className="w-[360px] md:w-[380px] h-[240px] bg-[#D9D9D9] rounded-xl "></div>
                      <div className="flex flex-col gap-3">
                        <p className="text-sm">
                          The demo includes features as follow:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm ">
                          <li>Feature 1</li>
                          <li>Feature 2</li>
                          <li>Feature 3</li>
                          <li>Feature 4</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center bg-[#EBF5FF] rounded-lg h-[84px] px-8 border-gray-200 border-2">
                      <p className="font-semibold">Meet the creator</p>
                      <div className="flex flex-row">
                        {type !== "self" && (
                          <div className="flex flex-row justify-center items-center">
                            <Avatar
                              src={getCurrUserAvatarUrl(
                                selectedItem?.creatorInfo
                              )}
                              className="w-[28px] h-[28px]"
                            />
                            <span className="ml-2">
                              {selectedItem?.creatorInfo?.nickname}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </div>

          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {dataSource.map((item: any) => (
              <Card
                key={item.projectCode}
                className="rounded-lg p-4"
                shadow="md"
              >
                <CardBody className="overflow-visible p-0 pb-2">
                  <div className="rounded-lg overflow-hidden h-[200px] flex justify-center bg-gray-100 relative">
                    {type !== "self" && item.creator === userInfo?.username && (
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
                      className="w-full cursor-pointer" //------------------------------------添加鼠标抓手显示
                      loading="lazy"
                      //onClick={() => onItemCick(item.projectCode, item)} ---------------------------取消，改为弹窗
                      onClick={() => {
                        setShowOverlay(true);
                        handleOpen(item); //----------------传入当前item给modal组件，并捕获当前item给useState
                      }}
                    />
                  </div>
                </CardBody>
                <CardFooter className="text-sm justify-between p-0">
                  <div className="max-w-xs truncate">{item.title}</div>
                  {type === "self" && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          startContent={<HiDotsHorizontal />}
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
                {type !== "self" && (
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
