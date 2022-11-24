import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { scrollIntoView } from "seamless-scroll-polyfill";
import { VSDivider } from "../../../../components/utils/VSDivider";
import type { VideoFromServer } from "../../../../server/trpc/trpc";
import { trpc } from "../../../../utils/trpc";

const btn =
  "inline-flex items-center px-3 py-1.5 shadow-sm font-medium rounded-full text-gray-700 bg-transparent  focus:outline-none hover:scale-110 transition duration-150";

const Home: NextPage = () => {
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(1);
  const voteMutation = trpc.voting.castVote.useMutation();
  const router = useRouter();
  const { votingId } = router.query;
  const videoPair = trpc.voting.getVideoPair.useQuery(
    { votingId: Number(votingId) },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!votingId,
    }
  );

  const castVote = (selected: number) => {
    if (!videoPair.data?.first || !videoPair.data?.second) return; // make ts happy

    if (selected === videoPair.data.first?.id) {
      voteMutation.mutate({
        userId: 1,
        votingId: 1,
        votedFor: videoPair.data.first?.id,
        votedAgainst: videoPair.data.second?.id,
      });
    } else {
      voteMutation.mutate({
        userId: 1,
        votingId: 1,
        votedAgainst: videoPair.data.first?.id,
        votedFor: videoPair.data.second?.id,
      });
    }

    videoPair.refetch();
  };

  if (!videoPair.data?.first || !videoPair.data?.second) {
    return <div>Loading...</div>;
  }

  const isLoading = voteMutation.isLoading || videoPair.isLoading;

  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex flex-col items-center justify-center ">
        <div className=" flex w-full flex-col items-center justify-center gap-12 px-4 py-16 ">
          {videoPair.data.first && (
            <div className="animate-fade-in flex w-full flex-col items-center justify-between space-y-4 px-6 md:flex-row md:space-x-4 md:space-y-0 ">
              <VideoListing
                video={videoPair.data.first}
                vote={() => castVote(videoPair.data.first?.id ?? -1)}
                disabled={isLoading}
                canStart={currentVideoPlaying === 1}
                onEnded={() => setCurrentVideoPlaying(2)}
                handleMouseEnter={() =>
                  currentVideoPlaying !== 1 && setCurrentVideoPlaying(1)
                }
                onPause={() => setCurrentVideoPlaying(3)}
              />
              <VSDivider />
              <VideoListing
                video={videoPair.data.second}
                vote={() => castVote(videoPair.data.second?.id ?? -1)}
                disabled={isLoading}
                canStart={currentVideoPlaying === 2}
                onEnded={() => setCurrentVideoPlaying(1)}
                handleMouseEnter={() =>
                  currentVideoPlaying !== 2 && setCurrentVideoPlaying(2)
                }
                onPause={() => setCurrentVideoPlaying(3)}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const VideoListing: React.FC<{
  video: VideoFromServer;
  vote: () => void;
  disabled: boolean;
  canStart: boolean;
  onEnded: () => void;
  onPause: () => void;
  handleMouseEnter: () => void;
}> = (props) => {
  console.log("can play", ReactPlayer.canPlay("/video.mp4"));

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
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-center transition-all duration-200",
        props.disabled && "opacity-0",
        !props.canStart && "scale-90"
      )}
      key={props.video?.id}
      id={`video-${props.canStart ? "active" : "inactive"}`}
      // onMouseEnter={props.handleMouseEnter}
    >
      <div className="group relative aspect-square max-h-[400px] w-full max-w-[400px] overflow-hidden rounded-lg bg-stone-800/10 md:h-[30vw] md:max-h-full md:w-[30vw] md:max-w-full">
        <ReactPlayer
          className="relative z-10 aspect-square h-full w-full object-cover"
          url={props.video?.url ?? ""}
          config={{}}
          playing={props.canStart}
          looped
          muted
          width={"100%"}
          height={"100%"}
          onEnded={props.onEnded}
        />
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
          <div className="absolute top-0 left-0 z-20  flex h-full w-full items-center justify-center bg-black/70">
            <button
              className={btn}
              onClick={() => {
                props.handleMouseEnter();
              }}
              // onClick={() => props.vote()}
              disabled={props.disabled}
            >
              <div className="flex aspect-square w-[100px] items-center justify-center rounded-full bg-black/70 pl-3 shadow-sm">
                <Image
                  className="stroke-white"
                  src="/static/play-button.svg"
                  alt="pause/resume"
                  width={52}
                  height={52}
                />
              </div>
            </button>
          </div>
        )}
        <div className="absolute -bottom-1 right-1/2 z-30 flex h-16 w-[calc(100%+2px)] translate-x-1/2 items-center justify-between bg-black/80 px-2">
          <span className=" text-lg text-white md:text-xl">
            {props.video?.title ?? ""}
          </span>
          {props.canStart && (
            <div onClick={props.onPause}>
              <Image
                src="/static/pause-button.svg"
                alt="pause/resume"
                width={32}
                height={38}
              />
            </div>
          )}
          <span className=" text-lg text-white md:text-xl">Vote</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
