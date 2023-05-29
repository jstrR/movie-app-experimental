import { z } from "zod";
import { hash, compare } from "bcryptjs"
import { TRPCError } from "@trpc/server";
import { verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

import { PasswordValidation } from "~/entities/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateTokens, deletedCookie, refreshCookieName, type TGoogleCredentials } from "~/shared/auth";
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
        const { token, refreshToken, cookieExpireDate, refreshCookie } = generateTokens({ mail: input.email });

        const user = await ctx.prisma.user.create({
          data: {
            name: input.name.charAt(0).toUpperCase() + input.name.slice(1).toLowerCase(),
            mail: input.email.toLowerCase(),
            role: 'user',
            fromProvider: false,
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
          select: { mail: true, name: true, role: true, password: true, fromProvider: true },
          data: {
            sessions: {
              deleteMany: { type: 'desktop' }
            }
          },
          where: { mail: input.email }
        });
        if (existingUser.fromProvider) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Login with previously used account provider' });
        }
        const passwordsEqual = await compare(input.password, existingUser.password || '');
        if (!passwordsEqual) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Password is incorrect' });
        }
        const { token, refreshToken, cookieExpireDate, refreshCookie } = generateTokens({ mail: input.email });
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
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'User with such email does not exist' });
          }
        }
        throw err;
      }
    }),
  loginGoogle: publicProcedure
    .input(z.object({
      accessToken: z.string(),
      expiresIn: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${input.accessToken}`, {
          headers: {
            Authorization: `Bearer ${input.accessToken}`,
          }
        }).then((data) => {
          if (!data || !data.ok) {
            throw new Error(data.statusText);
          }
          return data.json();
        }) as TGoogleCredentials;

        const expireDate = new Date(new Date().setSeconds(input.expiresIn));
        const { token, refreshCookie } = generateTokens({
          mail: googleResponse.email,
          customToken: input.accessToken,
          expireDate
        });
        const newSession = {
          type: 'desktop',
          tokenType: 'jwt',
          provider: 'google',
          refreshToken: input.accessToken,
          expires: expireDate.toISOString(),
        };

        const user = await ctx.prisma.user.upsert({
          create: {
            name: googleResponse.name,
            mail: googleResponse.email,
            mailVerified: googleResponse.email_verified,
            image: googleResponse.picture,
            role: 'user',
            fromProvider: true,
            sessions: {
              create: newSession
            }
          },
          update: {
            sessions: {
              create: newSession
            }
          },
          where: {
            mail: googleResponse.email,
          },
          include: {
            sessions: true,
          },
        });

        ctx.res.setHeader("set-cookie", refreshCookie)
        return { token, mail: user.mail, name: user.name, role: user.role }
      } catch (err) {
        throw err;
      }
    }),
  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      try {
        const cookieToken = ctx.req.cookies[refreshCookieName];
        const incomingToken = ctx.req.headers.authorization || cookieToken || "";
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
                  deleteMany: { refreshToken: cookieToken || incomingToken, type: 'desktop' }
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
});
