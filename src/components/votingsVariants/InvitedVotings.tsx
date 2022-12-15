import { mdiArrowRight } from "@mdi/js";
import Icon from "@mdi/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import useWindowSize from "../../utils/hooks/useWindowSize";
import { VotingsDrawer } from "../utils/VotingsDrawer";

type Video = { title: string; url: string; thumbnailB64: string | null };
export type Voting = {
  videos: Video[];
  title: string;
  description: string | null;
  id: number;
};

export const InvitedVotings = ({
  votings,
  userId,
  votingId,
}: {
  votings: Voting[];
  votingId: number;
  userId: string;
}) => {
  const [currentVotingId, setCurrentVotingId] = useState(votingId);
  const { isMd } = useWindowSize();
  const [isFirstAnimationFinished, setIsFirstAnimationFinished] =
    useState(false);
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

  const voting = useMemo((): Voting => {
    const currentVoting = votings.find(
      (voting) => voting.id === currentVotingId
    );
    return (currentVoting !== undefined ? currentVoting : votings[0]) as Voting;
  }, [currentVotingId, votings]);

  const followingVoting = useMemo(() => {
    if (votings && voting) {
      const selectedVotingIndex = votings.findIndex(
        (selectedVoting) => selectedVoting.id === voting.id
      );
      const nextVotings = votings.slice(selectedVotingIndex + 1);
      const nextVoting = nextVotings.shift();
      const previousVotings = votings.slice(0, selectedVotingIndex);
      const previousVoting = previousVotings.pop();
      return nextVoting && nextVoting.id !== voting.id
        ? nextVoting
        : previousVoting;
    }
  }, [votings, voting]);

  return (
    <motion.div
      id={`voting-${voting?.id}`}
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
      className="relative flex w-full flex-col items-center justify-center  overflow-hidden px-4 md:w-5/6  lg:w-2/3"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h3 className="w-full text-left font-lexend text-2xl font-medium text-neutral">
          {voting
            ? "You were invited to participate in this voting:"
            : "This voting no longer exists"}
        </h3>
        <div className="flex w-full flex-col justify-center md:flex-row md:space-x-4">
          <div className="flex aspect-square w-full flex-col items-center rounded-xl bg-neutral/10 py-4 px-4 md:w-1/2">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-lg">{voting.description}</span>
            </div>
            <span className="text-left text-lg text-neutral">
              Voting ends in 2 days.
            </span>
          </div>
          <motion.div
            animate={{ x: 0, transition: { duration: 3.5 } }}
            className="w-full py-4 md:w-1/2"
          >
            <div className="grid w-full grid-cols-5 justify-items-start gap-4 md:w-max md:grid-cols-2">
              {voting.videos.slice(0, 5).map((video, index) => (
                <motion.img
                  custom={index}
                  key={video.url}
                  alt={video.title}
                  src={`data:image/png;base64,${video.thumbnailB64}`}
                  height={150}
                  width={150}
                  variants={
                    !isMd
                      ? {
                          hidden: { opacity: 0, y: 100, scale: 0.8 },
                          visible: { opacity: 1, y: 0, scale: 1 },
                        }
                      : {
                          hidden: { opacity: 0, y: -50, scale: 0.8 },
                          visible: { opacity: 1, y: 0, scale: 1 },
                        }
                  }
                  onAnimationComplete={() => {
                    if (index === voting.videos.length - 1 || index === 4) {
                      setIsFirstAnimationFinished(true);
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                  }}
                  className="col-span-1 aspect-square max-h-[80px] w-[80px] rounded-xl object-cover md:max-h-[150px] md:w-[150px] md:min-w-[45px]"
                />
              ))}
              <p className="col-span-2 hidden md:block">
                Other users have voted more than <b>120 times</b>
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1">
          <Link
            href={`/voting/${userId}/${voting.id}`}
            className="z-[11] flex items-center justify-center space-x-1 text-xl text-han-purple"
          >
            <button>Start voting</button>
            <Icon path={mdiArrowRight} size={1} />
          </Link>
        </div>
      </div>
      <VotingsDrawer
        followingVoting={followingVoting}
        isFirstAnimationFinished={isFirstAnimationFinished}
        setCurrentVotingId={setCurrentVotingId}
        userId={userId}
      />
    </motion.div>
  );
};
