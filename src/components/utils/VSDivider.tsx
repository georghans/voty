import React from "react";

export const VSDivider = () => {
  return (
    <div className="flex w-full min-w-[200px] max-w-[400px] select-none items-center justify-center space-x-2 overflow-hidden text-white ">
      <div className=" flex items-center justify-center space-x-2">
        {Array.from(Array(30), (e) => (
          <React.Fragment key={e}>
            <div className="rotate-180 text-xs">➤</div>
          </React.Fragment>
        ))}
      </div>
      <div className="border-2 border-white px-6 py-2">
        <span className="font-bold">VS</span>
      </div>
      <div className=" flex items-center justify-center space-x-2">
        {Array.from(Array(30), (e) => (
          <React.Fragment key={e}>
            <div className="text-xs">➤</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
