import "dotenv/config";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express, { Express } from "express";
import prisma from "./prisma";
import { handleGetLoggedInUser } from "./users/user.utils";
import { User } from ".prisma/client";
import { mergedResolvers, mergedTypeDefs } from "./schema";

const startServer = async () => {
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    introspection: true,
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    context: async ({ req }) => {
      const loggedInUser: User | null = await handleGetLoggedInUser(req.headers.token);
      return { prisma, loggedInUser };
    },
  });
  await apolloServer.start();

  const app: Express = express();
  app.use(graphqlUploadExpress());
  app.use("/uploads", express.static("uploads"));
  apolloServer.applyMiddleware({ app });
  await new Promise<void>((fn) => app.listen({ port: 4000 }, fn));
  console.log(`🚀 http://localhost:4000${apolloServer.graphqlPath}`);
};

startServer();
