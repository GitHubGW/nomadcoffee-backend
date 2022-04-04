import { User } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";
import { privateResolvers } from "../user.utils";

interface ToggleFollowUserArgs {
  username: string;
}

const resolvers: Resolvers = {
  Mutation: {
    toggleFollowUser: privateResolvers(async (_: any, { username }: ToggleFollowUserArgs, { prisma, loggedInUser }: Context): Promise<CommonResult> => {
      try {
        const countedUser: number = await prisma.user.count({ where: { username } });
        if (countedUser === 0) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }
        if (username === loggedInUser?.username) {
          return { ok: false, message: "팔로우할 수 없는 유저입니다." };
        }

        const foundUser: User | null = await prisma.user.findFirst({ where: { id: loggedInUser?.id, following: { some: { username } } } });
        if (foundUser === null) {
          await prisma.user.update({
            where: { id: loggedInUser?.id },
            data: { following: { connect: { username } } },
          });
        } else {
          await prisma.user.update({
            where: { id: loggedInUser?.id },
            data: { following: { disconnect: { username } } },
          });
        }

        return { ok: true, message: "팔로우 또는 팔로우 취소에 성공하였습니다." };
      } catch (error) {
        console.log("toggleFollowUser error");
        return { ok: false, message: "팔로우 또는 팔로우 취소에 실패하였습니다." };
      }
    }),
  },
};

export default resolvers;
