"use client";

import { useEffect, useReducer, useRef } from "react";

import { Spinner } from "../../components/spinner";
import FrontCamera from "./frontCamera";

import { getUsers } from "./actions/getUsers";

import { initialState, StreamPageState } from "./state/initialState";
import { reducer } from "./state/reducer";
import { ActionTypes } from "./state/actions";
import { getCandidate } from "./helpers/getCandidate";

import { useUserData } from "./hooks/useUserData";
import { onSmash } from "./helpers/onSmash";
import { onPass } from "./helpers/onPass";
import { useRouter } from "next/navigation";
import { returnToHomePage } from "./helpers/returnToHomePage";
import { callPeer } from "./helpers/callPeer";
import { acceptConnection } from "./helpers/acceptConnection";

export default function StreamPage() {
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    candidate,
    visitedUsers,
    timeLeft,
    usersData,
    socketID,
    ids,
    stream,
    receivingCall,
    callerData,
    connectionAccepted,
    isLoading,
  }: StreamPageState = state;

  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>();

  const { tgNickname, not_users, user } = useUserData(usersData);

  useEffect(() => {
    if (candidate) {
      dispatch({
        type: ActionTypes.SET_VISITED_USERS,
        payload: [...visitedUsers, candidate],
      });
    }
  }, [candidate]);

  useEffect(() => {
    if (!not_users) {
      getCandidate(
        dispatch,
        visitedUsers,
        socket,
        usersData?.users,
        usersData?.user
      );
    }
  }, [usersData?.users, usersData?.user]);

  useEffect(() => {
    if (timeLeft === 0) {
      onPass(router, dispatch, socket, user, candidate, stream);
    }

    if (isLoading || !candidate || not_users || !connectionAccepted) return;

    const intervalId = setInterval(
      () =>
        dispatch({
          type: ActionTypes.SET_TIME_DECREASE,
          payload: null,
        }),
      1000
    );

    return () => clearInterval(intervalId);
  }, [connectionAccepted]);

  useEffect(() => {
    if (!tgNickname || usersData) return;

    getUsers(tgNickname).then((data) => {
      if (data) {
        dispatch({ type: ActionTypes.SET_USERS_DATA, payload: data });
      }
    });
  }, [tgNickname, usersData]);

  useEffect(() => {
    Object.keys(ids).map((id) => {
      if (id === socketID) {
        return null;
      }

      callPeer(dispatch, id, socket, socketID, stream, partnerVideo);
    });
  }, [ids]);

  useEffect(() => {
    if (receivingCall) {
      acceptConnection(dispatch, socket, partnerVideo, callerData, stream);
    }
  }, [receivingCall]);

  const minute: number = Math.floor(timeLeft / 60);
  const second: number = timeLeft % 60;

  return (
    <section className="relative h-[90vh] flex justify-center mt-50">
      <time
        aria-live="assertive"
        className="absolute z-10 top-12 left-3 text-2xl font-bold text-pink-400 md:hidden w-8 "
      >
        {`${minute}:${second.toString().padStart(2, "0")}`}
      </time>
      <div className="absolute z-10 top-10 right-3 md:hidden">
        <FrontCamera />
      </div>
      <div className="absolute z-10 bg-white bottom-0 w-50 h-24 flex justify-center md:justify-between items-center w-11/12 md:w-5/6 shadow-inner rounded-tl-2xl rounded-tr-2xl pl-5 pr-5">
        <div className="hidden md:block w-[55px]">
          <time className="text-2xl font-bold text-pink-400">
            {`${minute}:${second.toString().padStart(2, "0")}`}
          </time>
        </div>
        <div className="inline-flex">
          <button
            className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24"
            onClick={() =>
              onSmash(
                getCandidate,
                dispatch,
                visitedUsers,
                socket,
                usersData?.users,
                usersData?.user,
                stream
              )
            }
            disabled={isLoading || !candidate || not_users}
          >
            Smash
          </button>
          <button
            className="px-4 py-2 bg-white text-pink-400 border-2 border-t-pink-400 border-b-pink-400 w-24"
            onClick={() => returnToHomePage(router, socket, user?.id, stream)}
          >
            Exit
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-r-md w-24"
            onClick={() =>
              onPass(router, dispatch, socket, user, candidate, stream)
            }
            disabled={isLoading || !candidate || not_users}
          >
            Pass
          </button>
        </div>
        <div className="hidden md:block">
          <FrontCamera />
        </div>
      </div>
      {candidate?.name && (
        <h4 className="absolute z-50 bottom-28 font-black text-pink-600 text-4xl">
          {candidate?.name}
        </h4>
      )}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        {!isLoading && candidate && connectionAccepted ? (
          <div className={connectionAccepted ? " " : "animate-pulse"}>
            {connectionAccepted && (
              <video
                className="fixed top-2 left-0 w-full h-full object-cover"
                ref={partnerVideo}
                autoPlay
                muted
              />
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </section>
  );
}
