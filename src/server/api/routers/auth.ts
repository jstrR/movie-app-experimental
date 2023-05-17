import { z } from "zod";
import { hash, compare } from "bcryptjs"
import { TRPCError } from "@trpc/server";

import { PasswordValidation } from "~/entities/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateTokens } from "~/shared/auth";

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
});
