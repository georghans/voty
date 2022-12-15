import { mdiArrowDownThin, mdiArrowUpThin, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { scrollIntoView } from "seamless-scroll-polyfill";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import { trpc } from "../../../utils/trpc";

const VotingResults: NextPage = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | undefined>();
  const { votingId } = useRouter().query;
  const results = trpc.voting.getResults.useQuery(
    { votingId: parseInt(votingId as string) },
    {
      enabled: !!votingId,
    }
  );
  const { isMd } = useWindowSize();
  const desktopVariants = {
    hidden: { opacity: 0, x: 200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -600, y: 0 },
  };
  const mobileVariants = {
    hidden: { opacity: 0, x: 0, y: 200 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -600 },
  };
  const variants = !isMd ? mobileVariants : desktopVariants;
  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <motion.main
        key="result"
        whileInView="enter"
        viewport={{ once: true }}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear" }}
        className="flex h-full flex-col items-center justify-center px-6"
      >
        <div className=" flex w-full flex-col items-center justify-center space-y-4 px-4 md:w-5/6 md:flex-row md:items-start md:space-y-0 md:space-x-6 lg:w-2/3">
          <div className="m flex w-full flex-col gap-4">
            <h3 className="font-lexend text-2xl font-medium text-neutral">
              Thank you!
            </h3>
            <div className="flex flex-col rounded-xl bg-neutral/10 py-2 px-4">
              <h4 className="text-2xl font-medium text-neutral">
                Other users can still vote!
              </h4>
              <span className="text-left  text-lg text-neutral">
                Voting ends in 2 days.
              </span>
              <p className="mt-4">{results.data?.description}</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-4 overflow-x-hidden">
            <h5 className="w-full text-left  font-lexend text-2xl text-neutral">
              Current ranking:
            </h5>
            {results.data?.videosData
              ?.slice(0, !showAll ? 5 : results.data.videosData.length)
              ?.map((result, index) => (
                <AnimatePresence key={result.id}>
                  {result.id === selectedVideo ? (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0.8, scale: 0.8 },
                        enter: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.5 },
                      }}
                      initial="hidden"
                      exit="exit"
                      animate="enter"
                      transition={{ duration: 0.25 }}
                      className="flex flex-col space-y-0 "
                      id={`closed-item-list-${index}`}
                    >
                      <button
                        className="flex items-center space-x-2 self-end text-lg font-bold text-neutral"
                        onClick={() => setSelectedVideo(undefined)}
                      >
                        Close
                        <Icon
                          path={mdiClose}
                          size={1.5}
                          className="text-neutral"
                        />
                      </button>
                      <RecordVideoPlayer
                        url={result.url}
                        title={result.title}
                        votes={result._count.VoteFor}
                        isSoundOn
                        onEnded={() => setSelectedVideo(undefined)}
                        onPause={() => null}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      // whileInView="enter"
                      viewport={{ once: true }}
                      key={`closed-item-list-${index}`}
                      variants={{
                        hidden: { opacity: 0, x: 100 },
                        enter: { opacity: 1, x: 0 },
                        exit: { opacity: 0, x: -100 },
                      }}
                      initial="hidden"
                      // exit="exit"
                      animate="enter"
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      className="flex w-full cursor-pointer items-center justify-between "
                      onClick={() => setSelectedVideo(result.id)}
                    >
                      <div className="flex w-full justify-between space-x-6 border-b-2 pb-4 text-lg font-bold text-neutral">
                        <Image
                          src={`data:image/png;base64,${result.thumbnailB64}`}
                          alt={result.title}
                          width={120}
                          height={120}
                          className="hidden aspect-square min-w-[45px] rounded-lg object-cover md:block"
                        />
                        <div className="flex w-full flex-row justify-between space-x-6 md:flex-col md:space-x-0 lg:flex-row lg:space-x-6">
                          <span>{result.title} </span>
                          <span>{result._count.VoteFor} votes</span>
                        </div>
                      </div>
                      {/* Replace this with a real score system */}
                      {Math.floor(Math.random() * 2) === 0 ? (
                        <Icon
                          path={mdiArrowUpThin}
                          className=" text-green-600"
                          size={2}
                        />
                      ) : (
                        <Icon
                          path={mdiArrowDownThin}
                          className=" text-red-600"
                          size={2}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            {!showAll && (
              <button
                className="text-voty text-lg font-medium"
                onClick={() => setShowAll(true)}
              >
                Show all
              </button>
            )}
          </div>
        </div>
      </motion.main>
    </>
  );
};

const RecordVideoPlayer: React.FC<{
  url: string;
  title: string;
  votes: number;
  isSoundOn: boolean;
  onEnded: () => void;
  onPause: () => void;
}> = (props) => {
  const btn =
    "inline-flex items-center px-3 py-1.5 shadow-sm font-medium rounded-full text-gray-700 bg-transparent  focus:outline-none hover:scale-110 transition duration-150";
  const [isPlaying, setIsPlaying] = useState(true);
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
  }, [isPlaying]);
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-center transition-all duration-200"
      )}
      id="video-active"
    >
      <div className="group relative aspect-square max-h-[400px] w-full max-w-[400px] overflow-hidden rounded-lg bg-neutral/10 md:h-[30vw] md:max-h-full md:w-[30vw] md:max-w-full">
        <ReactPlayer
          className="relative z-10 aspect-square h-full w-full object-cover"
          url={props?.url ?? ""}
          config={{}}
          playing={isPlaying}
          looped
          muted={!props.isSoundOn}
          width={"100%"}
          height={"100%"}
          onEnded={props.onEnded}
        />
        {/* Background video */}
        <ReactPlayer
          className="absolute top-0 left-0 z-0 h-[200%] w-[200%] scale-[3] blur-sm"
          url={props?.url ?? ""}
          config={{}}
          playing={isPlaying}
          looped
          width="100%"
          height="100%"
          muted
          onEnded={props.onEnded}
        />
        {!isPlaying && (
          <div className="absolute top-0 left-0 z-20  flex h-full w-full items-center justify-center bg-neutral/70">
            <button
              className={btn}
              onClick={() => {
                setIsPlaying(true);
              }}
              // onClick={() => props.vote()}
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
          <span className="col-span-1 truncate font-lexend text-lg font-extralight text-white md:text-xl">
            {props?.title ?? ""}
          </span>
          <div
            onClick={() => setIsPlaying(false)}
            className={clsx(
              "col-span-1 flex cursor-pointer justify-center",
              isPlaying ? "visible" : "invisible"
            )}
          >
            <Image
              src="/static/pause-button.svg"
              alt="pause/resume"
              width={32}
              height={38}
            />
          </div>
          <span className=" col-span-1 truncate text-right text-lg font-light text-white md:text-xl">
            {props?.votes} votes
          </span>
        </div>
      </div>
    </div>
  );
};

export default VotingResults;
