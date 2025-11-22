import { activeUsers } from "../socket";

export const getOnlineUser = async () => {
  try {
    const onlineUsers = Array.from(activeUsers);
    return onlineUsers;
  } catch (error) {
    console.log("Unable to fetch the list of all online users");
    return [];
  }
};
