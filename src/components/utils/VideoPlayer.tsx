import clsx from "clsx";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { scrollIntoView } from "seamless-scroll-polyfill";
import thumbsAnimation from "../../../resources/animations/thumbsUpAnimation.json";
import type { VideoFromServer } from "../../server/trpc/trpc";

export const VideoPlayer: React.FC<{
  video: VideoFromServer;
  vote: () => void;
  disabled: boolean;
  canStart: boolean;
  isSoundOn: boolean;
  onEnded: () => void;
  onPause: () => void;
  handleMouseEnter: () => void;
}> = (props) => {
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const btn =
    "inline-flex items-center px-3 py-1.5 shadow-sm font-medium rounded-full text-gray-700 bg-transparent focus:outline-none hover:scale-110 transition duration-150";
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      document.querySelector("#video-active") !== null
    ) {
      scrollIntoView(document.querySelector("#video-active") as Element, {
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [props.canStart]);
  const lottieRef = useRef(null);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        borderRadius: 0,
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "relative flex flex-col items-center ",
        !props.canStart && "scale-[0.99]"
      )}
      key={props.video?.id}
      id={`video-${props.canStart ? "active" : "inactive"}`}
    >
      <div className="group relative aspect-square max-h-[30vh] w-full max-w-[30vh] overflow-hidden rounded-lg  md:h-[30vw] md:max-h-full md:w-[30vw] md:max-w-full">
        <ReactPlayer
          className="relative z-10 aspect-square h-full w-full object-cover"
          url={props.video?.url ?? ""}
          config={{}}
          playing={props.canStart}
          looped
          muted={!props.isSoundOn}
          width={"100%"}
          height={"100%"}
          onEnded={props.onEnded}
        />

        {/* Background video */}
        <ReactPlayer
          className="absolute top-0 left-0 z-0 h-[200%] w-[200%] scale-[3] blur-sm"
          url={props.video?.url ?? ""}
          config={{}}
          playing={props.canStart}
          looped
          width="100%"
          height="100%"
          muted
          onEnded={props.onEnded}
        />
        {!props.canStart && (
          <div className="absolute top-0 left-0 z-20  flex h-full w-full items-center justify-center bg-neutral/70">
            <button
              className={btn}
              onClick={() => {
                props.handleMouseEnter();
              }}
              // onClick={() => props.vote()}
              disabled={props.disabled}
            >
              <div className="flex aspect-square w-[100px] items-center justify-center rounded-full bg-neutral/70 pl-3 shadow-sm">
                <Image
                  className="stroke-neutral"
                  src="/static/play-button.svg"
                  alt="pause/resume"
                  width={52}
                  height={52}
                />
              </div>
            </button>
          </div>
        )}
        <div className="absolute -bottom-1 right-1/2 z-30 grid h-16 w-[calc(100%+2px)] translate-x-1/2 grid-cols-3 items-center bg-neutral px-4">
          <span className=" col-span-1 truncate font-lexend text-lg font-extralight text-white md:text-xl">
            {props.video?.title ?? ""}
          </span>
          <div
            onClick={props.onPause}
            className={clsx(
              "col-span-1 flex cursor-pointer justify-center",
              props.canStart ? "visible" : "invisible"
            )}
          >
            <Image
              src="/static/pause-button.svg"
              alt="pause/resume"
              width={32}
              height={38}
            />
          </div>
          <button
            className=" col-span-1 text-right font-lexend text-lg  text-sky-600 outline-none md:text-xl"
            onClick={() => {
              setIsAnimationRunning(true);
              props.onPause();
              setTimeout(() => {
                props.vote();
                props.onEnded();
                setIsAnimationRunning(false);
              }, 1300);
            }}
            disabled={props.disabled}
          >
            Vote
          </button>
        </div>
      </div>
      {isAnimationRunning && (
        <Lottie
          lottieRef={lottieRef}
          animationData={thumbsAnimation}
          className="absolute top-0 left-0 z-[9999] h-full w-full"
          autoplay={true}
          loop={false}
        />
      )}
    </motion.div>
  );
};
