"use client";
import { getLatestMessage } from "@/lib/getLatestMessage";
import searchStore from "@/store/search.store";
import { Search } from "lucide-react";
import React, { useMemo } from "react";
import SkeletonMessageBox from "./skeletons/SkeletonMessageBox";
import MessageBox from "./MessageBox";
import { useRouter } from "next/navigation";

const MobileSearchBar = () => {
  const router = useRouter();
  const {
    searchUsername,
    userList,
    isSearching,
    hasSearched,
    setSearchUsername,
    setReceiverUser,
  } = searchStore();

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="w-full flex md:hidden mt-2 px-2 py-1 mx-auto h-fit border-b relative">
      {/* Search Input */}
      <div className="border w-full flex items-center py-1 px-3 rounded-md z-20">
        <Search size={18} />
        <form onSubmit={onSubmitHandler} className="w-full">
          <input
            type="text"
            placeholder="type username here..."
            className="w-full ml-2 outline-none"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </form>
      </div>

      {/* Search Results - positioned absolutely */}
      {(isSearching || hasSearched) && (
        <div className="absolute top-full left-0 w-full shadow-lg rounded-md max-h-[70vh] overflow-y-auto mt-2 p-1 z-30">
          {isSearching ? (
            <SkeletonMessageBox />
          ) : processedUserList.length > 0 ? (
            processedUserList.map((user) => (
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
            ))
          ) : (
            <div className="font-semibold text-center my-6">
              {hasSearched
                ? `No user found for ${searchUsername}`
                : "Start messaging your friend..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
