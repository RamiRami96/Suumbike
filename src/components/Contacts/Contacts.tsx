import { gql, useQuery } from "@apollo/client";
import React from "react";

const GET_PROFILES_QUERY = gql`
  query {
    profiles {
      name
      avatar
      email
    }
  }
`;

export default function Contacts() {
  const { loading, error, data } = useQuery(GET_PROFILES_QUERY);

  return <div>Contacts</div>;
}
