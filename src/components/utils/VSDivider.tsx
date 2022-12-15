export const VSDivider = () => {
  return (
    <div className="flex max-w-[400px] select-none items-center justify-center space-x-2  text-neutral ">
      <div className=" flex items-center justify-center space-x-2">
        {Array.from(Array(5), (e, i) => (
          <div key={`left-${i}`} className="mb-2 text-xs">
            .
          </div>
        ))}
      </div>
      <div className="border-2 border-neutral px-6 py-2">
        <span className="font-bold">VS</span>
      </div>
      <div className=" flex items-center justify-center space-x-2">
        {Array.from(Array(5), (e, i) => (
          <div key={`right-${i}`} className="mb-2 text-xs">
            .
          </div>
        ))}
      </div>
    </div>
  );
};
