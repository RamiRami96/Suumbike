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
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";

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

  const LIKED_PROFILES = profileData?.profile?.likedProfiles;

  return (
    <Container sx={{ marginTop: 15 }}>
      {!LIKED_PROFILES || LIKED_PROFILES?.length === 0 ? (
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            padding: "50px 0",
            color: "primary.main",
          }}
        >
          Not liked users :(
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>name</TableCell>
                <TableCell>mail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {LIKED_PROFILES.map(
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
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
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
