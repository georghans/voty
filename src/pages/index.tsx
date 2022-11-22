import { type NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import type { VideoFromServer } from "../server/trpc/trpc";
import ReactPlayer from "react-player";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const voteMutation = trpc.voting.castVote.useMutation();
  const videoPair = trpc.voting.getVideoPair.useQuery(undefined, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const castVote = (selected: number) => {
    if (!videoPair.data?.first || !videoPair.data?.second || selected === -1)
      return; // make ts happy

    if (selected === videoPair.data.first?.id) {
      // If voted for 1st video, fire voteFor with first ID
      voteMutation.mutate({
        votedFor: videoPair.data.first?.id,
        votedAgainst: videoPair.data.second?.id,
      });
    } else {
      // else fire voteFor with second ID
      voteMutation.mutate({
        votedAgainst: videoPair.data.first?.id,
        votedFor: videoPair.data.second?.id,
      });
    }

    videoPair.refetch();
  };

  if (!videoPair.data?.first || !videoPair.data?.second) {
    return <div>Loading...</div>;
  }

  const fetchingNext = voteMutation.isLoading || videoPair.isLoading;

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
            {videoPair.data.first && (
              <div className="animate-fade-in flex max-w-2xl flex-col items-center justify-between p-8 md:flex-row">
                <VideoListing
                  video={videoPair.data.first}
                  vote={() => castVote(videoPair.data.first?.id ?? -1)}
                  disabled={fetchingNext}
                />
                <VideoListing
                  video={videoPair.data.second}
                  vote={() => castVote(videoPair.data.second?.id ?? -1)}
                  disabled={fetchingNext}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

const VideoListing: React.FC<{
  video: VideoFromServer;
  vote: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.video?.id}
    >
      <div className="w-100 h-60">
        <ReactPlayer url="1_Cheng1.mp4" width="100%" height="100%" playing />
      </div>
      <div className="mt-[-0.5rem] text-center text-xl capitalize">
        {props.video?.url ?? ""}
      </div>
      <button
        className={btn}
        onClick={() => props.vote()}
        disabled={props.disabled}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;
