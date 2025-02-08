import React from "react";

interface LineProps {
  width: string;
}

export default function LineORLine({ width }: LineProps) {
  return (
    <div className="flex w-full items-center pl-4">
      <div className=" h-px bg-gray-300 mt-6 mb-6 " style={{ width }} />
      <div className="absolate mt-1 text-xs text-gray-300">
        &nbsp; OR &nbsp;
      </div>
      <div className=" h-px bg-gray-300 mt-6 mb-6" style={{ width }} />
    </div>
  );
}
