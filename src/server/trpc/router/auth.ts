import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const authRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
