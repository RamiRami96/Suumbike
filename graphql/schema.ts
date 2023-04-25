export const typeDefs = `#graphql
  type Profile {
    name: String
    avatar: String
    email: String
  }

  type Query {
    profiles:[Profile]
  }

  type Mutation {
    addProfile(token:String!):Profile
  }
`;
