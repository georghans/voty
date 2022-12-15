import { AnimatePresence } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "../../../components/utils/Spinner";
import { InvitedVotings } from "../../../components/votingsVariants/InvitedVotings";
import { trpc } from "../../../utils/trpc";

const SelectVoting: NextPage = () => {
  const { userId, preselectedId } = useRouter().query;

  const { data: votings, isInitialLoading: isLoadingMultipleVotings } =
    trpc.voting.getAllVotings.useQuery();

  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {isLoadingMultipleVotings || !votings || votings.length === 0 ? (
        <Spinner main />
      ) : (
        <main className="flex h-full flex-col items-center justify-center px-4">
          <AnimatePresence
            mode="wait"
            initial={true}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <InvitedVotings
              votings={votings}
              votingId={parseInt(preselectedId as string)}
              userId={userId as string}
            />
          </AnimatePresence>
        </main>
      )}
    </>
  );
};
SelectVoting.getInitialProps = async (ctx) => {
  // get the query parameter from the context object
  const { query } = ctx;

  // set the query parameter on the router object
  // so that it is available on the first render
  ctx.query = query;

  // return an empty object
  return {};
};
export default SelectVoting;
