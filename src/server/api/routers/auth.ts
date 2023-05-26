import { z } from "zod";
import { hash, compare } from "bcryptjs"
import { TRPCError } from "@trpc/server";
import { TokenExpiredError, verify } from "jsonwebtoken";

import { PasswordValidation } from "~/entities/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateTokens, deletedCookie, refreshCookieName } from "~/shared/auth";
import { env } from "~/env.mjs";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({
      name: z.string().regex(/^[A-Za-z]+$/),
      email: z.string().email(),
      password: z.string().regex(PasswordValidation),
      repPassword: z.string().regex(PasswordValidation)
    })
      .refine((data) => data.password === data.repPassword, {
        message: "Passwords don't match",
        path: ["repPassword"],
      }))
    .mutation(async ({ ctx, input }) => {
      try {
        const hashedPassword = await hash(input.password, 10);
        const { token, refreshToken, cookieExpireDate, refreshCookie } = generateTokens(input.email);

        const user = await ctx.prisma.user.create({
          data: {
            name: input.name.charAt(0).toUpperCase() + input.name.slice(1).toLowerCase(),
            mail: input.email.toLowerCase(),
            role: 'user',
            password: hashedPassword,
            sessions: {
              create: {
                type: 'desktop',
                tokenType: 'jwt',
                provider: 'creds',
                refreshToken: refreshToken,
                expires: cookieExpireDate.toISOString(),
              }
            }
          },
          include: {
            sessions: true,
          },
        });
        ctx.res.setHeader("set-cookie", refreshCookie);
        return { token, mail: user.mail, name: user.name, role: user.role }
      } catch (err) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'The user with this email has already been created' });
      }
    }),
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().regex(PasswordValidation),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.prisma.user.update({
          select: { mail: true, name: true, role: true, password: true },
          data: {
            sessions: {
              deleteMany: { type: 'desktop' }
            }
          },
          where: { mail: input.email }
        })
        if (!existingUser) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'User with such email does not exist' });
        }
        const passwordsEqual = await compare(input.password, existingUser.password || '');
        if (!passwordsEqual) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Password is incorrect' });
        }
        const { token, refreshToken, cookieExpireDate, refreshCookie } = generateTokens(input.email);
        await ctx.prisma.user.update({
          data: {
            sessions: {
              create: {
                type: 'desktop',
                tokenType: 'jwt',
                provider: 'creds',
                refreshToken: refreshToken,
                expires: cookieExpireDate.toISOString(),
              }
            }
          },
          where: {
            mail: existingUser.mail,
          }
        });

        ctx.res.setHeader("set-cookie", refreshCookie)
        return { token, mail: existingUser.mail, name: existingUser.name, role: existingUser.role }
      } catch (err) {
        throw err;
      }
    }),
  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        const incomingToken = ctx.req.headers.authorization || ctx.req.cookies[refreshCookieName] || "";
        if (incomingToken) {
          const decodedToken = verify(
            incomingToken,
            env.JWT_SECRET
          ) as { mail: string; type: string; };
          if (decodedToken) {
            await ctx.prisma.user.update({
              select: { mail: true, name: true, role: true, password: true },
              data: {
                sessions: {
                  deleteMany: { refreshToken: incomingToken, type: 'desktop' }
                }
              },
              where: { mail: decodedToken.mail }
            });
            ctx.res.setHeader("set-cookie", deletedCookie);
            return 204;
          }
        }
      } catch (e) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User with such email does not exist' });
      }
    }),
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
          if (user) {
            const { token, refreshToken: newToken, cookieExpireDate, refreshCookie } = generateTokens(user.mail);
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
        }
      } catch (e) {
        if (e instanceof TokenExpiredError) {
          if (!ctx.req.headers.authorization && ctx.req.cookies[refreshCookieName]) {
            ctx.res.setHeader("set-cookie", deletedCookie);
          }
        }
        throw e;
      }
    })
});
