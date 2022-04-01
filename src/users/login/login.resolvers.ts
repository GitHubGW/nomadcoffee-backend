import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginArgs {
  username: string;
  password: string;
}

interface LoginResult {
  ok: boolean;
  message: string;
  token?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    login: async (_: any, { username, password }: LoginArgs, { prisma }: Context): Promise<LoginResult> => {
      try {
        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });
        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 게정입니다." };
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(password, foundUser.password);
        if (isPasswordCorrect === false) {
          return { ok: false, message: "잘못된 비밀번호입니다." };
        }

        const token: string = await jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "14d" });
        return { ok: true, message: "로그인에 성공하였습니다.", token };
      } catch (error) {
        console.log("login error");
        return { ok: false, message: "로그인에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
