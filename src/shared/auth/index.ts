import { sign } from "jsonwebtoken";

import { env } from "~/env.mjs";

export type TGoogleCredentials = {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}

export const refreshCookieName = 'movie-app-refresh-token';

export const deletedCookie = `${refreshCookieName}=; Path=/; expires=${new Date(0).toString()}; HttpOnly; Secure; SameSite=Strict;`;

export const generateTokens = ({
  mail,
  customToken,
  expireDate
}: { mail: string; customToken?: string; expireDate?: Date }) => {
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
    expiresIn: "30d",
  })
  const refreshCookie = `${refreshCookieName}=${customToken || refreshToken}; Expires=${(expireDate || cookieExpireDate).toString()}; Path=/; HttpOnly; Secure; SameSite=Strict;`;
  return { token, refreshToken, tokenMaxAge, refreshCookie, cookieExpireDate }
};
