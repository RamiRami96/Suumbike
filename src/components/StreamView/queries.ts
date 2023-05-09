import { gql } from "@apollo/client";

export const GET_PROFILES_AND_PROFILE = gql`
  query getProfilesAndProfile($email: String!) {
    profiles(email: $email) {
      id
      name
      avatar
      email
    }
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
