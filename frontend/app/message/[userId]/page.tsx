"use client";
import Message from "@/components/Message";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import searchStore from "@/store/search.store";

export default function Page() {
  const { receiverUser } = searchStore();
  if (!receiverUser) {
    return <div className="w-screen h-screen">No receiver user found.</div>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex flex-1 w-full border-t border-slate-200/60 overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full overflow-hidden px-1 py-8">
          <Message User={receiverUser} />
        </div>
      </div>
    </div>
  );
}
