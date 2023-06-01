import { TRPCError } from "@trpc/server";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { generateTokens, deletedCookie, refreshCookieName } from "~/shared/auth";
import type { TGenerateToken, TDecodedToken } from "~/shared/auth/types";

const refreshToken = async ({ ctx, decodedToken, incomingToken }: TGenerateToken) => {
  const user = await ctx.prisma.user.update({
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
  await ctx.prisma.user.update({
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

const generateNewTokenFromOld = async ({ ctx, incomingToken }: Omit<TGenerateToken, "decodedToken">) => {
  const decodedToken = verify(
    incomingToken,
    env.JWT_SECRET
  ) as TDecodedToken;

  return await refreshToken({ ctx, decodedToken, incomingToken });
}

export const sessionRouter = createTRPCRouter({
  session: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.req.headers.authorization && !ctx.req.cookies[refreshCookieName]) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing token' });
      }
      try {
        try {
          const incomingToken = ctx.req.headers.authorization || ctx.req.cookies[refreshCookieName] || "";
          const { token, user, refreshCookie } = await generateNewTokenFromOld({ ctx, incomingToken });

          ctx.res.setHeader("set-cookie", refreshCookie);
          return { token, mail: user.mail, name: user.name, role: user.role };
        } catch (e) {
          if (e instanceof TokenExpiredError) {
            if (ctx.req.headers.authorization) {
              const { token, user, refreshCookie } =
                await generateNewTokenFromOld({ ctx, incomingToken: ctx.req.cookies[refreshCookieName] || "" });
              ctx.res.setHeader("set-cookie", refreshCookie);
              return { token, mail: user.mail, name: user.name, role: user.role };
            } else {
              throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token expired' });
            }
          }
          throw e;
        }
      } catch (e) {
        if (!ctx.res.getHeader("set-cookie")) {
          ctx.res.setHeader("set-cookie", deletedCookie);
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
