import { PrismaClient, User } from ".prisma/client";

type Context = {
  prisma: PrismaClient;
  loggedInUser: User | null;
};

type Resolver = (parent: any, args: any, context: Context, info: any) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
