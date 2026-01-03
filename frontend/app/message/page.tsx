import { MessageCircle, Search, Users } from "lucide-react";
import MobileSearchBar from "@/components/message/MobileSearchBar ";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex md:flex-row flex-col flex-1 w-full border-t border-slate-200/60 overflow-hidden">
        <MobileSearchBar />
        <Sidebar />
        <div className="flex-1 h-full overflow-hidden px-6 py-8">
          <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MessageCircle className="w-12 h-12 " />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <Search className="w-4 h-4 " />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 " />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Start a Conversation</h2>
              <p className="leading-relaxed">
                Search for a friends name in the search box above to begin your chat journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
