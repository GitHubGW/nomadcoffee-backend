import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import prisma from "./prisma";

const server: ApolloServer = new ApolloServer({
  schema,
  context: async () => {
    return { prisma };
  },
});

server.listen(4000, () => {
  console.log(`🚀 http://localhost:${4000}`);
});
