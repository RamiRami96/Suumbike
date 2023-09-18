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
  users: { [key: string]: any };
  stream: MediaStream | null;
  receivingCall: boolean;
  caller: string;
  callerSignal: string | SignalData | null;
  connectionAccepted: boolean;
  isLoading: boolean;
}

export const initialState: StreamPageState = {
  candidate: null,
  visitedUsers: [],
  timeLeft: 12000,
  usersData: null,
  socketID: "",
  users: {},
  stream: null,
  receivingCall: false,
  caller: "",
  callerSignal: null,
  connectionAccepted: false,
  isLoading: false,
};
