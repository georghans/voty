import { router } from "../trpc";
import { votingRouter } from "./voting";

export const appRouter = router({
  voting: votingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
