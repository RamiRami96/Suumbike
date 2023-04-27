import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";

type User = {
  [key: number]: any;
  id: string;
  name: string;
  email: string;
  image: string;
};

const GET_PROFILE_ID = gql`
  query getProfileID($email: String!) {
    profile(email: $email) {
      likedProfiles {
        id
        name
        avatar
        email
      }
    }
  }
`;

export default function Contacts() {
  const { data: session } = useSession();
  const { data: profileData } = useQuery(GET_PROFILE_ID, {
    variables: { email: (session?.user as User)?.email },
  });

  const likedProfiles = profileData?.profile?.likedProfiles;

  return (
    <Container>
      <TableContainer component={Paper} sx={{ marginTop: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">mail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {likedProfiles &&
              likedProfiles.map(
                ({
                  avatar,
                  name,
                  email,
                }: {
                  avatar: string;
                  name: string;
                  email: string;
                }) => (
                  <TableRow
                    key={name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {avatar}
                    </TableCell>
                    <TableCell align="right">{name}</TableCell>
                    <TableCell align="right">{email}</TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
