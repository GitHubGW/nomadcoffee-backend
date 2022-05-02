import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { User } from ".prisma/client";
import { Context, Resolver } from "../types";

export const handleGetLoggedInUser = async (token?: string | string[]): Promise<User | null> => {
  try {
    if (token == undefined) {
      throw new Error();
    }

    const payload: any = await jwt.verify(token.toString(), process.env.JWT_SECRET_KEY as string);
    if (!payload) {
      throw new Error();
    }

    const foundUser: User | null = await prisma.user.findUnique({ where: { id: payload.id } });
    return foundUser;
  } catch (error) {
    console.log("로그인이 필요합니다.");
    return null;
  }
};

export const privateResolvers = (resolver: Resolver): Resolver => {
  return (parent: any, args: any, context: Context, info: any) => {
    if (context.loggedInUser === null) {
      return { ok: false, message: "로그인이 필요합니다." };
    }
    return resolver(parent, args, context, info);
  };
};
