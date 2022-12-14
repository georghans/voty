import { prisma } from "../src/server/db/client";
import { getThumbnails } from "../src/utils/getThumbnails";

const fillDB = async () => {
  const user = await prisma.user.create({
    data: {
      id: 1,
      name: "Max Mustermann",
    },
  });

  const voting = await prisma.voting.create({
    data: {
      id: 1,
      title: "TSV Fichte Hagen Goals",
      description:
        "A collection goals from TSV Fichte Hagen games. Vote for your favorite goal!",
      userId: 1,
    },
  });

  const videos = [
    {
      title: "Cheng Goal 1",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/1_Cheng1.mp4",
    },
    {
      title: "Cheng Goal 2",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/2_Cheng2.mp4",
    },
    {
      title: "Penalty Goal",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/3_Elfer.mp4",
    },
    {
      title: "Krämer Goal",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/4_Kra%CC%88mer.mp4",
    },
    {
      title: "Nico Goal 1",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/5_Nico.mp4",
    },
    {
      title: "Nico Goal 2",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/6_Nico2.mp4",
    },
    {
      title: "Piet Goal",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/7_Piet.mp4",
    },
    {
      title: "Valdrin Goal",
      url: "https://s3.eu-central-1.amazonaws.com/voty.app/8_Valdrin.mp4",
    },
  ];

  const videoCreations = await Promise.all(
    videos.map(async (video) =>
      prisma.video.create({
        data: {
          ...video,
          votingId: 1,
          thumbnailB64: (await getThumbnails(video.url)) as string,
        },
      })
    )
  );

  console.log(
    "Creations:\n",
    "users:\n",
    user,
    "votings:\n",
    voting,
    "videos:\n",
    videoCreations
  );
};

fillDB();
