import { Category, CoffeeShop, CoffeeShopPhoto } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";
import { privateResolvers } from "../../users/user.utils";
import { ReadStream, WriteStream, createWriteStream } from "fs";

interface CreateCoffeeShopArgs {
  name: string;
  latitude?: number;
  longitude?: number;
  file?: any;
  category?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    createCoffeeShop: privateResolvers(
      async (_: any, { name, latitude, longitude, file, category }: CreateCoffeeShopArgs, { prisma, loggedInUser }: Context): Promise<CommonResult> => {
        try {
          let uploadedCoffeeShopPhotoUrl: string | undefined = undefined;
          let foundCategory: Category | null | undefined = undefined;
          const countedCoffeeShop: number = await prisma.coffeeShop.count({ where: { name } });

          if (countedCoffeeShop !== 0) {
            return { ok: false, message: "이미 존재하는 커피숍 이름입니다." };
          }

          if (process.env.NODE_ENV === "development" && category) {
            foundCategory = await prisma.category.findUnique({ where: { name: category } });

            if (foundCategory === null) {
              foundCategory = await prisma.category.create({
                data: { name: category, slug: category.toLowerCase().replaceAll(" ", "-") },
              });
            }
          }

          const createdCoffeeShop: CoffeeShop = await prisma.coffeeShop.create({
            data: {
              name,
              latitude,
              longitude,
              user: { connect: { id: loggedInUser?.id } },
              categories: { connect: { id: foundCategory?.id } },
            },
          });

          if (process.env.NODE_ENV === "development" && file) {
            const {
              file: { filename, createReadStream },
            } = file;
            const newFilename: string = `${Date.now()}-${filename}`;
            const readStream: ReadStream = createReadStream();
            const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
            readStream.pipe(writeStream);
            uploadedCoffeeShopPhotoUrl = `http://localhost:4000/uploads/${newFilename}`;
            await prisma.coffeeShopPhoto.create({
              data: { url: uploadedCoffeeShopPhotoUrl, coffeeShop: { connect: { id: createdCoffeeShop.id } } },
            });
          }

          return { ok: true, message: "커피숍 생성에 성공하였습니다." };
        } catch (error) {
          console.log("createCoffeeShop error");
          return { ok: false, message: "커피숍 생성에 실패하였습니다." };
        }
      }
    ),
  },
};

export default resolvers;
