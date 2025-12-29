import type { Socket } from "socket.io-client";

declare global {
  type FormType = "sign-in" | "sign-up";

  interface SignUpType {
    username: string;
    email: string;
    password: string;
  }

  interface SignInType {
    email: string;
    password: string;
  }

  interface User {
    id: string;
    username: string;
    email: string;
    conversations?: Conversation[];
    profilePicture: string;
  }

  interface Conversation {
    id: string;
    participants: User[];
    messages?: Message[];
    createdAt: Date;
    updatedAt?: Date;
  }

  interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
  }

  // component types

  interface MessageProps {
    User: User;
  }

  interface SettingsButtonProps {
    className: string;
  }

  interface MessageBoxProps {
    id: string;
    username: string;
    profileImg: string;
    latestMessage: string;
    time: Date | null;
    onClick: () => void;
  }

  interface MessageBubbleProps {
    isMine: boolean;
    message: string;
    time: Date;
  }

  interface MessageNavProps {
    user: User;
    isTyping: boolean;
  }

  // auth store types

  interface AuthStoreState {
    user: User | null;
    isLoading: boolean;
    hasCheckedAuth: boolean;
  }

  interface AuthStoreActions {
    signUp: (credentials: SignUpType) => Promise<void>;
    logIn: (credentials: SignInType) => Promise<void>;
    logOut: () => void;
    authCheck: () => void;
  }

  // socket store types

  interface SocketStoreState {
    socket: Socket | null;
    isOnline: boolean;
    isProcessing: boolean;
  }

  interface SocketStoreActions {
    setSocket: () => void;
    disconnect: () => void;
  }

  // search store types
  interface SearchStoreState {
    userList: User[];
    isSearching: boolean;
    receiverUser: User | null;
    searchUsername: string;
    hasSearched: boolean;
    searchInterval: NodeJS.Timeout | null;
  }

  interface SearchStoreActions {
    setUserList: (userList: User[]) => void;
    setReceiverUser: (user: User) => void;
    setSearchUsername: (receiverId: string) => void;
    clearSearch: () => void;
  }

  // message store types

  interface MessageStoreState {
    message: string;
    messageArr: Message[];
    isPending: boolean;
    currentConversationId: string | null;
    recentConversation: Conversation[];
  }

  interface MessageStoreActions {
    fetchRecentConversation: (userId: string) => Promise<void>;
    fetchingMessage: (receiverId: string) => Promise<void>;
    sendMessage: (
      receiverId: string,
      message: string,
      socket: Socket
    ) => Promise<void>;
    setMessage: (message: string) => void;
    setCurrentConversationId: (conversationId: string) => void;
    setMessageArr: (MessageArr: Message[]) => void;
  }

  type formValue = {
    username?: string;
    email?: string;
    password: string;
    profilePicture?: string;
  };

  // update store
  interface updateStoreState {
    formValue: formValue | null;
    isUpdating: boolean;
    isUploading: boolean;
  }

  interface updateStoreActions {
    updateProfile: (formValue: formValue) => Promise<void>;
    uploadImage: (file: File) => Promise<void>;
  }
}
