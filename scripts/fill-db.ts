import { prisma } from "../src/server/db/client";

const fillVideoTable = async () => {
  const videos = [
    {
      title: "Cheng Goal 1",
      url: "/1_Cheng1.mp4",
    },
    {
      title: "Cheng Goal 2",
      url: "/2_Cheng2.mp4",
    },
    {
      title: "Penalty Goal",
      url: "/3_Elfer.mp4",
    },
    {
      title: "Krämer Goal",
      url: "/4_Krämer.mp4",
    },
    {
      title: "Nico Goal 1",
      url: "/5_Nico.MP4",
    },
    {
      title: "Nico Goal 2",
      url: "/6_Nico2.mp4",
    },
    {
      title: "Piet Goal",
      url: "/7_Piet.mp4",
    },
    {
      title: "Valdrin Goal",
      url: "/8_Valdrin.mp4",
    },
  ];

  const creations = await Promise.all(
    videos.map((video) => prisma.video.create({ data: video }))
  );

  console.log("Creations?", creations);
};

fillVideoTable();
