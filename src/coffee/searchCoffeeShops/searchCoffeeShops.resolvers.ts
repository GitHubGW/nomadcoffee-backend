import { CoffeeShop } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SearchCoffeeShopsArgs {
  keyword: string;
}

const resolvers: Resolvers = {
  Query: {
    searchCoffeeShops: async (_: any, { keyword }: SearchCoffeeShopsArgs, { prisma }: Context): Promise<CoffeeShop[]> => {
      try {
        if (keyword === "") {
          throw new Error();
        }
        const foundCoffeeShops: CoffeeShop[] = await prisma.coffeeShop.findMany({
          where: { OR: [{ name: { contains: keyword } }, { categories: { some: { name: keyword } } }] },
          include: { user: true, categories: true, coffeeShopPhotos: true },
        });
        return foundCoffeeShops;
      } catch (error) {
        console.log("searchCoffeeShops error");
        return [];
      }
    },
  },
};

export default resolvers;
