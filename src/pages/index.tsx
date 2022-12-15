import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import CreatableSelect from "react-select/creatable";
import { trpc } from "../utils/trpc";

const Users: NextPage = () => {
  const users = trpc.auth.getAllUsers.useQuery();
  const router = useRouter();
  const createUser = trpc.auth.createUser.useMutation();
  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex h-full flex-col items-center justify-center">
        <div className=" flex w-full flex-col items-center justify-center space-y-4 px-4 md:w-5/6 md:space-y-6 lg:w-2/3">
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="font-lexend text-2xl font-medium text-neutral">
              Pick or create a user:
            </h3>
          </div>
          <CreatableSelect
            className="w-full max-w-xs"
            classNames={{
              control: ({ isDisabled, isFocused }) =>
                clsx(
                  !isDisabled && isFocused && "!border-neutral",
                  isFocused && "!shadow-[0_0_0_1px] !shadow-neutral",
                  isFocused && "!hover:border-neutral"
                ),
              option: ({ isDisabled, isFocused, isSelected }) =>
                clsx(
                  isSelected && "!bg-neutral",
                  !isSelected && isFocused && "!bg-neutral/30",
                  !isDisabled && isSelected && "!active:bg-neutral",
                  !isDisabled && !isSelected && "!active:bg-neutral/50"
                ),
            }}
            placeholder="Type your username..."
            isClearable
            onCreateOption={(inputValue) => {
              createUser.mutate(
                {
                  name: inputValue,
                },
                {
                  onSuccess: (user) => {
                    router.push(`/voting/${user.id}?preselectedId=1`);
                  },
                }
              );
            }}
            onChange={(e) => {
              router.push(`/voting/${e?.value}?preselectedId=1`);
            }}
            options={users.data?.map((user) => {
              return { value: user.id, label: user.name };
            })}
          />
        </div>
      </main>
    </>
  );
};

export default Users;
