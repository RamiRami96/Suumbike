import Room from "@/components/room/room";
import { prisma } from "@/lib/prisma";
import { getParticipant } from "@/services/room/getParticipant";

type Params = {
  room: string[];
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const [roomId, participantNick] = params.room;

  const participant = await getParticipant(participantNick);

  if (!participant) return <h1>Participant not found ...</h1>;

  return <Room roomId={roomId} participant={participant} />;
}
