import { z } from "zod";
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken";

import { PasswordValidation } from "~/entities/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
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
        const maxAge = 60 * 1000;
        const token = sign(
          { mail: input.email, type: 'desktop' },
          env.JWT_SECRET,
          {
            expiresIn: maxAge,
          }
        );
        const refreshToken = sign({ mail: input.email, type: 'desktop' }, env.JWT_SECRET, {
          expiresIn: "1y",
        })
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
                expires: new Date(Date.now() + (maxAge * 60)).toISOString(),
              }
            }
          },
          include: {
            sessions: true,
          },
        });
        ctx.res.setHeader("set-cookie", `movie-app-refresh-token=${refreshToken}; Max-Age=${24 * 60 * 60 * 365}; Path=/api/trpc/users.refresh HttpOnly; Secure; SameSite=Strict;`)
        return { token, mail: user.mail, name: user.name }
      } catch (err) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'The user with this email has already been created' });
      }
    }),
});
