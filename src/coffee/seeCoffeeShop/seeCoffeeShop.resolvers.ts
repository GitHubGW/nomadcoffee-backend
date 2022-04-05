import { CoffeeShop } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeCoffeeShopArgs {
  name: string;
}

interface SeeCoffeeShopResult extends CommonResult {
  coffeeShop?: CoffeeShop;
}

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShop: async (_: any, { name }: SeeCoffeeShopArgs, { prisma }: Context): Promise<SeeCoffeeShopResult> => {
      try {
        const foundCoffeeShop: CoffeeShop | null = await prisma.coffeeShop.findUnique({ where: { name } });
        if (foundCoffeeShop === null) {
          return { ok: false, message: "존재하지 않는 커피숍입니다." };
        }
        return { ok: true, message: "커피숍 보기에 성공하였습니다.", coffeeShop: foundCoffeeShop };
      } catch (error) {
        console.log("seeCoffeeShop error");
        return { ok: false, message: "커피숍 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
