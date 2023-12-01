import Room from "@/components/room/room";

type Params = {
  room: string[];
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const [roomId, participantNick] = params.room;
  const isUsersRoom = participantNick === "myRoom";

  return <Room roomId={roomId} isUsersRoom={isUsersRoom} />;
}
