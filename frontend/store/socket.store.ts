import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import authStore from "./auth.store";
import { toast } from "sonner";

type SocketStore = {
  socket: Socket | null;
  isOnline: boolean;
  isProcessing: boolean;

  setSocket: () => void;
  disconnect: () => void;
};

const socketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isOnline: false,
  isProcessing: false,

  setSocket: () => {
    const { user } = authStore.getState();
    const existingSocket = get().socket;

    if (!user) {
      console.warn("No user, socket not connected");
      return;
    }

    if (existingSocket) {
      existingSocket.disconnect();
    }

    set({ isProcessing: true });

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      transports: ["websocket"],
      auth: {
        userId: user.id, // ✅ sent during handshake
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      set({ socket, isOnline: true, isProcessing: false });
      toast.success("Connected 🔥");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      set({ isOnline: false });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
      toast.error("Socket connection failed");
      set({ isProcessing: false, isOnline: false });
    });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null, isOnline: false });
  },
}));

export default socketStore;
