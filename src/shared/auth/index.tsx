import { sign } from "jsonwebtoken";

import { env } from "~/env.mjs";

export const generateTokens = (mail: string) => {
  const tokenMaxAge = 60 * 60 * 1000;
  const cookieExpireDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  const token = sign(
    { mail, type: 'desktop' },
    env.JWT_SECRET,
    {
      expiresIn: tokenMaxAge,
    }
  );
  const refreshToken = sign({ mail, type: 'desktop' }, env.JWT_SECRET, {
    expiresIn: "1y",
  })
  const refreshCookie = `movie-app-refresh-token=${refreshToken}; Expires=${cookieExpireDate.toString()}; Path=/api/trpc/users.refresh; HttpOnly; Secure; SameSite=Strict;`;
  return { token, refreshToken, tokenMaxAge, refreshCookie }
}