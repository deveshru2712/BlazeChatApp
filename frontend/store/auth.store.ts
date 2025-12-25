import api from "@/utils/Axios";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { create } from "zustand";

// handels all the auth logic
type AuthStore = AuthStoreState & AuthStoreActions;

const authStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  signUp: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post(`/api/auth/sign-up`, credentials);
      set({ isLoading: false, user: response.data.newUser });
      toast.success(response.data.message + "🔥");
    } catch (error) {
      console.log(error);
      set({ isLoading: false, user: null });
      toast.error("Unable to create an account");
    }
  },
  logIn: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/api/auth/sign-in", credentials);
      set({ isLoading: false, user: response.data.user });
      toast.success(response.data.message + "🔥");
    } catch (error) {
      console.log(error);
      set({ isLoading: false, user: null });
      toast.error("Unable to login");
    }
  },
  logOut: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post("/api/auth/logout");
      set({ isLoading: false, user: null });
      toast.success(response.data.message);
      redirect("/");
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      toast.error("Unable to logout");
    }
  },
  authCheck: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const response = await api("/api/auth/verify");
      set({ isLoading: false, user: response.data.user });
    } catch (error) {
      console.log(error);
      set({ isLoading: false, user: null });
    }
  },
}));

export default authStore;
