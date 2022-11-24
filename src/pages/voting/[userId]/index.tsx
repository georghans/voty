import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const Home: NextPage = () => {
  const votings = trpc.voting.getAllVotings.useQuery();
  const { userId } = useRouter().query;
  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
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
                  href={`/voting/${userId}/${voting.id}`}
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
