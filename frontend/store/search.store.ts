import api from "@/utils/Axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// search for user
type SearchStore = SearchStoreState & SearchStoreActions;

const searchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      userList: [],
      receiverUser: null,
      searchUsername: "",
      isSearching: false,
      searchInterval: null,
      hasSearched: false,
      setUserList: (userList) => {
        set({ userList: [...userList] });
      },
      setReceiverUser: (user) => {
        set({ receiverUser: user });
      },
      // cleaning up the timeout
      clearSearch: () => {
        const { searchInterval } = get();
        if (searchInterval) {
          clearTimeout(searchInterval);
        }

        set({
          isSearching: false,
          searchInterval: null,
        });
      },
      // for searching the user
      setSearchUsername: (username) => {
        const { searchInterval } = get();

        if (searchInterval) {
          clearTimeout(searchInterval);
        }

        set({ searchUsername: username, hasSearched: false });

        if (!username.trim()) {
          set({ userList: [], isSearching: false, searchInterval: null });
          return;
        }

        set({ isSearching: true });

        const timeOut = setTimeout(async () => {
          try {
            const response = await api(`/api/user`, {
              params: { username: username.trim() },
            });

            set({
              userList: response.data.users,
              hasSearched: true,
              isSearching: false,
            });
          } catch (error) {
            set({ userList: [], hasSearched: true, isSearching: false });
            console.error(error);
          }
        }, 1000);

        set({ searchInterval: timeOut });
      },
    }),
    {
      name: "search-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userList: state.userList,
        receiverUser: state.receiverUser,
        searchUsername: state.searchUsername,
        hasSearched: state.hasSearched,
      }),
    }
  )
);

export default searchStore;
