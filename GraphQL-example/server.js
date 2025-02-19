const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { loadFilesSync } = require("@graphql-tools/load-files");
const typesArray = loadFilesSync("**/*", { extensions: ["graphql"] });
const resolvesArray = loadFilesSync("**/*", { extensions: ["resolver.js"] });
const PORT = 3000;

async function startApolloServer() {
  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolvesArray,
  });
  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();