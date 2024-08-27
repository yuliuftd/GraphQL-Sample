import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./_db.js";
// types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((x) => x.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((x) => x.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((x) => x.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((x) => x.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((x) => x.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((x) => x.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((x) => x.id === parent.game_id);
    },
  },
  Mutation: {
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000),
      };
      db.games.push(game);
      return game;
    },
    deleteGame(_, args) {
      db.games = db.games.filter((x) => x.id !== args.id);
      return db.games;
    },
    updateGame(_, args) {
      db.games = db.games.map((x) => {
        if (x.id === args.id) {
          return { ...x, ...args.edits };
        }
        return x;
      });
      return db.games.find((x) => x.id === args.id);
    },
  },
};

// server setup
const server = new ApolloServer({
  // typeDefs -- definitions of types of data
  // resolvers
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port", 4000);
