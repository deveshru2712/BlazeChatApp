import { toast } from "sonner";
import { create } from "zustand";
import api from "@/utils/Axios";

// handels all the auth logic
type AuthStore = AuthStoreState & AuthStoreActions;

const authStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  hasCheckedAuth: false,

  signUp: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/sign-up", credentials);
      set({ user: res.data.newUser, isLoading: false });
      toast.success(res.data.message + " 🔥");
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
      toast.error("Unable to create an account");
    }
  },

  logIn: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/auth/sign-in", credentials);
      set({ user: res.data.user, isLoading: false });
      toast.success(res.data.message + " 🔥");
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
      toast.error("Unable to login");
    }
  },

  logOut: async () => {
    set({ isLoading: true });
    try {
      await api.post("/api/auth/logout");
      set({ user: null, isLoading: false });
      toast.success("Logged out");
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
      toast.error("Unable to logout");
    }
  },

  authCheck: async () => {
    try {
      const res = await api.get("/api/auth/verify");
      set({
        user: res.data.user,
        hasCheckedAuth: true,
      });
    } catch (err) {
      console.error(err);
      set({
        user: null,
        hasCheckedAuth: true,
      });
    }
  },
}));

export default authStore;
