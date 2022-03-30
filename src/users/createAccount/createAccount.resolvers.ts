import { User } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";
import bcrypt from "bcrypt";

interface CreateAccountArgs {
  email: string;
  username: string;
  name?: string;
  password: string;
}

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (_: any, { email, username, name, password }: CreateAccountArgs, { prisma }: Context): Promise<CommonResult> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
        if (foundUser) {
          return { ok: false, message: "이미 존재하는 이메일 또는 유저명입니다." };
        }
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const createdUser: User = await prisma.user.create({ data: { email, username, name, password: hashedPassword } });
        return { ok: false, message: "계정 생성에 성공하였습니다.", id: createdUser.id };
      } catch (error) {
        console.log("createAccount error");
        return { ok: false, message: "계정 생성에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
