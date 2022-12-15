import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import bl from "bl";
import Ffmpeg from "fluent-ffmpeg";
export const getThumbnails = async (url: string) => {
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
  const ffmpegInstance = ffmpeg.clone();
  const thumbnailPromise = new Promise<void>((resolve, reject) => {
    ffmpegInstance
      .seek(2)
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
        }) as any
      );
  });
  await Promise.resolve(thumbnailPromise);
  return thumbnails[0];
};
