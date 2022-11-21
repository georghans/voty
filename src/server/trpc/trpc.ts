import type { appRouter } from "./router/_app";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { inferRouterOutputs } from "@trpc/server";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

type RouterOutput = inferRouterOutputs<typeof appRouter>;
export type VideoFromServer = RouterOutput["voting"]["getVideoPair"];

export const publicProcedure = t.procedure;
