"use client";

import { useEffect, useReducer, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Spinner } from "../../components/spinner";
import FrontCamera from "./components/frontCamera";

import { getUsers } from "./actions/getUsers";

import { initialState, StreamPageState } from "./state/initialState";
import { reducer } from "./state/reducer";
import { ActionTypes } from "./state/actions";

import { useUserData } from "./hooks/useUserData";

import { getCandidate } from "./helpers/getCandidate";
import { onSmash } from "./helpers/onSmash";
import { onPass } from "./helpers/onPass";
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
    isSmashed,
    isExited,
    isPassed,
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

    let intervalId: NodeJS.Timer;

    if (!isLoading && candidate && !not_users && connectionAccepted) {
      intervalId = setInterval(
        () =>
          dispatch({
            type: ActionTypes.SET_TIME_DECREASE,
            payload: null,
          }),
        1000
      );
    }

    return () => clearInterval(intervalId);
  }, [isLoading, candidate, not_users, connectionAccepted]);

  useEffect(() => {
    if (tgNickname && !usersData) {
      getUsers(tgNickname).then((data) => {
        if (data) {
          dispatch({ type: ActionTypes.SET_USERS_DATA, payload: data });
        }
      });
    }
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

  useEffect(() => {
    if (socket?.current) {
      socket.current.on(
        "checkControls",
        (data: {
          isSmashed: boolean;
          isExited: boolean;
          isPassed: boolean;
        }) => {
          dispatch({
            type: ActionTypes.SET_IS_SMASHED,
            payload: data.isSmashed,
          });
          dispatch({
            type: ActionTypes.SET_IS_EXITED,
            payload: data.isExited,
          });
          dispatch({
            type: ActionTypes.SET_IS_PASSED,
            payload: data.isPassed,
          });
        }
      );
    }
  }, [socket?.current]);

  useEffect(() => {
    if (isSmashed || isExited) {
      onSmash(
        getCandidate,
        dispatch,
        visitedUsers,
        socket,
        usersData?.users,
        usersData?.user,
        stream
      );
    }

    if (isPassed) {
      onPass(router, dispatch, socket, user, candidate, stream);
    }
  }, [isSmashed, isExited, isPassed]);

  const minute: number = Math.floor(timeLeft / 60);
  const second: number = timeLeft % 60;

  return (
      <section className="relative h-[90vh] flex justify-center mt-50">
        <time
          aria-live="assertive"
          className="absolute z-10 top-12 left-3 text-2xl font-bold text-pink-400 md:hidden w-20 h-8 "
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
              className="px-4 py-2 bg-pink-400 text-white rounded-l-md w-24 flex justify-center items-center"
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
              disabled={
                isLoading || !candidate || not_users || !connectionAccepted
              }
            >
              <Image
                src={"/icons/close.svg"}
                width={20}
                height={20}
                alt="close"
              />
            </button>
            <button
              className="px-4 py-2 bg-white  border-2 border-t-pink-400 border-b-pink-400 w-24 flex justify-center items-center"
              onClick={() => returnToHomePage(router, socket, user?.id, stream)}
            >
              <Image
                src={"/icons/home.svg"}
                width={20}
                height={20}
                alt="home"
              />
            </button>
            <button
              className="px-4 py-2 bg-green-400  rounded-r-md w-24 flex justify-center items-center"
              onClick={() =>
                onPass(router, dispatch, socket, user, candidate, stream)
              }
              disabled={
                isLoading || !candidate || not_users || !connectionAccepted
              }
            >
              <Image
                src={"/icons/like.svg"}
                width={20}
                height={20}
                alt="like"
              />
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
