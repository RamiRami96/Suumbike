"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Profile } from "../types/profile";
import { deleteLikedProfile } from "./actions/deleteLikedProfile";
import { getLikedProfiles } from "./actions/getLikedProfiles";
import deleteIcon from '../../../public/delete.svg'


export default function Page() {
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedProfilesAmount,setLikedProfilesAmount] = useState(0);
  const[isListBottom, setIsListBottom]=useState(false);
  const[isNotProfiles, setIsNotProfiles]=useState(false);
  const lastElement = useRef(null);

  const fetchLikedProfiles = async () => {
    try {
      const data = await getLikedProfiles(likedProfilesAmount)  

      if(data) {
        setLikedProfilesAmount(prev => prev +=data.length)
        return data;
      }
  
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isListBottom) {

          const newData = await fetchLikedProfiles();

          if(!newData){ 
            setIsListBottom(true)
            setIsLoading(false)
            observer.disconnect()
            return;
          };

          setLikedProfiles((prevProfiles) => [...prevProfiles, ...newData]); 
        }
      },
      {root: null,
        rootMargin: "0px", threshold: 1 }
    );

    if (lastElement.current) {
      observer.observe(lastElement.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading, likedProfiles]);

  useEffect(() => {

    fetchLikedProfiles().then((data) => {      
      if(data && data.length === 0){
        setIsNotProfiles(true)
      }

      if (data && data.length !== 0) {
        setLikedProfiles((prevData)=>[...prevData, ...data]);
        setIsNotProfiles(false)
      }
    });
  }, []);

  const deleteContact=async (id:string)=>{
    try {
        const deletedProfile = await deleteLikedProfile(id); 
        if (!deletedProfile) return;    
        setLikedProfiles((prev) => prev.filter((item) => item.id !== deletedProfile.id));
        if(likedProfiles.length === 1) setIsNotProfiles(true)
      } catch (error) {
        console.error(error);
      }
  }
  
  if(isNotProfiles) {
    return (
      <div className="flex justify-center text-center mt-24">
          <h2>Not liked users :(</h2>
      </div>)
  }
 

  return (
    <div className="flex justify-center mt-24">
    <div className="min-w-[320px]  w-full sm:w-5/6 border border-pink-400 bg-white rounded-lg overflow-hidden">
      <div className="flex justify-between bg-pink-400 text-white">
        <h4 className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left font-medium">
          Avatar
        </h4>
        <h4 className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left font-medium">
          Name
        </h4>
        <h4 className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left font-medium">
          Email
        </h4>
        <h4 className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left font-medium">
          Action
        </h4>
      </div>
      <div className="h-[61vh] overflow-y-auto">
        {likedProfiles?.length === 0 ? (
          Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center py-3 animate-pulse">
              <div className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
              <div className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 h-10 flex align-center"><div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div></div>
              <div className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 h-10 flex align-center"><div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div></div>
              <div className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 h-10 flex align-center"><div className="w-14 sm:w-24 md:w-48 h-10 bg-gray-300"></div></div>
            </div>
          ))
        ) : (
          <>
            {likedProfiles.map(({ id, avatar, name, email }, i, array) => (
              <div
                className="flex justify-between items-center py-3 border-b border-pink-400"
                key={id}
                ref={array.length - 1 === i ? lastElement : null}
              >
                <div className="flex items-center justify-start w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6">
                  <Image
                    className="h-10 w-10 rounded-full "
                    src={avatar}
                    alt="Avatar"
                    width={50}
                    height={50}
                  />
                </div>
                <p className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left text-sm text-pink-400">
                  {name}
                </p>
                <p className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left text-sm text-pink-400">
                  {email}
                </p>
                <button className="w-[90px] sm:w-[140px] md:w-[200px] px-4 py-3 sm:px-6 text-left" onClick={() => deleteContact(id)} >
                  <Image src={deleteIcon} alt="delete" width={16} height={16}/>
                </button>
              </div>
            ))}
            {isLoading && likedProfiles.length >=10 && <p>Loading...</p>}
          </>
        )}
      </div>
    </div>
  </div>
  );
}
