import { z } from "zod";
import { getThumbnails } from "../../../utils/getThumbnails";
import { publicProcedure, router } from "../trpc";
import { getOptionsForVote } from "./../../../utils/getRandomVideo";

export const votingRouter = router({
  getAllVideos: publicProcedure
    .input(
      z.object({
        votingId: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.video.findMany({
        where: {
          Voting: {
            id: input.votingId,
          },
        },
      });
    }),

  createVoting: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        title: z.string(),
        description: z.string(),
        videos: z.array(
          z.object({
            title: z.string(),
            url: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, videos, userId } = input;
      const videosWithThumbnails: {
        title: string;
        url: string;
        thumbnailB64: string;
      }[] = await Promise.all(
        videos.map(async (video) => {
          return {
            ...video,
            thumbnailB64: (await getThumbnails(video.url)) as string,
          };
        })
      );
      const voting = await ctx.prisma.voting.create({
        data: {
          title: title,
          description: description,
          userId: userId,
          videos: {
            create: videosWithThumbnails,
          },
        },
        include: {
          videos: true,
        },
      });
      return voting;
    }),

  getAllVotings: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.voting.findMany({
      select: {
        description: true,
        id: true,
        title: true,
        videos: true,
      },
    });
  }),

  getSingleVoting: publicProcedure
    .input(
      z.object({
        votingId: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.voting.findFirst({
        where: {
          id: input.votingId,
        },
        select: {
          description: true,
          id: true,
          title: true,
          videos: true,
        },
      });
    }),

  getVideoPair: publicProcedure
    .input(
      z.object({
        votingId: z.number(),
        exclude: z
          .object({
            first: z.number(),
            second: z.number(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const maxVideosAmount = await ctx.prisma.video.findMany({
        where: {
          votingId: input.votingId,
        },
      });

      const [first, second] = getOptionsForVote(
        input.exclude ? [input.exclude.first, input.exclude.second] : null,
        maxVideosAmount[0]?.id ?? 1,
        maxVideosAmount.length
      );

      const bothVideos = await ctx.prisma.video.findMany({
        where: {
          AND: [
            {
              Voting: {
                id: input.votingId,
              },
            },
            {
              OR: [{ id: first }, { id: second }],
            },
          ],
        },
      });
      return { first: bothVideos[0], second: bothVideos[1] };
    }),

  getResults: publicProcedure
    .input(
      z.object({
        votingId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const videosData = await ctx.prisma.video.findMany({
        where: {
          Voting: {
            id: input.votingId,
          },
        },
        orderBy: {
          VoteFor: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          title: true,
          url: true,
          thumbnailB64: true,
          _count: {
            select: {
              VoteFor: true,
              VoteAgainst: true,
            },
          },
        },
      });
      const votingData = await ctx.prisma.voting.findFirst({
        where: {
          id: input.votingId,
        },
        select: {
          description: true,
          title: true,
        },
      });
      return { ...votingData, videosData: videosData };
    }),

  castVote: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        votingId: z.number(),
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { votedFor, votedAgainst, votingId, userId } = input;
      const vote = await ctx.prisma.vote.create({
        data: {
          votedFor: {
            connect: {
              id: votedFor,
            },
          },
          votedAgainst: {
            connect: {
              id: votedAgainst,
            },
          },
          Voting: {
            connect: {
              id: votingId,
            },
          },
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return vote;
    }),
});
