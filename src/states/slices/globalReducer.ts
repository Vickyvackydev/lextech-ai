import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
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
    setChats: (state, action) => {
      state.chats.push(action.payload);
    },
    // updateChat: (state, action) => {
    //   const messageIndex = [...state.chats]
    //     .reverse()
    //     .findIndex((msg) => msg.sender === "assistant");
    //   if (messageIndex !== -1) {
    //     const actualIndex = state.chats.length - 1 - messageIndex;
    //     state.chats[actualIndex] = {
    //       ...state.chats[actualIndex],
    //       content: action.payload.content,
    //     };
    //   }
    // },
    // updateChat: (state, action) => {
    //   const { id, newData } = action.payload;
    //   const message = state.chats.find((msg) => msg.id === id);
    //   if (message) {
    //     Object.assign(message, newData); // Update specific message
    //   }
    // },
    updateChat(state, action) {
      if (state.isLoading) {
        const index = state.chats.findIndex(
          (msg) => msg.sender === "assistant" && msg.isLoading
        );
        if (index !== -1)
          state.chats[index] = { sender: "assistant", content: action.payload };
      } else {
        state.chats.push({ sender: "assistant", content: action.payload });
      }
    },
    addLoadingState: (state) => {
      (state.isLoading = true),
        state.chats.push({ sender: "assistant", isLoading: true });
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearChats: (state) => {
      state.chats = [];
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
} = GlobalSlice.actions;

export const SelectOpenState = (state: RootState) => state.globalstate.open;
export const startChat = (state: RootState) => state.globalstate.chatStarted;
export const openModal = (state: RootState) => state.globalstate.searchModal;
export const getMessages = (state: RootState) => state.globalstate.messages;
export const selectInput = (state: RootState) => state.globalstate.input;
export const selectDarkmode = (state: RootState) => state.globalstate.darkMode;
export const selectChat = (state: RootState) => state.globalstate.chats;
export const selectChatId = (state: RootState) => state.globalstate.chatId;
export const showCaption = (state: RootState) => state.globalstate.caption;
export const showCaptionPopUp = (state: RootState) =>
  state.globalstate.captionPopUp;
export const showSettings = (state: RootState) => state.globalstate.settings;
export const GlobalReducer = GlobalSlice.reducer;
