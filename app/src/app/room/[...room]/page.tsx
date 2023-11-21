import Room from "@/components/room/room";
import { getParticipant } from "@/services/room/getParticipant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/user";

type Params = {
  room: string[];
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const [roomId, participantNick] = params.room;

  const participant = await getParticipant(participantNick);

  const isUsersRoom = participantNick === "myRoom";

  const user: User | null = await getServerSession(authOptions);

  return (
    <Room
      roomId={roomId}
      user={user ?? null}
      participant={participant ?? null}
      isUsersRoom={isUsersRoom}
    />
  );
}
