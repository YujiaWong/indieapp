"use client";
import { Link, Tabs, Tab, Input } from "@nextui-org/react";
import API from "@/services";
import ProjectList from "@/components/ProjectList";
import Navbar from "../home/navbar";
import { IoSearch } from "react-icons/io5";

import {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default () => {
  const handleCardClick = (code: any) => {
    window.open(`/preview?projectCode=${code}`, "_blank");
  };

  const getProjectList = async ({ pageNum }: any) => {
    try {
      const res = await API.project.pubList({
        pageNum,
        pageSize: 12,
      });
      console.log("API Response:", res);
      return {
        success: res.suc,
        data: {
          ...res?.data,
          list: res?.data?.data,
          total: res?.data.total,
        },
      };
    } catch (error) {}
  };

  return (
    <ReactFlowProvider>
      <div className="relative flex flex-col h-screen home-page">
        <Navbar />
        <main className="container w-[95%] max-w-[1440px] mx-auto flex-grow pb-16">
          <div>
            <div className="relative">
              <div className="flex flex-col justify-center items-center mx-auto mb-20 mt-20">
                <div className="text-center text-[48px] font-medium z-10 leading-[58px]">
                  Community
                </div>
                <div className="text-center leading-loose z-10 text-[16px] my-6 leading-[30px]">
                  We hold a strong and active community for all the independent
                  creators, <br />
                  early startups and potential investors to level your idea up
                </div>
                <div className="w-full max-w-[800px]">
                  <Input
                    className="bg-white"
                    type="search"
                    variant="bordered"
                    placeholder="Search app here"
                    startContent={<IoSearch />}
                    size="lg"
                  />
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <Tabs aria-label="Tabs sizes">
                  <Tab key="Most viewed" title="Most viewed" />
                  <Tab key="Latest" title="Latest" />
                  <Tab key="Mine" title="Mine" />
                </Tabs>
              </div>
              <ProjectList
                getDataSource={getProjectList}
                onItemCick={handleCardClick}
              />
            </div>
          </div>
        </main>
        <footer className="w-full flex items-center justify-center py-5">
          <Link className="flex items-center gap-1 text-current" title="app">
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">Indieapp</p>
          </Link>
        </footer>
        <Background
          gap={30}
          size={3}
          color="#c6c6c6"
          variant={BackgroundVariant.Dots}
        />
      </div>
    </ReactFlowProvider>
  );
};
