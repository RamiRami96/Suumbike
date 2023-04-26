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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

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
      id
      name
      avatar
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

export default function Contacts() {
  const { data: session } = useSession();
  const { data: profileData } = useQuery(GET_PROFILE_ID, {
    variables: { email: (session?.user as User)?.email },
  });

  console.log(profileData, "profileData");

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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
