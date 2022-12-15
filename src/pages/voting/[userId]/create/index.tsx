import { ErrorMessage } from "@hookform/error-message";
import { mdiCloseThick } from "@mdi/js";
import Icon from "@mdi/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "../../../../components/fields/Input";
import { trpc } from "../../../../utils/trpc";

type Video = { title: string; url: string };
interface CreateVotingForm {
  title: string;
  description: string;
  videos: Video[];
}
const CreateVoting = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [fieldsAmount, setFieldsAmount] = useState(0);
  const createVoting = trpc.voting.createVoting.useMutation();

  const methods = useForm<CreateVotingForm>({
    mode: "onChange",
  });

  const onSubmit = (data: CreateVotingForm) => {
    if (data.videos.length <= 1) {
      methods.setError(
        `videos.${data.videos.length - 1}.title`,
        {
          type: "required",
        },
        {
          shouldFocus: true,
        }
      );
      return;
    }
    const req = {
      ...data,
      videos: data.videos
        .filter((video) => video)
        .slice(0, data.videos.length - 1),
    };
    createVoting.mutate(
      { ...req, userId: parseInt(userId as string) },
      {
        onSuccess: (data) => {
          router.push(`/voting/${userId}?preselectedId=${data.id}`);
        },
      }
    );
  };
  const watch = useWatch({
    control: methods.control,
  });
  return (
    <>
      <Head>
        <title>Voty</title>
        <meta name="description" content="Video Voting Shootout POC App" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex h-full flex-col items-center justify-center px-4">
        <div className=" flex w-full flex-col items-center justify-center space-y-4 px-4 md:w-5/6 md:space-y-6 lg:w-2/3">
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="font-lexend text-2xl font-medium text-neutral">
              {"Create a new voting:"}
            </h3>
          </div>

          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex w-full flex-col space-y-2 md:w-1/3"
            id="voting-form"
          >
            <Input
              label="Title"
              register={methods.register("title", {
                required: true,
              })}
            />
            <Input
              label="Description"
              register={methods.register("description", {
                required: true,
              })}
            />
            <span className="text-center text-lg font-semibold text-neutral">
              Videos:
            </span>
            <div className="flex flex-col space-y-1">
              {watch?.videos &&
                watch.videos.map((field, index) => (
                  <div key={index}>
                    {index !== fieldsAmount && (
                      <div className="flex justify-between">
                        <div className="text-neutral">{field.title}</div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            console.log(watch, index);
                            methods.unregister(`videos.${index}`);
                          }}
                        >
                          <Icon
                            path={mdiCloseThick}
                            size={1}
                            className="text-red-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="flex w-full flex-col space-y-2">
              <Input
                label="Title"
                register={methods.register(`videos.${fieldsAmount}.title`)}
              />

              <Input
                label="URL"
                register={methods.register(`videos.${fieldsAmount}.url`, {
                  pattern: {
                    value:
                      /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi,
                    message: "Invalid URL",
                  },
                })}
              />
              <div className="text-sm font-medium text-red-600">
                <ErrorMessage
                  errors={methods.formState.errors}
                  name={`videos.${fieldsAmount}.url`}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  methods.trigger(`videos.${fieldsAmount}.title`, {
                    shouldFocus: true,
                  });
                  if (
                    watch.videos !== undefined &&
                    !methods.formState.errors.videos &&
                    !watch.videos?.find(
                      (video) =>
                        (video?.title === "" && video?.url === "") ||
                        (video?.title === undefined && video?.url === undefined)
                    )
                  ) {
                    setFieldsAmount((amount) => amount + 1);
                    methods.setValue(`videos.${fieldsAmount + 1}`, {
                      title: "",
                      url: "",
                    });
                  }
                }}
                disabled={
                  methods.getValues(`videos.${fieldsAmount}`)?.title === "" ||
                  methods.getValues(`videos.${fieldsAmount}`)?.url === ""
                }
                className="self-end rounded border border-neutral bg-white py-1 px-2 text-sm font-semibold capitalize  text-neutral hover:border-white hover:bg-neutral hover:text-white disabled:bg-neutral/10"
              >
                Add video
              </button>
            </div>
          </form>
          <button
            form="voting-form"
            type="submit"
            className="rounded border border-neutral bg-neutral py-2 px-4 font-semibold  capitalize text-white hover:border-transparent"
          >
            Save voting
          </button>
        </div>
      </main>
    </>
  );
};

export default CreateVoting;
