import { Category } from ".prisma/client";
import { CommonResult } from "../../common/common.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeCategoriesArgs {
  cursorId?: number;
}

interface SeeCategoriesResult extends CommonResult {
  categories?: Category[];
}

const resolvers: Resolvers = {
  Query: {
    seeCategories: async (_: any, { cursorId }: SeeCategoriesArgs, { prisma }: Context): Promise<SeeCategoriesResult> => {
      try {
        const foundCategories: Category[] = await prisma.category.findMany({
          ...(cursorId && { cursor: { id: cursorId } }),
          skip: cursorId ? 1 : 0,
          take: 3,
        });
        return { ok: true, message: "전체 카테고리 보기에 성공하였습니다.", categories: foundCategories };
      } catch (error) {
        console.log("seeCoffeeShop error");
        return { ok: false, message: "전체 카테고리 보기에 실패하였습니다.", categories: [] };
      }
    },
  },
};

export default resolvers;
