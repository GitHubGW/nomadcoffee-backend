import { CoffeeShop } from ".prisma/client";
import { Context, Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeAllCoffeeShops: async (_: any, { page }: any, { prisma }: Context) => {
      try {
        const countedCoffeeShops = await prisma.coffeeShop.count();
        const foundCoffeeShops: CoffeeShop[] = await prisma.coffeeShop.findMany({
          skip: (page - 1) * 6,
          take: 6,
          include: { categories: true, user: true, coffeeShopPhotos: true },
          orderBy: { createdAt: "desc" },
        });
        return { ok: true, message: "전체 커피숍 보기에 성공하였습니다.", coffeeShops: foundCoffeeShops, totalCoffeeShops: countedCoffeeShops };
      } catch (error) {
        console.log("seeAllCoffeeShops error");
        return { ok: false, message: "전체 커피숍 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
