import { CoffeeShop } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SearchCoffeeShopsArgs {
  name?: string;
  categoryName?: string;
}

const resolvers: Resolvers = {
  Query: {
    searchCoffeeShops: async (_: any, { name, categoryName }: SearchCoffeeShopsArgs, { prisma }: Context): Promise<CoffeeShop[]> => {
      try {
        if (name === "" && categoryName === "") {
          throw new Error();
        }

        let foundCoffeeShops: CoffeeShop[] = [];
        if (name) {
          foundCoffeeShops = await prisma.coffeeShop.findMany({ where: { name: { contains: name } } });
        } else if (categoryName) {
          foundCoffeeShops = await prisma.coffeeShop.findMany({ where: { categories: { some: { name: categoryName } } } });
        }
        return foundCoffeeShops;
      } catch (error) {
        console.log("searchCoffeeShops error");
        return [];
      }
    },
  },
};

export default resolvers;
