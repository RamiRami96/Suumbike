import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";

import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { GET_PROFILE } from "./queries";

type User = {
  [key: number]: any;
  id: string;
  name: string;
  email: string;
  image: string;
};

export default function Contacts() {
  const { data: session } = useSession();
  const { data: profileData } = useQuery(GET_PROFILE, {
    variables: { email: (session?.user as User)?.email },
  });

  const likedProfiles = profileData?.profile?.likedProfiles;

  return (
    <Container>
      {!likedProfiles || likedProfiles?.length === 0 ? (
        <h2 style={{ textAlign: "center", padding: "50px 0" }}>
          Not liked users :(
        </h2>
      ) : (
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
              {likedProfiles.map(
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
                      <Avatar alt={name} src={avatar} />
                    </TableCell>
                    <TableCell align="right">{name}</TableCell>
                    <TableCell align="right">{email}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
