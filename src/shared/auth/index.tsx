import { sign } from "jsonwebtoken";

import { env } from "~/env.mjs";

export const refreshCookieName = 'movie-app-refresh-token';

export const generateTokens = (mail: string) => {
  const tokenMaxAge = 60 * 60 * 1000;
  const currentDate = new Date();
  const cookieExpireDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

  const token = sign(
    { mail, type: 'desktop' },
    env.JWT_SECRET,
    {
      expiresIn: tokenMaxAge,
    }
  );
  const refreshToken = sign({ mail, type: 'desktop' }, env.JWT_SECRET, {
    expiresIn: "1m",
  })
  const refreshCookie = `${refreshCookieName}=${refreshToken}; Expires=${cookieExpireDate.toString()}; Path=/api/trpc; HttpOnly; Secure; SameSite=Strict;`;
  return { token, refreshToken, tokenMaxAge, refreshCookie, cookieExpireDate }
};
