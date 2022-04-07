import "dotenv/config";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express, { Express } from "express";
import prisma from "./prisma";
import { handleGetLoggedInUser } from "./users/user.utils";
import { User } from ".prisma/client";
import { mergedResolvers, mergedTypeDefs } from "./schema";
import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";

const startServer = async () => {
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    context: async ({ req }) => {
      const loggedInUser: User | null = await handleGetLoggedInUser(req.headers.token);
      return { prisma, loggedInUser };
    },
    introspection: true,
    plugins: [ApolloServerPluginLandingPageDisabled()],
  });
  await apolloServer.start();

  const app: Express = express();
  app.use(graphqlUploadExpress());
  app.use("/uploads", express.static("uploads"));
  apolloServer.applyMiddleware({ app });
  await new Promise<void>((fn) => app.listen({ port: process.env.PORT }, fn));
  console.log(`🚀 http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
};

startServer();
