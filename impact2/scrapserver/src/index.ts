import { createServer } from 'node:http';

import { schema } from './schema';

const { ApolloServer, gql } = require('apollo-server');


const port = Number(process.env.API_PORT) || 4000

// const server = createServer({
//     // port,
//     schema
// })

// server.listen(port, () => {
//   console.info(`server fired up 🚀 on port ${port} or at http://localhost:${port}/graphql`)
// })

// console.log('Hey there! 👋');


const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};


const server = new ApolloServer({ typeDefs, resolvers, schema });

// The `listen` method launches a web server.
server.listen(port, () => {
    console.info(`server fired up 🚀 on port ${port} or at http://localhost:${port}/graphql`)
  })
