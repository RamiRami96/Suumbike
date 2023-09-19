import { User } from "@/app/types/user";
import { SignalData } from "simple-peer";

export interface StreamPageState {
  candidate: User | null;
  visitedUsers: User[];
  timeLeft: number;
  usersData: {
    user: User;
    users: User[];
  } | null;
  socketID: string;
  ids: { [key: string]: string };
  stream: MediaStream | null;
  receivingCall: boolean;
  callerData: { id: string; signal: string | SignalData } | null;
  connectionAccepted: boolean;
  isLoading: boolean;
}

export const initialState: StreamPageState = {
  candidate: null,
  visitedUsers: [],
  timeLeft: 12000,
  usersData: null,
  socketID: "",
  ids: {},
  stream: null,
  receivingCall: false,
  callerData: null,
  connectionAccepted: false,
  isLoading: false,
};
