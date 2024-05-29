import React from "react";
import UserAccoutn from "./parts/UserAccoutn";

export default function DHeader() {
  return (
    <div className="p-8 w-full border-b-2 border-slate-300 h-10 flex justify-between items-center">
      <span className="text-black">سلام احسان</span>
      <UserAccoutn />
      {/* <div className="text-black bg-slate-400 rounded-xl h-5 w-16"></div> */}
    </div>
  );
}
