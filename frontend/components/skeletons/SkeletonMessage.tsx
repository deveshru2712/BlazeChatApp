import React from "react";
import MessageNav from "../message/MessageNav";

export default function SkeletonMessage() {
  const dummyUser: User = {
    id: "1",
    email: "example.com",
    username: "user",
    conversations: [],
  };
  return (
    <div className="h-full flex flex-col mx-6 py-4">
      <div className="flex-1 flex-col flex gap-1"></div>
      <div className="w-full">
        <MessageNav user={dummyUser} />
      </div>
    </div>
  );
}
