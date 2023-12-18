import { TRPCError } from "@trpc/server";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { cookies } from "next/headers";

import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { generateTokens, deletedCookie, refreshCookieName } from "~/shared/auth";
import type { TGenerateToken, TDecodedToken } from "~/shared/auth/types";

const refreshToken = async ({ decodedToken, incomingToken }: TGenerateToken) => {
  const user = await prisma.user.update({
    include: { sessions: true },
    data: {
      sessions: {
        deleteMany: { refreshToken: incomingToken, type: decodedToken.type }
      }
    },
    where: {
      mail: decodedToken.mail,
    }
  });
  const { token, refreshToken: newToken, cookieExpireDate, refreshCookie } = generateTokens({ mail: user.mail });
  await prisma.user.update({
    include: { sessions: true },
    data: {
      sessions: {
        create: {
          type: 'desktop',
          tokenType: 'jwt',
          provider: 'creds',
          refreshToken: newToken,
          expires: cookieExpireDate.toISOString(),
        }
      }
    },
    where: {
      mail: decodedToken.mail,
    }
  });
  return { token, user, refreshCookie };
}

export const getSession = async (incomingToken: string) => {
  const decodedToken = verify(
    incomingToken,
    env.JWT_SECRET
  ) as TDecodedToken;

  return await refreshToken({ decodedToken, incomingToken });
};

export const sessionRouter = createTRPCRouter({
  getSessionSsr: publicProcedure.input(z.object({ token: z.string().trim() })).query(async (opts) => {
    const { token, user, refreshCookie } = await getSession(opts.input.token);
    return { token, user, refreshCookie };
  }),
  getSession: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.headers.get('authorization') && !cookies().get(refreshCookieName)?.value) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing token' });
      }
      try {
        try {
          const incomingToken = ctx.headers.get('authorization') || cookies().get(refreshCookieName)?.value || "";
          const { token, user, refreshCookie } = await getSession(incomingToken);

          ctx.resHeaders.set("set-cookie", refreshCookie);
          return { token, mail: user.mail, name: user.name, role: user.role };
        } catch (e) {
          if (e instanceof TokenExpiredError) {
            if (ctx.headers.get('authorization')) {
              const { token, user, refreshCookie } =
                await getSession(ctx.headers.get('authorization') || "");
              ctx.resHeaders.set("set-cookie", refreshCookie);
              return { token, mail: user.mail, name: user.name, role: user.role };
            } else {
              throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token expired' });
            }
          }
          throw e;
        }
      } catch (e) {
        if (!ctx.resHeaders.get("set-cookie")) {
          ctx.resHeaders.set("set-cookie", deletedCookie);
        }
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'User with such email does not exist' });
          }
        }
        throw e;
      }
    })
});
