import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query getProfile($email: String!) {
    profile(email: $email) {
      likedProfiles {
        name
        avatar
      }
    }
  }
`;
