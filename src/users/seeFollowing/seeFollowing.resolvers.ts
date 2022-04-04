import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SeeFollowingArgs {
  username: string;
  cursor?: number;
}

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_: any, { username, cursor }: SeeFollowingArgs, { prisma }: Context) => {
      try {
        const foundFollowing: User[] = await prisma.user.findMany({
          where: { following: { some: { username } } },
          ...(cursor && { cursor: { id: cursor } }),
          skip: 1,
          take: 10,
        });
        const countedFollowing: number = await prisma.user.count({
          where: { following: { some: { username } } },
        });
        return { ok: true, message: "팔로잉 보기에 성공하였습니다.", users: foundFollowing, totalPages: Math.ceil(countedFollowing / 10), totalFollow: countedFollowing };
      } catch (error) {
        console.log("seeFollowers error");
        return { ok: false, message: "팔로잉 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
