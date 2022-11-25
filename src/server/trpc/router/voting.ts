import { getOptionsForVote } from "./../../../utils/getRandomVideo";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

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

  getAllVotings: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.voting.findMany();
  }),

  getVideoPair: publicProcedure
    .input(
      z.object({
        votingId: z.number(),
      })
    )
    .query(async ({ ctx }) => {
      const [first, second] = getOptionsForVote();
      const bothVideos = await ctx.prisma.video.findMany({
        where: {
          OR: [{ id: first }, { id: second }],
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
    .query(({ ctx, input }) => {
      return ctx.prisma.video.findMany({
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
          title: true,
          url: true,
          _count: {
            select: {
              VoteFor: true,
              VoteAgainst: true,
            },
          },
        },
      });
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
