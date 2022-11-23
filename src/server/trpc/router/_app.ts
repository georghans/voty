import { router } from "../trpc";
import { votingRouter } from "./voting";
import { authRouter } from "./auth";

export const appRouter = router({
  voting: votingRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
