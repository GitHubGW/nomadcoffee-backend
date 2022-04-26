import { CoffeeShop } from ".prisma/client";
import { Context, Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeCoffeeShops: async (_: any, { offset }: any, { prisma }: Context) => {
      try {
        const foundCoffeeShops: CoffeeShop[] = await prisma.coffeeShop.findMany({
          take: 6,
          skip: offset,
          include: { categories: true, user: true, coffeeShopPhotos: true },
          orderBy: { createdAt: "desc" },
        });
        return foundCoffeeShops;
      } catch (error) {
        console.log("seeCoffeeShops error");
        return [];
      }
    },
  },
};

export default resolvers;
