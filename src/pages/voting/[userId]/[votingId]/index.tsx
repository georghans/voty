import { mdiVolumeHigh, mdiVolumeMute } from "@mdi/js";
import Icon from "@mdi/react";
import type { Video } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { VideoPlayer } from "../../../../components/utils/VideoPlayer";
import { VotesCounter } from "../../../../components/utils/VotesCounter";
import { VSDivider } from "../../../../components/utils/VSDivider";
import useWindowSize from "../../../../utils/hooks/useWindowSize";
import { trpc } from "../../../../utils/trpc";

const VotingPage: NextPage = () => {
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(1);

  const [isSoundOn, setIsSoundOn] = useState(false);
  const [videosAmount, setVideosAmount] = useState(1);
  const [currentVideoPair, setCurrentVideoPair] = useState<{
    first: Video | undefined;
    second: Video | undefined;
  }>();
  const [nextVideoPair, setNextVideoPair] = useState<{
    first: Video | undefined;
    second: Video | undefined;
  }>();
  const voteMutation = trpc.voting.castVote.useMutation();
  const router = useRouter();
  const { votingId } = router.query;
  const { isMd } = useWindowSize();

  // I'm pretty sure this is ok, shouldn't be triggered everytime.
  trpc.voting.getVideoPair.useQuery(
    {
      votingId: Number(votingId),
    },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!votingId,
      onSuccess(data) {
        setCurrentVideoPair(data);
        if (data?.first?.id && data?.second?.id) {
          getNextVideoPair(data.first.id, data.second.id);
        }
      },
    }
  );
  const utils = trpc.useContext();

  // Queries next video pair and stores it
  const getNextVideoPair = async (firstId: number, secondId: number) => {
    const data = await utils.voting.getVideoPair.fetch({
      votingId: Number(votingId),
      exclude: {
        first: firstId,
        second: secondId,
      },
    });
    setNextVideoPair(data);
  };
  const castVote = async (selected: number) => {
    if (!currentVideoPair?.first || !currentVideoPair?.second) return; // make ts happy

    if (selected === currentVideoPair.first?.id) {
      voteMutation.mutate({
        userId: 1,
        votingId: 1,
        votedFor: currentVideoPair.first?.id,
        votedAgainst: currentVideoPair.second?.id,
      });
    } else {
      voteMutation.mutate({
        userId: 1,
        votingId: 1,
        votedAgainst: currentVideoPair.first?.id,
        votedFor: currentVideoPair.second?.id,
      });
    }
    if (videosAmount === 15) {
      router.push(`/voting/results?votingId=${votingId}`);
    }

    setVideosAmount((amount) => amount + 1);
    setCurrentVideoPair(nextVideoPair);
    if (nextVideoPair?.first && nextVideoPair.second) {
      await getNextVideoPair(nextVideoPair.first.id, nextVideoPair.second.id);
    }
  };
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

  const isLoading = voteMutation.isLoading || !currentVideoPair;

  return (
    <AnimatePresence
      mode="wait"
      initial={true}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <motion.main
        key="videos"
        whileInView="enter"
        viewport={{ once: true }}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: "linear" }}
        className="flex flex-col items-center justify-center py-2"
      >
        <div className=" flex w-full flex-col items-center justify-center space-y-4 px-4 md:w-5/6 md:space-y-6 lg:w-2/3">
          <div className="flex w-full items-center justify-between space-x-2 self-end text-lg font-semibold text-neutral md:self-start md:px-6">
            <h3 className="font-lexend text-xl font-medium text-neutral md:text-2xl">
              Vote for your favorite
            </h3>
            <div onClick={() => setIsSoundOn((on) => !on)}>
              <Icon
                path={isSoundOn ? mdiVolumeHigh : mdiVolumeMute}
                size={1.5}
                className="cursor-pointer text-neutral"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-between space-y-2 md:flex-row md:justify-center md:space-x-1  md:space-y-0 ">
            <AnimatePresence mode="wait">
              {currentVideoPair?.second && currentVideoPair?.first && (
                <VideoPlayer
                  key={currentVideoPair?.first?.id}
                  video={currentVideoPair.first}
                  vote={() => {
                    castVote(currentVideoPair.first?.id ?? -1);
                  }}
                  disabled={isLoading || videosAmount === 16}
                  canStart={currentVideoPlaying === 1}
                  onEnded={() => setCurrentVideoPlaying(2)}
                  handleMouseEnter={() => {
                    currentVideoPlaying !== 1 && setCurrentVideoPlaying(1);
                  }}
                  onPause={() => setCurrentVideoPlaying(3)}
                  isSoundOn={isSoundOn}
                />
              )}
            </AnimatePresence>
            <VSDivider />
            <AnimatePresence mode="wait">
              {currentVideoPair?.second && currentVideoPair?.first && (
                <VideoPlayer
                  key={currentVideoPair?.second?.id}
                  video={currentVideoPair.second}
                  vote={() => {
                    castVote(currentVideoPair.second?.id ?? -1);
                  }}
                  disabled={isLoading || videosAmount === 16}
                  canStart={currentVideoPlaying === 2}
                  onEnded={() => setCurrentVideoPlaying(1)}
                  handleMouseEnter={() => {
                    currentVideoPlaying !== 2 && setCurrentVideoPlaying(2);
                  }}
                  onPause={() => setCurrentVideoPlaying(3)}
                  isSoundOn={isSoundOn}
                />
              )}
            </AnimatePresence>
          </div>

          <VotesCounter videosAmount={videosAmount} />
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

export default VotingPage;
