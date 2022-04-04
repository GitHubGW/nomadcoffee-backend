import { User } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SearchUsersArgs {
  username: string;
}

interface SearchUsersResult extends CommonResult {
  users?: User[];
}

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_: any, { username }: SearchUsersArgs, { prisma }: Context): Promise<SearchUsersResult> => {
      try {
        const foundUsers: User[] = await prisma.user.findMany({
          where: { username: { contains: username.toLowerCase() } },
        });
        if (foundUsers.length === 0) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }
        return { ok: true, message: "유저 검색에 성공하였습니다.", users: foundUsers };
      } catch (error) {
        console.log("searchUsers error");
        return { ok: false, message: "유저 검색에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
