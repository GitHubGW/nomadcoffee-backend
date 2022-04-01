import bcrypt from "bcrypt";
import { User } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";
import { privateResolvers } from "../user.utils";
import { ReadStream, WriteStream, createWriteStream } from "fs";

interface EditProfileArgs {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  location?: string;
  avatarUrl?: any;
  githubUsername?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    editProfile: privateResolvers(
      async (_: any, { username, email, password, name, location, avatarUrl, githubUsername }: EditProfileArgs, { prisma, loggedInUser }: Context): Promise<CommonResult> => {
        try {
          let hashedPassword: string | undefined = undefined;
          let uploadedAvatarUrl: string | undefined = undefined;

          if (process.env.NODE_ENV === "development" && avatarUrl) {
            const {
              file: { filename, createReadStream },
            } = avatarUrl;
            const newFilename = `${Date.now()}-${filename}`;
            const readStream: ReadStream = createReadStream();
            const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
            readStream.pipe(writeStream);
            uploadedAvatarUrl = `http://localhost:4000/uploads/${newFilename}`;
          } else if (process.env.NODE_ENV !== "development") {
          }

          const foundUser: User | null = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
          if (foundUser) {
            return { ok: false, message: "이미 존재하는 계정입니다." };
          }

          if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
          }

          const updatedUser: User = await prisma.user.update({
            where: { id: loggedInUser?.id },
            data: { username, email, password: hashedPassword, name, location, avatarUrl: uploadedAvatarUrl, githubUsername },
          });
          return { ok: true, message: "프로필 수정에 성공하였습니다.", id: updatedUser.id };
        } catch (error) {
          console.log("editProfile error");
          return { ok: false, message: "프로필 수정에 실패하였습니다." };
        }
      }
    ),
  },
};

export default resolvers;
