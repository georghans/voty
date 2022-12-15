import { useEffect, useState } from "react";

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/

  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
    isXs?: boolean;
    isXxs?: boolean;
    isSm?: boolean;
    isMd?: boolean;
    isLg?: boolean;
    isXl?: boolean;
    isXXl?: boolean;
  }>({
    isXs: typeof window !== "undefined" && window.innerWidth > 0,
    isXxs: typeof window !== "undefined" && window.innerWidth <= 450,
    isSm: typeof window !== "undefined" && window.innerWidth >= 640,
    isMd: typeof window !== "undefined" && window.innerWidth >= 768,
    isLg: typeof window !== "undefined" && window.innerWidth >= 1024,
    isXl: typeof window !== "undefined" && window.innerWidth >= 1280,
    isXXl: typeof window !== "undefined" && window.innerWidth >= 1536,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      const isXs = window.innerWidth > 0;
      const isXxs = window.innerWidth <= 450;
      const isSm = window.innerWidth >= 640;
      const isMd = window.innerWidth >= 768;
      const isLg = window.innerWidth >= 1024;
      const isXl = window.innerWidth >= 1280;
      const isXXl = window.innerWidth >= 1536;
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isXs,
        isXxs,
        isSm,
        isMd,
        isLg,
        isXl,
        isXXl,
      });
    }
    if (typeof window !== "undefined") {
      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();
    }

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return { ...windowSize };
};

export default useWindowSize;
