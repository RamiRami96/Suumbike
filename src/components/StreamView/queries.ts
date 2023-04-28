import { gql } from "@apollo/client";

export const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      id
      name
      avatar
      email
    }
  }
`;

export const GET_PROFILE = gql`
  query getProfile($email: String!) {
    profile(email: $email) {
      id
      email
      likedProfiles {
        id
        name
        avatar
        email
      }
    }
  }
`;

export const LIKE_PROFILE_MUTATION = gql`
  mutation LikeProfile($profileId: ID!, $likedProfileId: ID!) {
    likeProfile(profileId: $profileId, likedProfileId: $likedProfileId) {
      likedProfiles {
        avatar
        name
        email
      }
    }
  }
`;
