import { User } from ".prisma/client";
import { SeeFollowResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowersArgs {
  username: string;
  page?: number;
}

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_: any, { username, page }: SeeFollowersArgs, { prisma }: Context): Promise<SeeFollowResult> => {
      try {
        const foundFollowers: User[] = await prisma.user.findMany({
          where: { followers: { some: { username } } },
          ...(page && { skip: (page - 1) * 10 }),
          take: 10,
        });
        const countedFollowers: number = await prisma.user.count({
          where: { followers: { some: { username } } },
        });
        return { ok: true, message: "팔로워 보기에 성공하였습니다.", users: foundFollowers, totalPages: Math.ceil(countedFollowers / 10), totalFollow: countedFollowers };
      } catch (error) {
        console.log("seeFollowers error");
        return { ok: false, message: "팔로워 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
