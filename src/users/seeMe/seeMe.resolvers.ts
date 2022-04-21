import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeMe: (_: any, __: any, { loggedInUser }: Context): User | null => {
      if (loggedInUser) {
        return loggedInUser;
      } else {
        return null;
      }
    },
  },
};

export default resolvers;
