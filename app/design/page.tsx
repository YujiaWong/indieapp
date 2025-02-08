"use client";
import { useEffect, useState, useRef } from "react";
import {
  Link,
  Button,
  Chip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  spinner,
  Spinner,
  Badge,
  Input,
} from "@nextui-org/react";
import API from "@/services";
import { FaCircleCheck } from "react-icons/fa6";
import { FaUnlock } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { useSet } from "@/utils/hooks";
import { FiCopy } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { PiBrowserBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ReactFlowProvider } from "@xyflow/react";
import domtoimage from "dom-to-image-more";
import { HiCloudUpload, HiLockClosed, HiLockOpen } from "react-icons/hi";
import { AiOutlineHistory } from "react-icons/ai";
import Toast from "@/components/base/toast";
import { getUrlParams } from "@/utils";
import { Logo } from "@/components/icons";
import ChatView from "@/components/ChatView";
import ProjectFeatures from "@/components/ProjectFeatures";
import FlowView from "./PageView";

export default () => {
  const [leftWidth, setLeftWidth] = useState(480); // 初始化宽度
  const isCloseRef = useRef<boolean>();
  const receiveMark = useRef("");
  const firstRef = useRef(true);
  const featureRef: any = useRef();
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //publish弹窗控制
  const [loading, setLoading] = useState(false); //----------------判断button转圈加载
  const [loadingFinished, setLoadingFinished] = useState(false); //---------------判断是否转圈加载成功
  const [copy, setCopy] = useState(false); //-------------------判断是否复制作品url
  const [showSuccess, setShowSuccess] = useState(true); //--------------------控制绿色success Bar的state
  const handleCopy = () => {
    setCopy(true);
  };
  loadingFinished ? setTimeout(() => setShowSuccess(false), 2000) : null; //-------------------控制绿色success Bar3秒后消失

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoadingFinished(true), setLoading(false);
    }, 3000);
  };

  const [state, setState] = useSet({
    messages: [],
    features: [],
    detail: null,
    userInput: "",
    generateLoading: false,
    projectCode: null,
    assetCode: "",
    optStep: "CLARIFY_IDEA",
    codeString: "",
    displayType: "demo",
  });

  const {
    messages,
    projectCode,
    codeString,
    generateLoading,
    detail,
    displayType,
    features,
  } = state;

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (event: MouseEvent) => {
      let newWidth = Math.max(360, startWidth + event.clientX - startX); // 最小宽度 200px
      if (newWidth > 480) {
        newWidth = 480;
      }
      setLeftWidth(newWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    // window.addEventListener('message', (event) => {
    //   // 确保消息来自你信任的源
    //   if (event.origin !== 'https://your-expected-origin.com') {
    //     return;
    //   }

    //   // 处理数据
    //   const iframeWindow = event.data;
    //   console.log(iframeWindow);
    // });
    const params = getUrlParams();
    const _projectCode = params.get("projectCode");
    if (!_projectCode) {
      Toast.notify({
        type: "error",
        message: "Invalid access path",
      });
      router.replace("/");
      return;
    }

    setState({ projectCode: _projectCode });
  }, []);

  useEffect(() => {
    if (!projectCode) {
      return;
    }
    getDemandDetail();
    getChatHistory();
    getArtifacts();
  }, [projectCode]);

  useEffect(() => {
    if (messages?.length === 0) {
      return;
    }
    const generateKey = `${projectCode}-generate-demo`;
    const userPrompt: any = localStorage.getItem(generateKey);
    // 说明是第一次，直接创建
    if (!!userPrompt && firstRef.current && detail?.step === "PRE_DESIGN") {
      handleGenerate(
        "Generate Demo based on the file below.",
        JSON.parse(userPrompt),
        () => {
          localStorage.removeItem(generateKey);
        }
      );
      firstRef.current = false;
    }
  }, [messages?.length, detail?.step]);

  const getDemandDetail = async () => {
    const { suc, data } = await API.project.detail({ projectCode });
    if (!suc) {
      return;
    }
    setState({ detail: data });
  };

  const getChatHistory = async () => {
    const { suc, data, hasMore } = await API.project.chatHistory({
      projectCode,
      asc: true,
      pageSize: 100,
    });

    if (!suc) {
      return;
    }

    const messages = (data?.data || [])
      .map((item: any) => {
        return {
          type: item?.sender?.includes("Assistant") ? "robot" : "user",
          content: item.message,
          time: item.sentAt,
        };
      })
      .reverse();

    setState({ messages });
  };

  const getArtifacts = async () => {
    const { suc, data } = await API.project.artifacts({ projectCode });
    if (!suc) {
      return;
    }

    let features = [];
    let codeString = "";
    (data?.artifacts || []).forEach((item: any) => {
      if (item.type === "FEATURE_LIST") {
        features = JSON.parse(item.content || "[]").map(
          (feature: any, index: number) => ({ id: index, ...feature })
        );
      }
      if (item.type === "DEMO") {
        codeString = item.content;
      }
    });
    setState({ features, codeString });
  };

  const handleGenerate = async (
    value: string,
    other?: any,
    finishCall?: any
  ) => {
    const { step, attachments } = other || {};
    if (!value.trim()) {
      return;
    }
    const _msgList = handleSendMessage(messages, value, "user");
    setState({ generateLoading: true });
    isCloseRef.current = false;

    try {
      const params = {
        headers: {
          "Content-Type": "application/json",
          // 确保在请求头中加入正确的 Authorization
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          projectCode,
          prompt: value,
          opt: step || "MODIFY_PROTO",
          attachments,
        }),
      };
      await fetchEventSource("https://api.indieapp.ai/v1/projects/ai/chat", {
        method: "POST",
        ...params,
        async onopen(response: any) {
          if (
            !response.ok ||
            response.headers.get("content-type") !== "text/event-stream"
          ) {
            throw new Error("建立连接失败");
          }
        },
        openWhenHidden: true,
        onmessage(event: any) {
          const line = event.data.replace(/data:\s*/g, "");

          if (["#fls#", "#dcs#", "#end#"].includes(line)) {
            receiveMark.current = line;
            return;
          }

          if (!receiveMark.current) {
            handleSendMessage(_msgList, line, "robot");
          }

          if (receiveMark.current === "#fls#") {
            setState({ features: JSON.parse(line || "[]") });
          }

          if (receiveMark.current === "#dcs#") {
            setState({ codeString: line });
          }

          if (line === "#end#" && !!finishCall) {
            finishCall();
          }
        },
        onerror(err: any) {
          throw err;
        },
        onclose() {
          if (isCloseRef.current) {
            return;
          }
          isCloseRef.current = true;
          receiveMark.current = "";
          setState({ generateLoading: false });
        },
      });
    } catch (error) {
      setState({ generateLoading: false });
    }
  };

  const handleSendMessage = (messages: any[], value: string, type: string) => {
    if (!value.trim()) {
      return;
    }

    const messageList = [...messages, { content: value, type }];
    setState({ userInput: "", messages: messageList });
    return messageList;
  };

  const handleGenerateDemo = (funcList: any) => {
    const params = {
      attachments: [
        {
          type: "FEATURE_LIST",
          content: JSON.stringify(
            funcList.map((item: any) => ({
              name: item.name,
              description: item.description,
            }))
          ),
        },
      ],
    };

    handleGenerate("Generate Demo based on the file below.", params);
  };

  // const deomToImage = () => {
  //   // 获取 iframe 元素
  //   const iframe: any = document.getElementById('sandpack-iframe');
  //   // 向 iframe 发送消息
  //   iframe.contentWindow.postMessage('Hello from parent!', '*'); // '*' 代表接受来自任何源的消息
  //   debugger;
  //   // var node = document.querySelector('.sp-preview-container');
  //   // debugger;
  //   // domtoimage
  //   // .toPng(node)
  //   // .then(function (dataUrl) {
  //   //     var img = new Image();
  //   //     img.src = dataUrl;
  //   //     document.body.appendChild(img);
  //   // })
  //   // .catch(function (error) {
  //   //     console.error('oops, something went wrong!', error);
  //   // });
  // }

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full bg-white flex items-center justify-between py-3 px-8 sticky top-0 z-10 border-b border-gray-100 fixed">
        <Link href="/" className="text-gray-800 flex items-center">
          <Logo />
        </Link>
        <div className="flex-1 flex items-center">
          <p className="font-medium text-inherit ml-4">
            {detail?.title || "Indieapp"}
          </p>
          {!!detail?.visibility && (
            <Chip
              className="ml-2 px-2"
              size="sm"
              variant="flat"
              startContent={
                detail.visibility === "PUBLIC" ? (
                  <HiLockOpen />
                ) : (
                  <HiLockClosed />
                )
              }
            >
              {detail.visibility === "PUBLIC" ? "Public" : "Private"}
            </Chip>
          )}
        </div>
        {/* <AiOutlineHistory fontSize='20' className='mr-6'/> */}
        <Button
          className={loading ? "bg-[#A1A1AA] h-[30px]" : "bg-gray-800 h-[30px]"}
          color="primary"
          size="sm"
          startContent={
            loading ? (
              <Spinner color="default" size="sm" />
            ) : (
              <HiCloudUpload fontSize="16" />
            )
          }
          onPress={onOpen} // ----------------------publish弹窗确认，点击方法
        >
          Publish
        </Button>
      </div>
      <div className="relative">
        {loadingFinished ? (
          showSuccess ? (
            <div
              className="bg-[#16BE5E] w-[345px] h-[45px] rounded-md flex flex-row gap-2 justify-center items-center absolute right-5 top-[-20px]"
              style={{ zIndex: "110" }}
            >
              <FaCircleCheck color="#ffffff" />
              <p className=" text-white text-[14px]">
                Your prototype was published successfully
              </p>
            </div>
          ) : null
        ) : null}
      </div>
      <Modal
        style={{ position: "fixed", top: "-10px", right: "5px", zIndex: "100" }}
        size="xl"
        isOpen={isOpen}
        backdrop="transparent"
        onOpenChange={onOpenChange}
        closeButton={<div></div>}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <p className="text-[14px] pb-4">Publish to community</p>
                  {loadingFinished ? null : (
                    <p className="text-[14px]  leading-loose">
                      Publishing this prototype will make it viewable and
                      remixable by anyone on the internet. Your chat will remain
                      private. You can update access settings at any time after
                      publishing.
                    </p>
                  )}
                  <div className=" bg-[#F4F4F5] rounded-md border border-[#E4E4E7] p-4 flex flex-row items-center">
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
                      <Button color="primary" variant="light" className="pl-4">
                        Reset to Private
                      </Button>
                    ) : null}
                  </div>
                  {loadingFinished ? (
                    <div className="flex flex-col gap-4 mt-1">
                      <hr />
                      <div className="flex flex-row items-center gap-2">
                        <div className="w-[12PX] h-[12PX] rounded-[50%] border-4 border-[#D9EBFF] bg-[#006FEE]"></div>
                        <p className="text-[14px]">Live prototype</p>
                      </div>

                      <div className=" h-[66px] rounded-md border-1 border-[#E4E4E7] flex flex-row justify-between items-center px-4">
                        <div className="flex flex-row gap-4 items-center">
                          <PiBrowserBold size={16} />
                          <div className="flex flex-col">
                            <p className="text-black text-[14px]">Prototype</p>
                            <p className="text-[#71717A] text-[10px]">
                              mm/dd/yyyy hh:mm
                            </p>
                          </div>
                        </div>
                        <div className="w-[46px] h-[18px] bg-[#D7F4E4] rounded-md p-1">
                          <p className="text-[#16BE5E] text-[10px] text-center ">
                            latest
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex flex-row justify-center items-center">
                        <div className="border-1 border-[#A1A1AA] bg-[#ECECEE] rounded-md"/>
                        1
                        </div>
                        <FiCopy color="black" /><p className="text-[#A1A1AA] text-center leaing-[49px] text-[14px]">
                      </div> */}
                      <div className="flex flex-row justify-center items-center">
                        <div className="w-[90%] h-[49px] border-1 border-[#E4E4E7] bg-[#ECECEE] rounded-md rounded-r-none  text-[#A1A1AA]  leaing-[49px] text-[14px] p-4 flex items-center">
                          https://indieapp.ai/community/projectcode
                        </div>
                        <button
                          className=" w-[10%] h-[49px] bg-white  rounded-md rounded-l-none border-1 border-l-0 border-[#E4E4E7] flex flex-row justify-center items-center"
                          onClick={handleCopy}
                        >
                          {copy ? (
                            <FaCheck color="black" size={18} />
                          ) : (
                            <FiCopy color="black" size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className={
                    loading
                      ? "bg-[#A1A1AA] w-[100%] disabled:cursor-not-allowed"
                      : loadingFinished
                        ? "bg-black w-[100%]"
                        : "bg-black w-[100%]"
                  }
                  onPress={handlePublish}
                >
                  <p className="text-white py-4">
                    {loadingFinished ? "Publish selected prototype" : "Publish"}
                  </p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ---------------------------------弹窗组件结束------------------------------------ */}
      <div className="h-0 flex-1 flex bg-[#f8f8f8]">
        <div style={{ width: leftWidth }}>
          <ChatView
            messages={messages}
            loading={generateLoading}
            onSend={handleGenerate}
          />
        </div>
        <div
          className="w-[1px] bg-gray-200 cursor-col-resize"
          onMouseDown={handleMouseDown}
          style={{ cursor: "col-resize" }}
        />
        <div className="flex flex-1 h-full flex-col">
          <div className="bg-white py-3 px-6 flex items-center">
            {displayType === "demo" ? (
              <>
                <Button
                  className="h-[36px] mr-2 bg-gray-100"
                  radius="sm"
                  onPress={() => setState({ displayType: "demo" })}
                >
                  Demo
                </Button>
                <Button
                  className="h-[36px]"
                  variant="light"
                  onPress={() => setState({ displayType: "feature" })}
                >
                  Feature List
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="h-[36px]"
                  radius="sm"
                  variant="light"
                  onPress={() => setState({ displayType: "demo" })}
                >
                  Demo
                </Button>
                <Button
                  className="h-[36px] mr-2 bg-gray-100"
                  onPress={() => setState({ displayType: "feature" })}
                >
                  Feature List
                </Button>
              </>
            )}
            {displayType === "feature" && (
              <div className="flex-1 text-right">
                <Button
                  color="primary"
                  className="h-[36px]"
                  onPress={() => {
                    featureRef?.current?.generateDemo();
                    setState({ displayType: "demo" });
                  }}
                >
                  Generate Demo
                </Button>
              </div>
            )}
            {/* <Tabs aria-label='Options' size='sm'>
              <Tab key='mobile' title={<FiZoomIn />} />
              <Tab key='tablet' title={<FiZoomOut />} />
            </Tabs>

            <Tabs aria-label='Options' size='sm' className='mx-4' defaultSelectedKey='pc'>
              <Tab key='mobile' title={<FiSmartphone />} />
              <Tab key='tablet' title={<FiTablet />} />
              <Tab key='pc' title={<FiMonitor />} />
            </Tabs>

            <Button
              startContent={<HiOutlineCursorClick />}
              variant='light'
              size='sm'
            >
              New Edit
            </Button> */}
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayType === "demo" ? (
              <ReactFlowProvider>
                <FlowView codeString={codeString} loading={generateLoading} />
              </ReactFlowProvider>
            ) : (
              <ProjectFeatures
                ref={featureRef}
                data={features}
                disabled={generateLoading}
                onGenerateDemo={handleGenerateDemo}
                showSkeleton={generateLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
