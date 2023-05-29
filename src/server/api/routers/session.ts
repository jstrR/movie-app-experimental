import { TRPCError } from "@trpc/server";
import { verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateTokens, deletedCookie, refreshCookieName } from "~/shared/auth";
import { env } from "~/env.mjs";

export const sessionRouter = createTRPCRouter({
  session: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const incomingToken = ctx.req.headers.authorization || ctx.req.cookies[refreshCookieName] || "";
        if (!incomingToken) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token' });
        }
        const decodedToken = verify(
          incomingToken,
          env.JWT_SECRET
        ) as { mail: string; type: string; };
        if (decodedToken) {
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

          ctx.res.setHeader("set-cookie", refreshCookie);
          return { token, mail: user.mail, name: user.name, role: user.role };
        }
      } catch (e) {
        ctx.res.setHeader("set-cookie", deletedCookie);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'User with such email does not exist' });
          }
        }
        throw e;
      }
    })
});
