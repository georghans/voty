import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";
const _MAX_VIDEOS_ = 8;

const Home: NextPage = () => {
  const allVideos = trpc.voting.getAllVideos.useQuery();
  const vote = trpc.voting.castVote.useMutation();
  const [videosInVoting, setVideosInVoting] = useState([0, 1]);

  const getRandomVideoPair = () => {
    const video1 = Math.floor(Math.random() * _MAX_VIDEOS_);
    let video2 = Math.floor(Math.random() * _MAX_VIDEOS_);
    while (video2 === video1) {
      video2 = Math.floor(Math.random() * _MAX_VIDEOS_);
    }
    return [video1, video2];
  };

  const castVote = (votedFor: number, votedAgainst: number) => {
    vote.mutate({ votedFor, votedAgainst });
    setVideosInVoting(getRandomVideoPair());
  };

  if (!allVideos.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo_white.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Voty</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              onClick={() =>
                castVote(videosInVoting[0] ?? 0, videosInVoting[1] ?? 0)
              }
            >
              <h3 className="text-2xl font-bold">
                {"Video 1: " + allVideos.data[videosInVoting[0] ?? 0]?.title ??
                  "Loading..."}
              </h3>
            </div>
            <div
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              onClick={() =>
                castVote(videosInVoting[1] ?? 0, videosInVoting[0] ?? 0)
              }
            >
              <h3 className="text-2xl font-bold">
                {"Video 1: " + allVideos.data[videosInVoting[1] ?? 0]?.title ??
                  "Loading..."}
              </h3>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
