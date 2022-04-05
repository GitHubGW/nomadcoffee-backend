import { CoffeeShop } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeCoffeeShopsArgs {
  page?: number;
}

interface SeeCoffeeShopsResult extends CommonResult {
  coffeeShops: CoffeeShop[];
}

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShops: async (_: any, { page = 1 }: SeeCoffeeShopsArgs, { prisma }: Context): Promise<SeeCoffeeShopsResult> => {
      try {
        const foundCoffeeShops: CoffeeShop[] = await prisma.coffeeShop.findMany({
          skip: (page - 1) * 10,
          take: 10,
        });
        return { ok: true, message: "전체 커피숍 보기에 성공하였습니다.", coffeeShops: foundCoffeeShops };
      } catch (error) {
        console.log("seeCoffeeShops error");
        return { ok: false, message: "전체 커피숍 보기에 실패하였습니다.", coffeeShops: [] };
      }
    },
  },
};

export default resolvers;
