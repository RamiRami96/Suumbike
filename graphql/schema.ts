export const typeDefs = `#graphql
  type Profile {
    id: ID!
    name: String!
    avatar: String!
    email: String!
    likedProfiles: [Profile]
  }

  type Query {
    profiles: [Profile]
    profile(email: String!): Profile
  }

  type Mutation {
    likeProfile(profileId:ID!, likedProfileId: ID!): Profile
  }
`;
