import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const Users: NextPage = () => {
  const router = useRouter();
  const { votingId } = router.query;
  const users = trpc.auth.getAllUsers.useQuery();

  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#000000]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold text-purple-500 sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Voty</span>
          </h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-2xl font-bold text-white">Choose User:</h3>
          </div>
          {users.data?.map((user) => (
            <div
              key={user.id}
              className="animate-fade-in flex flex-col items-center justify-between p-8 md:flex-row"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  href={`/voting/${votingId}/${user.id}`}
                  className="rounded border border-white bg-transparent py-2 px-4 font-semibold capitalize text-white hover:border-transparent hover:bg-white hover:text-black"
                >
                  {user.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Users;
