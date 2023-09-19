import { ActionTypes } from "./actions";
import { StreamPageState } from "./initialState";

export function reducer(
  state: StreamPageState,
  action: { type: ActionTypes; payload: any }
) {
  switch (action.type) {
    case ActionTypes.SET_CANDIDATE:
      return { ...state, candidate: action.payload };
    case ActionTypes.SET_VISITED_USERS:
      return { ...state, visitedUsers: action.payload };
    case ActionTypes.SET_TIME_LEFT:
      return { ...state, timeLeft: action.payload };
    case ActionTypes.SET_TIME_DECREASE:
      return { ...state, timeLeft: state.timeLeft - 1 };
    case ActionTypes.SET_USERS_DATA:
      return { ...state, usersData: action.payload };
    case ActionTypes.SET_SOCKET_ID:
      return { ...state, socketID: action.payload };
    case ActionTypes.SET_USERS:
      return { ...state, users: action.payload };
    case ActionTypes.SET_STREAM:
      return { ...state, stream: action.payload };
    case ActionTypes.SET_RECEIVING_CALL:
      return { ...state, receivingCall: action.payload };
    case ActionTypes.SET_CALLER:
      return { ...state, caller: action.payload };
    case ActionTypes.SET_CALLER_SIGNAL:
      return { ...state, callerSignal: action.payload };
    case ActionTypes.SET_CONNECTION_ACCEPTED:
      return { ...state, connectionAccepted: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}