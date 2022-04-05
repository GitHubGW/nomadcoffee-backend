import { CoffeeShop } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeCategoryArgs {
  name: string;
  page?: number;
}

interface SeeCategoryResult extends CommonResult {
  coffeeShops?: CoffeeShop[];
}

const resolvers: Resolvers = {
  Query: {
    seeCategory: async (_: any, { name, page = 1 }: SeeCategoryArgs, { prisma }: Context): Promise<SeeCategoryResult> => {
      try {
        const foundCoffeeShops: CoffeeShop[] = await prisma.coffeeShop.findMany({
          where: { categories: { some: { name: { contains: name } } } },
          skip: (page - 1) * 10,
          take: 10,
        });
        return { ok: true, message: "카테고리 커피숍 보기에 성공하였습니다.", coffeeShops: foundCoffeeShops };
      } catch (error) {
        console.log("seeCoffeeShop error");
        return { ok: false, message: "카테고리 커피숍 보기에 실패하였습니다.", coffeeShops: [] };
      }
    },
  },
};

export default resolvers;
