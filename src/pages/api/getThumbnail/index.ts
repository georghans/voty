/* eslint-disable @typescript-eslint/no-explicit-any */
// ! Keep this file for futere references
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import bl from "bl";
import Ffmpeg from "fluent-ffmpeg";
import { type NextApiRequest, type NextApiResponse } from "next";
const getThumbnail = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = "https://s3.eu-central-1.amazonaws.com/voty.app/1_Cheng1.mp4"; //req.query?.url as string
  const amount = 10; //parseInt(req.query?.amount.toString()) as string ?? 5as
  const options = {
    format: "mjpeg",
    frames: 1,
    size: "320x240",
    end: true,
  };
  const thumbnails: string[] = [];

  // create a single ffmpeg instance
  const ffmpeg = Ffmpeg(url)
    .setFfmpegPath(ffmpegPath.path)
    .format(options.format)
    .frames(options.frames)
    .size(options.size);

  const thumbnailPromises = [];

  // generate thumbnails at different times in the video
  for (let i = 0; i < amount; i++) {
    const seconds = i * 1.05;
    const ffmpegInstance = ffmpeg.clone();
    const thumbnailPromise = new Promise<void>((resolve, reject) => {
      ffmpegInstance
        .seek(seconds)
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", () => {
          console.log("end");
          resolve();
        })
        .pipe(
          bl((_err: unknown, data: any) => {
            const base64Data = data.toString("base64");
            thumbnails.push(base64Data);
            res.write(JSON.stringify(thumbnails[thumbnails.length - 1]));
          }) as any
        );
    });
    thumbnailPromises.push(thumbnailPromise);
  }
  await Promise.all(thumbnailPromises);
  res.end();
};

export default getThumbnail;

// Stream the response using axios

// const fetchThumbnails = async () => {
//   axios.create({
//     responseType: "stream",
//   });
//   await axios.get(`http://localhost:3000/api/getThumbnail`, {
//     onDownloadProgress(progressEvent) {
//       const currentTarget = progressEvent.event
//         ?.currentTarget as XMLHttpRequestUpload & {
//         response: string;
//       };
//       const thumbnailsRes = currentTarget.response
//         .split('""')
//         .map((thumbnail: string) => thumbnail.replaceAll('"', ""))
//         .filter((thumbnail) => thumbnail !== "");
//       setThumbnails(thumbnailsRes);
//     },
//   });
// };
