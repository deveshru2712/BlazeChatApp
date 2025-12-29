"use client";
import React, { useEffect, useMemo } from "react";
import MessageBox from "./MessageBox";
import { Input } from "./ui/input";
import SkeletonMessageBox from "./skeletons/SkeletonMessageBox";
import { useRouter } from "next/navigation";
import searchStore from "@/store/search.store";
import { getLatestMessage } from "@/lib/getLatestMessage";
import messageStore from "@/store/message.store";
import authStore from "@/store/auth.store";

export default function Sidebar() {
  const router = useRouter();
  const { user } = authStore();

  const { recentConversation, fetchRecentConversation } = messageStore();

  // useEffect(() => {
  //   if (!user) return;

  //   const loadConversations = async () => {
  //     await fetchRecentConversation(user.id);
  //     console.log("Recent Conversations:", recentConversation);
  //   };

  //   loadConversations();
  // }, [user?.id]);

  const {
    searchUsername,
    userList,
    isSearching,
    hasSearched,
    setSearchUsername,
    setReceiverUser,
  } = searchStore();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const processedUserList = useMemo(() => {
    if (!userList || userList.length === 0) return [];

    return userList.map((user) => {
      const result = getLatestMessage(user.conversations);
      return {
        ...user,
        latestMessage: result.latestMessage,
        time: result.time,
      };
    });
  }, [userList]);

  return (
    <div className="w-1/3 mt-5 h-screen border-r px-2 py-1 hidden md:flex md:flex-col gap-1">
      <form className="w-full flex items-center" onSubmit={onSubmitHandler}>
        <Input
          className="font-semibold"
          placeholder="Type your friend name here .."
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
      </form>

      {isSearching ? (
        <SkeletonMessageBox />
      ) : processedUserList.length > 0 ? (
        processedUserList.map((user) => {
          return (
            <MessageBox
              onClick={() => {
                setReceiverUser(user);
                router.push(`/message/${user.id}`);
              }}
              id={user.id}
              key={`${user.id}-${user.time}`}
              profileImg={user.profilePicture}
              username={user.username}
              latestMessage={user.latestMessage}
              time={user.time}
            />
          );
        })
      ) : (
        <div className="font-semibold text-center my-10">
          {hasSearched
            ? `No user found for ${searchUsername}`
            : " Start messaging your friend..."}
        </div>
      )}
    </div>
  );
}
