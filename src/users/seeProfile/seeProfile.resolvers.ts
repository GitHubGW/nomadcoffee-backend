import { User } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeProfileArgs {
  username: string;
}

interface SeeProfileResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_: any, { username }: SeeProfileArgs, { prisma }: Context): Promise<SeeProfileResult> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { username }, include: { following: true, followers: true } });
        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }
        return { ok: true, message: "프로필 보기에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("seeProfile error");
        return { ok: false, message: "프로필 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
