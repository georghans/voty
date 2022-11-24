import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

const Home: NextPage = () => {
  const votings = trpc.voting.getAllVotings.useQuery();

  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#e3dcff]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold text-purple-500 sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Voty</span>
          </h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-2xl font-bold text-white">All open votings:</h3>
          </div>
          {votings.data?.map((voting) => (
            <div
              key={voting.id}
              className="animate-fade-in flex flex-col items-center justify-between p-8 md:flex-row"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  href={`/voting/${voting.id}`}
                  className="rounded border border-white bg-transparent py-2 px-4 font-semibold capitalize text-white hover:border-transparent hover:bg-white hover:text-black"
                >
                  {voting.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
