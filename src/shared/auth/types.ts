import type { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type TContext = {
  prisma: PrismaClient;
  user: User | null;
  req: NextApiRequest;
  res: NextApiResponse;
}

export type TDecodedToken = {
  mail: string;
  type: string;
};

export type TGenerateToken = {
  decodedToken: TDecodedToken;
  incomingToken: string;
}