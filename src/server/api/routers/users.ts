import { z } from "zod";
import { PasswordValidation } from "~/entities/user";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .mutation(({ input }) => {
      return {
        greeting: `Hello ${input.name}`,
      };
    }),
});
