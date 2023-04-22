export const typeDefs = `#graphql
  type User {
    id: Int!
    username: String!
    birthDate: Date!
    avatar: String
  }

  type Query {
    Users: [User!]!
  }

  type Mutation {
    createUser(username: String!, birthDate: Date!, avatar: String): User!
    deleteUser(id: Int!): User!
  }
`;
