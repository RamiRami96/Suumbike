import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { Avatar } from "@mui/material";
import { GET_PROFILE } from "./queries";
import { SuccessContainer, SuccessText } from "./styles";

export default function Success() {
  const { data: session } = useSession();

  const { data } = useQuery(GET_PROFILE, {
    variables: { email: (session?.user as any)?.email },
    ssr: true,
  });

  const likedProfile = data?.profile?.likedProfiles?.at(-1);

  if (!likedProfile) {
    return null;
  }

  return (
    <SuccessContainer>
      <Avatar
        alt="contact"
        src={likedProfile.avatar}
        sx={{ width: 200, height: 200 }}
      />
      <SuccessText>
        {likedProfile.name} has been added to your contacts
      </SuccessText>
    </SuccessContainer>
  );
}
