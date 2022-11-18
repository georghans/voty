import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const votingRouter = router({
  getAllVideos: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.video.findMany();
  }),
  castVote: publicProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { votedFor, votedAgainst } = input;
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
        },
      });
      return vote;
    }),
});
