const MAX_VIDEO_ID = 8;

export const getRandomVideo: (notThisOne?: number) => number = (notThisOne) => {
  const videoId = Math.floor(Math.random() * MAX_VIDEO_ID) + 1;
  if (videoId !== notThisOne) return videoId;
  return getRandomVideo(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomVideo();
  const secondId = getRandomVideo(firstId);

  return [firstId, secondId];
};
