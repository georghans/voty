import React from "react";

export const VotesCounter: React.FC<{ videosAmount: number }> = ({
  videosAmount,
}) => {
  return (
    <div className="relative mt-6 flex h-full w-full select-none overflow-x-hidden md:mt-0 md:w-3/4">
      <div className="absolute left-0 top-1/2 h-full w-[3px] -translate-y-1/2 bg-neutral" />
      <div className="absolute right-0 top-1/2 h-full w-[3px] -translate-y-1/2 bg-neutral" />
      <div className="flex w-full items-center justify-between">
        {Array.from(Array(100), (e, i) => (
          <React.Fragment key={`counter-${i}`}>
            <div className="text-xs text-neutral">·</div>
          </React.Fragment>
        ))}
      </div>

      <div
        className="absolute top-1/2 h-[4px] -translate-y-1/3 bg-neutral transition-all duration-150"
        style={{
          width: `${
            (videosAmount * 100) / 16 >= 100 ? 100 : (videosAmount * 100) / 16
          }%`,
        }}
      />
      <div
        className="absolute top-1/2 h-2 w-2 -translate-y-[40%] -translate-x-1/2 rounded-full bg-neutral transition-all duration-150"
        style={{
          left: `${
            (videosAmount * 100) / 16 >= 100 ? 100 : (videosAmount * 100) / 16
          }%`,
        }}
      />
    </div>
  );
};
