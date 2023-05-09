export const typeDefs = `#graphql
  type Profile {
    id: ID! 
    name: String!
    avatar: String!
    email: String!
    likedProfiles: [LikedProfile]
  } 

  type LikedProfile {
    id:ID!                    
    avatar: String!          
    name: String!                
    email: String!               
    profile: String             
    profileId: String              
  }

  type Query {
    profile(email: String!): Profile!
    profiles(email:String!): [Profile]
  }

  type Mutation {
    likeProfile(profileId:ID!, likedProfileId: ID!): Profile!
  }
`;
