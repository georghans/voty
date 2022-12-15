const getRandomVideo: (
  exclude: number[] | null,
  startingVideoId: number,
  maxVideosAmount: number
) => number[] = (exclude, startingVideoId, maxVideosAmount) => {
  const firstVideoId =
    Math.floor(Math.random() * maxVideosAmount) + startingVideoId;
  const secondVideoId =
    Math.floor(Math.random() * maxVideosAmount) + startingVideoId;
  if (
    exclude &&
    (exclude.includes(firstVideoId) ||
      exclude.includes(secondVideoId) ||
      firstVideoId === secondVideoId)
  ) {
    return getRandomVideo(exclude, startingVideoId, maxVideosAmount);
  }
  return [firstVideoId, secondVideoId];
};

export const getOptionsForVote = (
  exclude: number[] | null,
  startingVideoId: number,
  maxVideosAmount: number
) => {
  return getRandomVideo(exclude, startingVideoId, maxVideosAmount);
};
