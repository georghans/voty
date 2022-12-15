import { mdiArrowRightCircle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Dispatch } from "react";
import { useEffect, useState } from "react";
import useWindowSize from "../../utils/hooks/useWindowSize";
import type { Voting } from "../votingsVariants/InvitedVotings";
export const VotingsDrawer = ({
  followingVoting,
  setCurrentVotingId,
  isFirstAnimationFinished,
  userId,
}: {
  followingVoting: Voting | undefined;
  setCurrentVotingId: Dispatch<number>;
  isFirstAnimationFinished: boolean;
  userId: string;
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { isMd, isXl } = useWindowSize();
  useEffect(() => {
    if (isMd) setIsMobileDrawerOpen(false);
  }, [isMd]);
  const getDrawerWidth = () => {
    if (isXl) {
      return "25%";
    } else {
      if (isMd) {
        return "80%";
      } else {
        return 0;
      }
    }
  };
  const handleVisitNextVoting = (): void => {
    followingVoting && setCurrentVotingId(followingVoting.id);
  };
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: "100%" },
        visible: {
          opacity: isMobileDrawerOpen ? 1 : 0.4,
          x: getDrawerWidth(),
          // huh
          backgroundColor: !isXl
            ? isMobileDrawerOpen
              ? "rgb(15 15 16 / 0.9)"
              : !isMd
              ? "rgb(15 15 16 / 0)"
              : "rgb(15 15 16 / 0.1)"
            : "rgb(15 15 16 / 0.1)",
        },
        hover: {
          x: 0,
          scale: 1.025,
          opacity: 0.9,
          backgroundColor: !isXl
            ? "rgb(15 15 16 / 0.9)"
            : "rgb(15 15 16 / 0.1)",
        },
      }}
      whileHover={isMd ? "hover" : undefined}
      whileTap={isMd ? "hover" : undefined}
      initial="hidden"
      animate={isFirstAnimationFinished && "visible"}
      className={clsx(
        isMobileDrawerOpen ? "z-[12] bg-neutral/90" : "z-10 md:bg-neutral/10 ",
        "fixed bottom-0 left-0 m-0 flex w-full cursor-pointer select-none flex-col justify-center overflow-y-hidden rounded-t-xl p-6 opacity-30 duration-150 md:left-auto md:right-0 md:top-0 md:h-screen md:w-max md:rounded-t-none "
      )}
      onClick={handleVisitNextVoting}
    >
      <motion.span
        className={clsx(
          isXl ? " text-neutral" : "text-white",
          "font-lexend text-lg font-medium "
        )}
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
            scale: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
          },
          hover: {
            opacity: 1,
            scale: 1,
          },
        }}
      >
        View next voting
      </motion.span>
      <motion.div
        animate={{ x: 0, transition: { duration: 3.5 } }}
        className="relative w-full py-4 md:w-1/2 "
      >
        <div className="grid w-full grid-cols-5 justify-items-start gap-4 md:w-max md:grid-cols-2">
          {followingVoting ? (
            followingVoting.videos.slice(0, 5).map((video, index) => (
              <motion.img
                key={video.url}
                alt={video.title}
                src={`data:image/png;base64,${video.thumbnailB64}`}
                height={150}
                width={150}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
                    scale: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
                  },
                  hover: {
                    opacity: 1,
                    scale: 1,
                  },
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 50,
                }}
                className="col-span-1 aspect-square max-h-[80px] w-[80px] rounded-xl object-cover md:max-h-[150px] md:w-[150px] md:min-w-[45px]"
              />
            ))
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
                  scale: !isXl ? (!isMobileDrawerOpen ? 0 : 1) : 1,
                },
                hover: {
                  opacity: 1,
                  scale: 1,
                },
              }}
              className="col-span-1 aspect-square max-h-[80px] w-[80px] rounded-xl object-cover md:max-h-[150px] md:w-[150px] md:min-w-[45px]"
            />
          )}
        </div>
        <motion.div
          className="w-full py-2 text-center font-lexend text-lg font-medium text-han-purple"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: !isMobileDrawerOpen ? 0 : 1,
              scale: !isMobileDrawerOpen ? 0 : 1,
            },
          }}
          initial="hidden"
          animate="visible"
          onClick={handleVisitNextVoting}
        >
          <span>{followingVoting?.title}</span>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: isXl ? 0 : 1,
              color: isMobileDrawerOpen ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
              top: isMobileDrawerOpen ? 0 : "50%",
              y: isMobileDrawerOpen ? "-90%" : 0,
              x: !isMd ? "25%" : "-25%",
            },
            hover: {
              opacity: 0,
            },
          }}
          whileHover={{
            scale: 1.025,
          }}
          className="absolute right-0 md:right-auto md:left-0 md:top-1/2 md:translate-y-1/2"
        >
          <div
            onClick={(e) => {
              if (!isMd) {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileDrawerOpen((open) => !open);
              }
            }}
          >
            <Icon
              path={mdiArrowRightCircle}
              size={2}
              rotate={!isMd ? (isMobileDrawerOpen ? 90 : -90) : 0}
            />
          </div>
        </motion.div>
      </motion.div>
      <div
        className={clsx(
          !isMd && !isMobileDrawerOpen && "hidden",
          "flex w-full flex-col items-center justify-center space-y-1"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span
          className={clsx(
            isXl ? " text-neutral" : "text-white",
            "font-lexend text-lg font-medium "
          )}
        >
          OR
        </span>
        <Link
          href={`/voting/${userId}/create`}
          className="text-xl text-han-purple"
        >
          <button>Create a new voting</button>
        </Link>
      </div>
    </motion.div>
  );
};
