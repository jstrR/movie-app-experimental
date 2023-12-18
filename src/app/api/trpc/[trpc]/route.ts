import { type FetchCreateContextFnOptions, fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ resHeaders, info }: FetchCreateContextFnOptions) => createTRPCContext({ req, resHeaders, info }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => { console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,); }
        : undefined,
  });
export { handler as GET, handler as POST };