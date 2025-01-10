import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
export interface GlobalState {
  open: boolean;
  chatStarted: boolean;
  searchModal: boolean;
  messages: Array<string>;
  input: string;
  darkMode: boolean;
  chats: any[];
  chatId: string | null;
  caption: boolean;
  settings: boolean;
  captionPopUp: boolean;
  isLoading: boolean;
}

const initialState: GlobalState = {
  open: false,
  chatStarted: false,
  searchModal: false,
  messages: [],
  input: "",
  darkMode: false,
  chats: [],
  chatId: null,
  caption: false,
  settings: false,
  isLoading: false,
  captionPopUp: false,
};

export const GlobalSlice = createSlice({
  initialState,
  name: "globalstate",
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    setChatStarted: (state, action) => {
      state.chatStarted = action.payload;
    },
    setSearcModal: (state, action) => {
      state.searchModal = action.payload;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedInput: (state, action) => {
      state.input = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    // Redux Reducers
    setChats: (state, action) => {
      state.chats.push(action.payload);
    },

    updateChat: (state, action) => {
      const index = state.chats.findIndex((msg) => msg.isLoading);
      if (index !== -1) {
        state.chats[index] = {
          id: uuidv4(),
          sender: "assistant",
          content: action.payload,
        };
      } else {
        state.chats.push({
          id: uuidv4(),
          sender: "assistant",
          content: action.payload,
        });
      }
      state.isLoading = false;
    },

    addLoadingState: (state) => {
      if (!state.isLoading) {
        state.isLoading = true;
        state.chats.push({ sender: "assistant", isLoading: true });
      }
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    passPreviouseChats: (state, action) => {
      state.chats = action.payload;
      state.isLoading = false;
    },

    clearChats: (state) => {
      state.chats = [];
      state.messages = [];
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setLiveCaption: (state, action) => {
      state.caption = action.payload;
    },
    setLiveCaptionPopUp: (state, action) => {
      state.captionPopUp = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const {
  setOpen,
  setChatStarted,
  setSearcModal,
  setMessage,
  setSelectedInput,
  setDarkMode,
  setChats,
  setChatId,
  setLiveCaption,
  setSettings,
  setIsLoading,
  setLiveCaptionPopUp,
  updateChat,
  addLoadingState,
  clearChats,
  passPreviouseChats,
} = GlobalSlice.actions;

export const SelectOpenState = (state: RootState) => state.globalstate.open;
export const startChat = (state: RootState) => state.globalstate.chatStarted;
export const openModal = (state: RootState) => state.globalstate.searchModal;
export const selectMessages = (state: RootState) => state.globalstate.messages;
export const selectInput = (state: RootState) => state.globalstate.input;
export const selectDarkmode = (state: RootState) => state.globalstate.darkMode;
export const selectChat = (state: RootState) => state.globalstate.chats;
export const selectChatId = (state: RootState) => state.globalstate.chatId;
export const showCaption = (state: RootState) => state.globalstate.caption;
export const showCaptionPopUp = (state: RootState) =>
  state.globalstate.captionPopUp;
export const showSettings = (state: RootState) => state.globalstate.settings;
export const GlobalReducer = GlobalSlice.reducer;
