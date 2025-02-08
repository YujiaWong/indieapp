"use client";
import React, { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { GrAttachment } from "react-icons/gr";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { MdOutlineLightbulb } from "react-icons/md";
import { MdOutlineTextSnippet } from "react-icons/md";
import { AiOutlinePicture } from "react-icons/ai";
import { MdImageSearch } from "react-icons/md";
import { Avatar } from "@nextui-org/react";

export default function Page() {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [KeepInputPosition, setKeepInputPosition] = useState(true); //handle the position of input box 控制输入框是否维持搜寻前的初始居中位置
  const [wordsShowcase, SetWordsSowcase] = useState(true); // handle the showcase of the slogan 控制初始欢迎标语显示
  const [displayOutPutBox, setDisplayOutPutBox] = useState(false); //handle the showcase of output area, 控制是否出现AI答复区域
  const mockReplies: string =
    "How are you? I'm glad to be of service. Have a good day!";
  // const handleSubmit = () => {
  //   console.log(inputValue, "提交成功");
  // };
  const handleSubmitMessage = () => {
    if (inputValue.trim() !== "") {
      setMessageList((items) => [...items, inputValue]);
      setInputValue("");
    }
  };

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("按下了空格");
    }
  };

  return (
    <div className="flex 100hv">
      {/* 左侧历史记录 left side search history  */}
      <div className="hidden lg:w-1/6 md:flex top-0 bottom-0 flex-col w-1/4 h-screen bg-[rgb(0,0,0)]">
        <div className="flex gap-4 items-center p-3 relat">
          <button>
            <Avatar
              isBordered
              radius="sm"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            />
          </button>
          <span>Aaron</span>
        </div>
        <br />
        <div className="ml-2">
          The search history area.
          <br />
          展示搜索历史记录？
        </div>
      </div>
      {/* 右侧输入区 right side input area */}

      <div
        className={`w-full flex flex-col lg:w-5/6 md:w-3/4  items-center transition-all duration-500 ease-in-out bg-[rgb(40,40,40)] overflow-auto ${
          KeepInputPosition ? "justify-center" : "justify-end pb-10"
        }`}
      >
        <div
          className={
            displayOutPutBox
              ? `w-2/3 md:w-1/2 mb-2 min-w-[300px] max-w-[90%] z-10 relative flex flex-col items-end`
              : `hidden`
          }
        >
          {messageList.map((items, index) => (
            <React.Fragment key={index}>
              <div className="p-2 my-1 bg-[rgb(45,45,45)] rounded-xl text-white max-w-[500px] text-wrap z-20 mb-2 ">
                {items}
              </div>
              <div className="p-2 my-1 bg-[rgb(45,45,45)] rounded-xl text-white max-w-[500px] text-wrap z-20 mb-2 mr-auto">
                {mockReplies}
              </div>
            </React.Fragment>
          ))}
        </div>
        <h2
          className={
            wordsShowcase
              ? `mb-5 text-3xl text-gray-300 z-20 relative`
              : `hidden`
          }
        >
          Where do we start? :D
        </h2>

        <div className="w-2/3 md:w-1/2 mb-2 min-w-[300px] max-w-[90%] z-20 relative fiex">
          <Input
            size="lg"
            isClearable
            radius="lg"
            value={inputValue}
            style={{ paddingRight: "30px" }}
            onChange={(e) => setInputValue(e.target.value)}
            classNames={{
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Type something to explore..."
            endContent={
              <button
                onClick={() => {
                  // handleSubmit();
                  SetWordsSowcase(false);
                  setKeepInputPosition(false);
                  setDisplayOutPutBox(true);
                  handleSubmitMessage();
                  handlePress;
                }}
              >
                <SearchIcon className="text-black/50 mt-2 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              </button>
            }
            startContent={
              <button className="flex items-center justify-center text-slate-400 hover:text-slate-600">
                <GrAttachment style={{ color: "white" }} />
              </button>
            }
          />
        </div>
        <div
          className={
            wordsShowcase
              ? `mb-1 text-lg text-gray-300 z-20 relative` // 使用 grid 布局
              : `hidden`
          }
        >
          <Button color="default" variant="ghost" className="m-1 text-gray-300">
            <MdOutlineLightbulb className="text-green-500" />
            Ideas
          </Button>

          <Button color="default" variant="ghost" className="m-1 text-gray-300">
            <MdOutlineTextSnippet className=" text-orange-400" />
            Write scripts
          </Button>

          <Button color="default" variant="ghost" className=" text-gray-300">
            <MdImageSearch className="text-blue-500" />
            Analysis Pictures
          </Button>
        </div>

        <p
          className={
            wordsShowcase
              ? ` text-gray-400 text-xs absolute bottom-0 p-1`
              : `hidden`
          }
        >
          Indieapp can also make mistakes. Please check important information.
        </p>
      </div>
    </div>
  );
}
