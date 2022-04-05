import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Category: {
    totalCoffeeShops: async (parent: any, _: any, { prisma }: Context): Promise<number> => {
      try {
        const countedCoffeeShop: number = await prisma.coffeeShop.count({ where: { categories: { some: { name: parent.name } } } });
        return countedCoffeeShop;
      } catch (error) {
        console.log("totalCoffeeShops error");
        return 0;
      }
    },
  },
};

export default resolvers;
