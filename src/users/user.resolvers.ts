import { User } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    isMe: (parent: User, args: any, { loggedInUser }: Context): boolean => {
      if (parent.id === loggedInUser?.id) {
        return true;
      }
      return false;
    },
    isFollowing: async (parent: User, args: any, { prisma, loggedInUser }: Context): Promise<boolean> => {
      const foundUsers: User[] = await prisma.user.findFirst({ where: { id: loggedInUser?.id } }).following({ where: { id: parent.id } });
      if (foundUsers.length !== 0) {
        return true;
      }
      return false;
    },
    totalFollowing: async (parent: User, args: any, { prisma }: Context): Promise<number> => {
      const countedFollowing: number = await prisma.user.count({
        where: { followers: { some: { id: parent.id } } },
      });
      return countedFollowing;
    },
    totalFollowers: async (parent: User, args: any, { prisma }: Context): Promise<number> => {
      const countedFollowers: number = await prisma.user.count({
        where: { following: { some: { id: parent.id } } },
      });
      return countedFollowers;
    },
  },
};

export default resolvers;
