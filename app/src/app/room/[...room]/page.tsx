import { MY_ROOM } from "@/modules/room/const/room.const";
import Room from "@/modules/room/components/room";

type Params = {
  room: string[];
};

type Props = {
  params: Params;
};

export default async function Page({ params }: Props) {
  const roomArray = Array.isArray(params.room) ? params.room : [];
  const [roomId, participantNick] = roomArray;
  const isUsersRoom = participantNick === MY_ROOM;

  return <Room roomId={roomId} isUsersRoom={isUsersRoom} />;
}
