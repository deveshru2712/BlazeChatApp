import { create } from "zustand";
import { io } from "socket.io-client";
import authStore from "./auth.store";
import { toast } from "sonner";

// handles all the socket related stuff connecting, getting the online user list, typing status
type SocketStore = SocketStoreState & SocketStoreActions;

const socketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isProcessing: false,
  onlineUser: [],
  isTyping: false,
  isOnline: false,
  refreshInterval: null,
  searchOnlineUserInterval: null,
  // retryCount: 0,
  // maxRetries: 3,
  // retryDelay: 1000,
  // retryTimeout: null,

  setIsTyping: (value) => {
    set({ isTyping: value });
  },

  setSocket: () => {
    set({ isProcessing: true });
    const { socket } = get();
    const { user } = authStore.getState();

    try {
      if (user) {
        if (socket) {
          // going to un-register using the socket id
          socket.disconnect();
        }
        set({ socket: null, isOnline: false });
      }

      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        transports: ["websocket", "polling"],
        timeout: 5000,
        forceNew: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);

        if (user) {
          console.log("Emitting register for user:", user.id);
          newSocket.emit("register-user", user.id);
          set({
            socket: newSocket,
            isProcessing: false,
            isOnline: true,
          });
          toast.success("User online 🔥");
        }
      });

      newSocket.on("connect_error", (error) => {
        console.log("Connection failed:", error);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
        set({ isOnline: false });

        if (reason === "io server disconnect") {
          // Server disconnected the socket, need to reconnect manually
          toast.warning("Server disconnected. Attempting to reconnect...");
          setTimeout(() => {
            get().setSocket();
          }, 1000);
        } else if (
          reason === "transport close" ||
          reason === "transport error"
        ) {
          // Network issues, attempt to reconnect
          toast.warning("Network issue detected. Attempting to reconnect...");
          setTimeout(() => {
            get().setSocket();
          }, 2000);
        }
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("Reconnected after", attemptNumber, "attempts");
        set({ isOnline: true });
        toast.success("Reconnected successfully 🔥");
      });

      newSocket.on("reconnect_error", (error) => {
        console.log("Reconnection failed:", error);
        set({ isOnline: false });
      });

      newSocket.on("reconnect_failed", () => {
        console.log("Reconnection failed permanently");
        set({ isOnline: false });
        toast.error("Unable to reconnect to server 💀");
      });
    } catch (error) {
      console.log("Unable to connect to the server", error);
      set({ isProcessing: false, socket: null, isOnline: false });
      toast.error("User offline 💀");
    }
  },

  startHeartBeat: () => {
    set({ isProcessing: true });
    const { socket, refreshInterval } = get();
    try {
      if (socket && !refreshInterval) {
        socket.emit("heartbeat");

        // so that we can maintain active status
        const interval = setInterval(() => {
          if (socket && socket.connected) {
            socket.emit("heartbeat", (response: any) => {
              console.log("Heartbeat response:", response);
              set({ isOnline: true });
            });
          } else {
            console.log("Socket is not connected");
            set({ isOnline: false });
          }
        }, 50000);

        set({ refreshInterval: interval, isProcessing: false });
      }
    } catch (error) {
      console.log("Error occurred while updating the active status", error);
      set({ isProcessing: false });
    }
  },

  clearHeartBeatInterval: () => {
    const { refreshInterval } = get();
    if (refreshInterval) {
      clearInterval(refreshInterval);
      set({ refreshInterval: null, isOnline: false });
    }
  },

  disconnect: () => {
    set({ isProcessing: true });
    try {
      const { socket } = get();

      if (socket) {
        socket.disconnect();
      }

      set({
        isProcessing: false,
        socket: null,
        isOnline: false,
      });
    } catch (error) {
      console.log("Error occurred during disconnect", error);
      set({
        isProcessing: false,
        socket: null,
        isOnline: false,
      });
    }
  },

  getOnlineUser: () => {
    const { socket, searchOnlineUserInterval } = get();

    if (socket && searchOnlineUserInterval) {
      clearInterval(searchOnlineUserInterval);
      socket.off("online-users");
    }

    if (!socket) {
      console.log("No socket connection");
      return;
    }

    const fetchOnlineUser = () => {
      if (socket && socket.connected) {
        socket.emit("request-online-users");
      }
    };

    // Set up the event listener once
    socket.on("online-users", (onlineUsers) => {
      console.log("Received online users:", onlineUsers);
      set({ onlineUser: onlineUsers });
    });

    // Initial fetch
    fetchOnlineUser();

    // Set up interval for periodic updates
    const interval = setInterval(() => {
      fetchOnlineUser();
    }, 10000);

    set({ searchOnlineUserInterval: interval });
  },

  clearOnlineUserSearch: () => {
    const { socket, searchOnlineUserInterval } = get();
    if (searchOnlineUserInterval) {
      clearInterval(searchOnlineUserInterval);
    }
    if (socket) {
      socket.off("online-users");
    }
    set({ searchOnlineUserInterval: null });
  },
}));

export default socketStore;
