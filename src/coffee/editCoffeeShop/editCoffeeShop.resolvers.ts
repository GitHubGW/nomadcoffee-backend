import { Category, CoffeeShop, CoffeeShopPhoto } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";
import { privateResolvers } from "../../users/user.utils";
import { ReadStream, WriteStream, createWriteStream } from "fs";

interface EditCoffeeShopArgs {
  id: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  file: any;
  category: string;
}

type CoffeeShopWithPhotoAndCategory = (CoffeeShop & { coffeeShopPhotos: CoffeeShopPhoto[]; categories: Category[] }) | null;

const resolvers: Resolvers = {
  Mutation: {
    editCoffeeShop: privateResolvers(async (_: any, { id, name, latitude, longitude, file, category }: EditCoffeeShopArgs, { prisma }: Context): Promise<CommonResult> => {
      try {
        let uploadedCoffeeShopPhotoUrl: string | undefined = undefined;
        let createdCoffeeShopPhoto: CoffeeShopPhoto | undefined = undefined;
        let foundCategory: Category | null | undefined = undefined;

        const foundCoffeeShop: CoffeeShopWithPhotoAndCategory = await prisma.coffeeShop.findUnique({
          where: { id },
          include: { coffeeShopPhotos: true, categories: true },
        });
        if (foundCoffeeShop === null) {
          return { ok: false, message: "존재하지 않는 커피숍입니다." };
        }

        const countedCoffeeShop: number = await prisma.coffeeShop.count({ where: { name } });
        if (countedCoffeeShop !== 0) {
          return { ok: false, message: "이미 존재하는 커피숍 이름입니다." };
        }

        if (process.env.NODE_ENV === "development" && file) {
          const {
            file: { filename, createReadStream },
          } = file;
          const newFilename: string = `${Date.now()}-${filename}`;
          const readStream: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
          readStream.pipe(writeStream);
          uploadedCoffeeShopPhotoUrl = `http://localhost:4000/uploads/${newFilename}`;
          createdCoffeeShopPhoto = await prisma.coffeeShopPhoto.create({
            data: { url: uploadedCoffeeShopPhotoUrl, coffeeShop: { connect: { id } } },
          });
        }
        if (process.env.NODE_ENV === "development" && category) {
          foundCategory = await prisma.category.findUnique({ where: { name: category } });

          if (foundCategory === null) {
            foundCategory = await prisma.category.create({
              data: { name: category, slug: category.toLowerCase().replaceAll(" ", "-") },
            });
          }
        }

        await prisma.coffeeShop.update({
          where: { id },
          data: {
            name,
            latitude,
            longitude,
            ...(file && { coffeeShopPhotos: { connect: { id: createdCoffeeShopPhoto?.id } } }),
            ...(category && { categories: { connect: { id: foundCategory?.id } } }),
          },
        });
        return { ok: true, message: "커피숍 수정에 성공하였습니다." };
      } catch (error) {
        console.log("editCoffeeShop error");
        return { ok: false, message: "커피숍 수정에 실패하였습니다." };
      }
    }),
  },
};

export default resolvers;
