import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import authStore from "./auth.store";

type SocketStore = SocketStoreState & SocketStoreActions;

const socketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isOnline: false,
  isProcessing: false,

  setSocket: () => {
    const { user } = authStore.getState();
    const existingSocket = get().socket;

    if (!user?.id) {
      console.warn("No user, socket not connected");
      return;
    }

    if (existingSocket) {
      existingSocket.removeAllListeners();
      existingSocket.disconnect();
      set({ socket: null });
    }

    set({ isProcessing: true });

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
      auth: {
        userId: user.id,
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
