import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
} from "react";

import { motion } from "framer-motion";

import { MenuButton, Menu, MenuItem, MenuItems } from "@headlessui/react";
import { useAppDispatch, useAppSelector, useMediaQuery } from "../../hooks";
import { selectUser, selectUserName } from "../../states/slices/authReducer";
import {
  addLoadingState,
  clearChats,
  selectChat,
  selectChatId,
  selectDarkmode,
  selectInput,
  SelectOpenState,
  setChatId,
  setChats,
  setIsLoading,
  setLiveCaption,
  setSearcModal,
  showCaption,
  showCaptionPopUp,
  updateChat,
} from "../../states/slices/globalReducer";
import { useQuery } from "react-query";
import {
  archiveChat,
  deleteChat,
  getArchivedChats,
  getChats,
  getFavoritesChats,
  markChatAsFavorite,
  SendMessage,
  uploadFileApi,
} from "../../services/chat/chat.service";
import {
  formatChatTime,
  formatDate,
  useClipboard,
} from "../../utils-func/functions";

import {
  ADD_ICON,
  AI_PHOTO,
  DELETE_ICON,
  DELETE_ICON_RED,
  DOTS,
  DUPLICATE_ICON,
  DUPLICATE_ICON_WHITE,
  EXPO_SHARE,
  EXPO_SHARE_WHITE,
  SENDER,
  SPEAKER,
  STAR_ICON,
  STAR_ICON_,
  STAR_ICON_GRAY,
  STAR_ICON_WHITE,
} from "../../utils-func/image_exports";
import {
  FaCopy,
  FaEllipsisH,
  FaFileAlt,
  FaFilePdf,
  FaImage,
  FaStop,
  FaTrash,
  FaVolumeUp,
} from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaBoxArchive, FaShare, FaStar } from "react-icons/fa6";

import { Fade } from "react-awesome-reveal";
import { FadeLoader, PulseLoader } from "react-spinners";
import { Tooltip } from "@mui/material";
import { PreviewAttachment } from "../../shared/components/custom/preview-attachment";
import { LoaderIcon, StopIcon } from "../../shared/components/custom/icons";
import Onboarding from "../../shared/components/custom/onboarding";
import { array, late } from "zod";
import toast from "react-hot-toast";
import ModalV2 from "../../shared/components/modalV2";
import { Navigate, useNavigate } from "react-router-dom";

export function Chat({ isNewChat = false }: { isNewChat?: boolean }) {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any>([]);
  const username = useAppSelector(selectUserName);
  const user = useAppSelector(selectUser);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [listening, setListening] = useState(false);
  const [userStartedSpeaking, setUserStartedSpeaking] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("Type a message...");
  const [transcription, setTranscription] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const open = useAppSelector(SelectOpenState);
  const selectedText = useAppSelector(selectInput);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [captions, setCaptions] = useState("");
  const [fileSelector, setFileSelector] = useState(false);
  const [archivedAction, setArchivedAction] = useState(false);
  const [archivedState, setArchivedState] = useState(false);
  const [markAsFavoriteState, setMarkAsFavoriteState] = useState(false);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const chats = useAppSelector(selectChat);
  const [deleted, setDeleted] = useState(false);
  // const [chats, setChats] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [markAsFavorite, setMarkAsFavorite] = useState(false);
  const timeStamp = new Date().toISOString();
  const isFirstNewChat = chats?.length < 1;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatId = useAppSelector(selectChatId);
  const [loading, setLoading] = useState(false);
  const [failedResponse, setFailedResponse] = useState(false);
  const { data: chatMessages, refetch: chatHistoryRefetch } = useQuery(
    ["chats", 1],
    () => getChats(1)
  );
  const darkmode = useAppSelector(selectDarkmode);
  const liveCaption = useAppSelector(showCaption);
  const liveCaptionPopUp = useAppSelector(showCaptionPopUp);
  const { copyToClipboard } = useClipboard();
  const [deleteModal, setDeleteModal] = useState(false);
  const [readerSpeaking, setReaderSpeaking] = useState(false);
  const navigate = useNavigate();
  const { data: favorites, refetch: favoritesRefetch } = useQuery(
    "favorites",
    getFavoritesChats
  );
  const { data: archived, refetch: archivedRefetch } = useQuery(
    "archived",
    getArchivedChats
  );

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = liveCaption ? true : false;

  recognition.lang = "en-US";

  const startListening = () => {
    setListening(true);
    setPlaceHolder("Speak now...");
    setTranscription("");
    recognition.start();

    recognition.onresult = (event: any) => {
      let liveCaption = "";
      for (let i = 0; i < event.results.length; i++) {
        liveCaption += event.results[i][0].transcript; // Line to build the live caption
      }
      setCaptions(liveCaption);
      const text = event.results[0][0].transcript;

      setMessage(text);
      setUserStartedSpeaking(false);
      setPlaceHolder("Type a message...");
      setListening(false);
    };

    recognition.onspeechstart = () => {
      setUserStartedSpeaking(true);
      setPlaceHolder("Listening...");
    };
    recognition.onspeechend = () => {
      setListening(false);
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      setUserStartedSpeaking(false);
      setPlaceHolder("Type a message...");
      recognition.stop();
    };

    recognition.onend = () => {
      setListening(false);
      setUserStartedSpeaking(false);
      setPlaceHolder("Type a message...");
      recognition.stop();
    };
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };

  const handleUploadFile = async (files: File[]) => {
    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      // @ts-ignore
      if (file) formData.append("file_path[]", file);
    });

    try {
      const response = await uploadFileApi(formData);
      if (response) {
        toast.success("file uploaded successfully");
        console.log(response);
        const files = response?.data?.file_path;
        setUploadedFiles(files);
      }
    } catch (error) {
      toast.error("error uploading file");
    } finally {
      setUploading(false);
    }
  };
  const handleStartChat = async (mess: string) => {
    setFailedResponse(false);

    dispatch(
      setChats({
        sender: "user",
        content: mess,
        created_at: timeStamp,
      })
    );
    setMessage("");
    dispatch(addLoadingState());

    const formData = new FormData();
    formData.append("message", mess);

    try {
      const response = await SendMessage(formData);
      if (response) {
        // toast.success("Message sent, wait for response");
        chatHistoryRefetch(); // update the chat history with the new chat added
        window.history.replaceState({}, "", `/chat/${response?.data?.id}`);
        dispatch(setChatId(response?.data?.id));

        const latestAssistantMessage = response.data.messages
          .filter((msg: { sender: string }) => msg.sender === "assistant")
          .slice(-1)[0];

        if (latestAssistantMessage) {
          dispatch(updateChat(latestAssistantMessage.content));
        }
      }
    } catch (error: any) {
      setFailedResponse(true);

      toast.error(error?.response?.data?.message || "Error occurred");
    } finally {
      dispatch(setIsLoading(false));
      setMessage("");
    }
  };

  console.log(uploadedFiles);

  const handleContinueChat = async (mess: string) => {
    setFailedResponse(false);
    setSelectedFiles([]);

    dispatch(
      setChats({
        sender: "user",
        content: mess,
        file_path: uploadedFiles && uploadedFiles,
        created_at: timeStamp,
      })
    );
    setMessage("");
    dispatch(addLoadingState());

    const formData = new FormData();
    formData.append("message", mess);
    if (chatId) {
      formData.append("chat_id", chatId);
    }
    if (uploadedFiles && uploadedFiles?.length > 0) {
      uploadedFiles.forEach((files) => {
        formData.append("file_path[]", files);
      });
    }

    try {
      const response = await SendMessage(formData);
      if (response) {
        // toast.success("Message sent, wait for response");

        const latestAssistantMessage = response.data.messages
          .filter((msg: { sender: string }) => msg.sender === "assistant")
          .slice(-1)[0];

        if (latestAssistantMessage) {
          dispatch(updateChat(latestAssistantMessage.content));
        }
      }
    } catch (error: any) {
      setFailedResponse(true);

      toast.error(error?.response?.data?.message || "Error occurred");
    } finally {
      dispatch(setIsLoading(false)); // Ensure loading state reset
      setMessage("");
      setUploadedFiles([]);
    }
  };

  const handleSendMessage = async (message_: string, e?: React.ChangeEvent) => {
    e?.preventDefault();
    if (chatId) {
      await handleContinueChat(message_); // Continue chat if chat ID exists
    } else {
      await handleStartChat(message_); // Start new chat otherwise
    }
  };

  const readTextAloud = (text: string) => {
    if (!text.trim()) {
      toast.error("no text to be read aloud");
      return;
    }
    setReaderSpeaking(true);

    const textuttereance = new SpeechSynthesisUtterance(text);
    textuttereance.lang = "en-US";
    textuttereance.pitch = 1;
    textuttereance.rate = 1;
    textuttereance.volume = 1;

    window.speechSynthesis.speak(textuttereance);
  };
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // @ts-ignore
    formData.append("chatId", currentChatId);

    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: file.type,
        };
      } else {
        const { error } = await response.json();
        toast.error(error.error || "Upload failed");
        throw new Error(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Network error or upload failed");
      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);
    const files = event.target.files;

    if (files) {
      const selectedFiles = Array.from(files).slice(0, 3);
      const validFiles = selectedFiles.filter((file) => file.size <= 5000000);

      const filesWithPreview = validFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          return {
            ...file,
            preview: URL.createObjectURL(file),
          };
        } else {
          return {
            ...file,
            preview: null,
          };
        }
      });

      setSelectedFiles(filesWithPreview);
      if (filesWithPreview.length > 0) {
        await handleUploadFile(selectedFiles);
      }
    }
  };

  const handleControlKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "f") {
      event.preventDefault();
      dispatch(setSearcModal(true));
    }
  };

  const isLoading = false;

  const handleEnterMessage = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    mess_: string
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(mess_);
    }
  };
  const handleCopy = async (str: string) => {
    const success = await copyToClipboard(str);
    if (success) {
      toast.success("text copied to clipboard");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);
  useEffect(() => {
    window.addEventListener("keydown", handleControlKeyDown);

    return () => window.removeEventListener("keydown", handleControlKeyDown);
  }, []);

  const handleMarkChatAsFavorite = async (id: string) => {
    setLoading(true);
    try {
      const response = await markChatAsFavorite(id);
      if (response) {
        // setArchivedAction(true);
        // setArchivedState(true);

        setMarkAsFavorite(true);
        favoritesRefetch();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveChat = async (id: string) => {
    setLoading(true);
    try {
      const response = await archiveChat(id);
      if (response) {
        setArchivedAction(true);
        chatHistoryRefetch();
        archivedRefetch();
        navigate("/");
        dispatch(clearChats());
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (id: string) => {
    setDeleteModal(false);
    setLoading(true);

    try {
      const response = await deleteChat(id);
      if (response) {
        setDeleted(true);
        dispatch(clearChats());
        navigate("/");
        chatHistoryRefetch(); // refetch the chat history after a chat has being deleted
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const semanticColors = (isDarkMode: boolean) => ({
    title: isDarkMode
      ? "text-blue-400 font-semibold text-xl"
      : "text-blue-700 font-semibold text-xl",
    subtitle: isDarkMode
      ? "text-purple-400 font-medium text-lg"
      : "text-purple-700 font-medium text-lg",
    caseTitle: isDarkMode
      ? "text-blue-400 font-semibold"
      : "text-blue-700 font-semibold",
    legalPrinciple: isDarkMode ? "text-emerald-400" : "text-emerald-700",
    citation: isDarkMode ? "text-purple-400 italic" : "text-purple-700 italic",
    conclusion: isDarkMode
      ? "text-rose-400 font-medium"
      : "text-rose-700 font-medium",
    warning: isDarkMode ? "text-amber-400" : "text-amber-700",
    emphasis: isDarkMode ? "text-indigo-400" : "text-indigo-700",
    procedural: isDarkMode ? "text-cyan-400" : "text-cyan-700",
    evidence: isDarkMode ? "text-teal-400" : "text-teal-700",
    statute: isDarkMode ? "text-violet-400" : "text-violet-700",
    default: isDarkMode ? "text-gray-100" : "text-gray-900",
  });

  const colors = semanticColors(darkmode);

  const legalPatterns = [
    {
      regex: /^#\s+(.+?)$/gm,
      className: colors.title,
      removeMarker: true,
    },
    {
      regex: /^#{2,}\s+(.+?)$/gm,
      className: colors.subtitle,
      removeMarker: true,
    },
    {
      regex:
        /(?:^|\n)(?:CASE:|IN THE MATTER OF:|SUIT NO:|APPEAL NO:)(.+?)(?:\n|$)/gi,
      className: colors.caseTitle,
    },
    {
      regex:
        /(?:^|\n)(?:PRINCIPLE:|LEGAL PRINCIPLE:|RATIO:|RATIO DECIDENDI:)(.+?)(?:\n|$)/gi,
      className: colors.legalPrinciple,
    },
    {
      regex: /\[([^\]]+)\]|\(([^\)]+)\)/g,
      className: colors.citation,
    },
    {
      regex:
        /(?:^|\n)(?:CONCLUSION:|JUDGMENT:|HOLDING:|ORDER:|DECISION:)(.+?)(?:\n|$)/gi,
      className: colors.conclusion,
    },
    {
      regex:
        /(?:^|\n)(?:WARNING:|IMPORTANT:|NOTE:|CAVEAT:|DISCLAIMER:)(.+?)(?:\n|$)/gi,
      className: colors.warning,
    },
    {
      regex: /(?:^|\n)(?:PROCEDURE:|PROCEEDINGS:|TIMELINE:)(.+?)(?:\n|$)/gi,
      className: colors.procedural,
    },
    {
      regex: /(?:^|\n)(?:EVIDENCE:|EXHIBITS:|PROOF:)(.+?)(?:\n|$)/gi,
      className: colors.evidence,
    },
    {
      regex: /(?:^|\n)(?:STATUTE:|SECTION:|LAW:|ACT:)(.+?)(?:\n|$)/gi,
      className: colors.statute,
    },
    {
      regex: /\*\*(.+?)\*\*/g,
      className: colors.emphasis,
    },
  ];

  const colorizeText = (text: string) => {
    if (!text) return null;

    const lines = text.split(/\n/);
    const processedLines = lines.map((line, index) => {
      if (!line.trim()) {
        return <div key={index} className="h-4" />;
      }

      let processedLine = line;
      let hasMatch = false;
      let className = colors.default;

      for (const {
        regex,
        className: patternClass,
        removeMarker,
      } of legalPatterns) {
        const matches = Array.from(line.matchAll(new RegExp(regex)));
        if (matches.length > 0) {
          hasMatch = true;
          matches.forEach((match) => {
            const content = match[1] || match[0];
            // Remove the markdown markers if removeMarker is true
            processedLine = removeMarker
              ? content
              : processedLine.replace(
                  match[0],
                  `<span class="${patternClass}">${content}</span>`
                );
          });
          className = patternClass;
        }
      }

      // Handle markdown-style formatting within colored text
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>");

      return (
        <div
          key={index}
          className={`${hasMatch ? "" : className} leading-relaxed py-1`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });

    return <div className="space-y-1">{processedLines}</div>;
  };

  return (
    <div className="w-full pt-8 lg:px-16 px-7">
      {isFirstNewChat ? (
        <Onboarding username={username} append={handleStartChat} />
      ) : (
        <div
          ref={chatContainerRef}
          className={`border-t ${
            darkmode ? "border-[#232627]" : ""
          } lg:pt-7 pt-16 lg:h-[500px] lg:max-h-[500px] h-[600px] max-h-[600px] pb-16 overflow-y-auto`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[18px] font-semibold  ${
                darkmode ? "text-gray-300" : "text-black"
              }`}
            >
              {"LexTech AI.0"}
            </span>
            <div className="flex items-center gap-x-4">
              <Tooltip title="Mark favorite">
                <div
                  onClick={() => markChatAsFavorite(chatId)}
                  className={`flex items-center justify-center ${
                    darkmode ? "hover:bg-white/10 " : "hover:bg-[#F3F5F7]"
                  } w-[30px] h-[30px] rounded-md`}
                >
                  <img
                    src={darkmode ? STAR_ICON_GRAY : STAR_ICON}
                    className="w-[26px] h-[26px] cursor-pointer"
                    alt=""
                  />
                </div>
              </Tooltip>
              <Tooltip title="Share">
                <div
                  onClick={() => {
                    copyToClipboard(window.location.href);
                    toast.success("Link copied to clipboard");
                  }}
                  className={`flex items-center justify-center ${
                    darkmode ? "hover:bg-white/10 " : "hover:bg-[#F3F5F7]"
                  } w-[30px] h-[30px] rounded-md`}
                >
                  <img
                    src={EXPO_SHARE}
                    className="w-[26px] h-[26px] cursor-pointer"
                    // onClick={() => handleShareChat(chat_id!)}
                    alt=""
                  />
                </div>
              </Tooltip>

              <Menu>
                <Tooltip title="Options">
                  <MenuButton
                    className={`inline-flex items-center justify-center ${
                      darkmode ? "hover:bg-white/10" : "hover:bg-[#F3F5F7]"
                    }  gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white`}
                  >
                    {darkmode ? (
                      <FaEllipsisH
                        size={25}
                        color="#8B8B8B"
                        className="font-normal"
                      />
                    ) : (
                      <img
                        src={DOTS}
                        className="w-[28px] h-[28px] cursor-pointer"
                        alt=""
                      />
                    )}
                  </MenuButton>
                </Tooltip>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                    darkmode ? "bg-[#232627]" : "bg-white"
                  }  shadow-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => handleMarkChatAsFavorite(chatId)}
                      className={`group flex w-full  font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-gray-400"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaStar className="w-[18px] h-[18px] cursor-pointer" />
                      Mark favorite
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => handleArchiveChat(chatId)}
                      className={`group flex w-full text-[#6C7275] font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-gray-400"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      {/* <img
                        src={darkmode ? DUPLICATE_ICON_WHITE : DUPLICATE_ICON}
                        className="w-[22px] h-[22px] cursor-pointer"
                        alt=""
                      /> */}
                      <FaBoxArchive className="w-[18px] h-[18px] cursor-pointer" />
                      Archive
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(window.location.href);
                        toast.success("Link copied to clipboard");
                      }}
                      className={`group flex w-full text-[#6C7275] font-normal text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-gray-400"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      {/* <img
                        src={darkmode ? EXPO_SHARE_WHITE : EXPO_SHARE}
                        className="w-[22px] h-[22px] cursor-pointer"
                        alt=""
                      /> */}
                      <FaShare className="w-[18px] h-[18px] cursor-pointer" />
                      Share
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => setDeleteModal(true)}
                      className={`group flex w-full text-[#6C7275] font-medium text-[15px] items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-red-500"
                          : "data-[focus]:bg-[#F3F5F7] text-red-500"
                      } `}
                    >
                      {/* <img
                        src={darkmode ? DELETE_ICON_RED : DELETE_ICON}
                        className="w-[26px] h-[26px] cursor-pointer"
                        alt=""
                      /> */}
                      <FaTrash className="w-[18px] h-[18px] cursor-pointer text-red-500" />
                      Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          {chats?.length > 0 &&
            chats !== undefined &&
            chats?.map(
              (mess: {
                isLoading: boolean;
                file_path: any;
                sender: string;
                content: string;
                chat_id: string;
                id: string;
                created_at: string;
              }) => (
                <div className="flex flex-col gap-y-10 mt-8">
                  {mess?.sender === "user" ? (
                    <Fade
                      direction="up"
                      duration={500}
                      className="w-full flex flex-col items-end justify-end gap-y-2"
                    >
                      <div className="flex items-end flex-col gap-y-2">
                        <div className="flex items-center -gap-x-1 ">
                          {mess?.file_path?.length > 0 &&
                            mess?.file_path !== undefined &&
                            mess?.file_path?.map((file: any) => {
                              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(
                                file
                              );

                              return isImage ? (
                                <div className="lg:w-[200px] w-[75px] h-[75px] rounded-lg lg:h-[200px]  -mb-7">
                                  <img
                                    src={file}
                                    className="w-full h-full rounded-2xl object-contain"
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <FaFilePdf
                                  size={isMobile ? 75 : 150}
                                  color="red"
                                />
                              );
                            })}
                        </div>
                        <div
                          className={`px-4 py-3 ${
                            darkmode
                              ? "border-0 bg-[#232627]"
                              : "border border-[#E8ECEF] bg-white"
                          } rounded-2xl lg:max-w-md md:max-w-lg sm:max-w-sm max-w-full`}
                        >
                          <span
                            className={`lg:text-base md:text-sm text-xs font-semibold ${
                              darkmode ? "text-white/80" : "text-[#6E6E6E]"
                            } break-words`}
                          >
                            {mess?.content}
                          </span>
                        </div>
                        <span className="lg:text-sm text-xs font-normal text-[#C9C9C9]">
                          {formatDate(mess?.created_at)}
                        </span>
                      </div>
                    </Fade>
                  ) : (
                    <>
                      {failedResponse ? (
                        <div className="w-full flex items-start gap-x-3 relative gap-y-2 mt-5">
                          {/* <img src={AI_PHOTO} className="w-[30px] h-[30px] " alt="" /> */}
                          <FaCircleInfo
                            className="w-[30px] h-[30px]"
                            color="red"
                          />
                          <div className="px-4  rounded-xl h-full">
                            <span className="text-[18px] font-normal text-red-500">
                              {/* <PulseLoader size={isMobile ? 8 : 11} color="#767676" /> */}
                              Failed to generate respone
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex gap-y-2 items-start gap-x-2">
                          <img
                            src={AI_PHOTO}
                            className="lg:w-[30px] lg:h-[30px] w-[25px] h-[25px] "
                            alt=""
                          />
                          <div
                            className="flex flex-col items-start gap-y-1 -mt-3"
                            onMouseEnter={() => setHoveredMessage(mess?.id)}
                            onMouseLeave={() => setHoveredMessage(null)}
                          >
                            <div className="px-4 py-2  rounded-xl lg:max-w-full md:max-w-lg sm:max-w-sm max-w-full">
                              {mess.isLoading ? (
                                <PulseLoader
                                  size={14}
                                  color="#767676"
                                  className="mt-2"
                                />
                              ) : (
                                <span className="lg:text-base md:text-sm text-xs font-normal text-[#6E6E6E] break-words">
                                  {colorizeText(mess?.content)}
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex items-center gap-x-2 ml-3 ${
                                hoveredMessage === mess?.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              } text-white/30`}
                            >
                              {readerSpeaking ? (
                                <Tooltip title="Stop">
                                  <span
                                    className={`flex items-center justify-center ${
                                      darkmode
                                        ? "hover:bg-white/10"
                                        : "text-gray-500 hover:bg-gray-200"
                                    } w-[30px] h-[30px] rounded-md`}
                                    onClick={() => {
                                      window.speechSynthesis.cancel();
                                      setReaderSpeaking(false);
                                    }}
                                  >
                                    <FaStop className="cursor-pointer" />
                                  </span>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Read aloud">
                                  <span
                                    className={`flex items-center justify-center ${
                                      darkmode
                                        ? "hover:bg-white/10"
                                        : "text-gray-500 hover:bg-gray-200"
                                    } w-[30px] h-[30px] rounded-md`}
                                    onClick={() => readTextAloud(mess?.content)}
                                  >
                                    <FaVolumeUp className="cursor-pointer" />
                                  </span>
                                </Tooltip>
                              )}
                              <Tooltip title="Copy">
                                <span
                                  className={`flex items-center justify-center ${
                                    darkmode
                                      ? "hover:bg-white/10"
                                      : "text-gray-500 hover:bg-gray-200"
                                  } w-[30px] h-[30px] rounded-md`}
                                  onClick={() => handleCopy(mess?.content)}
                                >
                                  <FaCopy className="cursor-pointer" />
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            )}
          {/* {loading && (
            <div className="w-full flex items-start gap-x-3 relative gap-y-2 mt-5">
              <img src={AI_PHOTO} className="w-[30px] h-[30px] " alt="" />
              <div className="px-4  rounded-xl h-full">
                <span className="text-[18px] font-semibold text-[#6E6E6E]">
                  <PulseLoader size={isMobile ? 8 : 11} color="#767676" />
                </span>
              </div>
            </div>
          )} */}

          <div ref={messagesEndRef} />
        </div>
      )}

      {isMobile ? (
        <div
          className={`fixed bottom-0 px-6 pb-10 ${
            darkmode ? "bg-[#141718]" : "bg-[#fbfcfe]"
          } w-full h-[150px] left-0`}
        >
          <div
            className={`w-full relative border-2 py-2 overflow-hidden ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            } rounded-2xl flex flex-col items-center h-auto mt-9 px-3`}
          >
            <textarea
              name=""
              placeholder="Type a message..."
              rows={1}
              // onKeyDown={handleEnterMessage}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className={`w-full resize-none outline-none bg-transparent px-3 py-1 ${
                darkmode ? "text-gray-300" : "text-black"
              }`}
            />

            <div className="w-full flex items-center justify-between">
              {/* <button
                // @ts-ignore
                onClick={() => document.querySelector(".file_upload")?.click()}
              >
                <img
                  src={ADD_ICON}
                  className="lg:w-[28px] lg:h-[28px] w-[25px] h-[25px]"
                  alt="Add Icon"
                />
              </button> */}
              <Menu>
                <MenuButton className="inline-flex -ml-4 items-start  gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white">
                  <Tooltip title="Attach files">
                    <img
                      src={ADD_ICON}
                      onClick={() => {}}
                      className="w-[28px] h-[28px] "
                      alt="Add Icon"
                    />
                  </Tooltip>
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom start"
                  className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                    darkmode ? "bg-[#232627]" : "bg-white"
                  }  shadow-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    <button
                      onClick={() => imageInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-2 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaImage size={16} color={"#007AFF"} />
                      Upload image
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => fileInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaFilePdf size={16} color={"red"} />
                      Upload document
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <input
                type="file"
                accept="/image*"
                ref={imageInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMessage(message);
                }}
              >
                <img
                  src={SENDER}
                  className={`lg:w-[35px] lg:h-[35px] w-[25px] h-[25px] ${
                    !message.trim() && "opacity-50"
                  }`}
                  alt="Sender Icon"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Fade
          direction="up"
          duration={2000}
          className={`fixed bottom-0 h-fit ${
            darkmode ? "bg-[#141718]" : "bg-[#fbfcfe]"
          } `}
        >
          <div
            className={`${
              open ? "w-[690px]" : "w-[850px]"
            } mb-7 relative border-2 py-2 overflow-hidden ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            }   rounded-2xl flex flex-col items-center h-auto mt-16 px-3`}
          >
            <div className="flex items-center gap-x-1">
              {selectedFiles.length > 0 &&
                selectedFiles.map((file) =>
                  uploading ? (
                    <div className="animate-spin p-7 absolute text-zinc-500">
                      <LoaderIcon />
                    </div>
                  ) : file.preview ? (
                    <img
                      src={file.preview}
                      className="w-[50px] max-h-[50px] rounded-lg object-contain"
                      alt=""
                    />
                  ) : (
                    <FaFilePdf size={40} color="red" />
                  )
                )}
            </div>
            <textarea
              name=""
              placeholder={placeHolder}
              rows={1}
              onKeyDown={(e) => handleEnterMessage(e, message)}
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className={`w-full resize-none outline-none bg-transparent px-3 py-1 ${
                darkmode ? "text-gray-300" : "text-black"
              }`}
            />

            <div className="w-full flex items-center justify-between">
              <Menu>
                <MenuButton className="inline-flex -ml-4 items-start  gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white">
                  <Tooltip title="Attach files">
                    <img
                      src={ADD_ICON}
                      onClick={() => {}}
                      className="w-[28px] h-[28px] "
                      alt="Add Icon"
                    />
                  </Tooltip>
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom start"
                  className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                    darkmode ? "bg-[#232627]" : "bg-white"
                  }  shadow-lg p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
                >
                  <MenuItem>
                    <button
                      onClick={() => imageInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-2 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaImage size={16} color={"#007AFF"} />
                      Upload image
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => fileInputRef?.current?.click()}
                      className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-1.5 px-3  ${
                        darkmode
                          ? "data-[focus]:bg-white/10 text-white"
                          : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                      } `}
                    >
                      <FaFilePdf size={16} color={"red"} />
                      Upload document
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <input
                type="file"
                accept="/image*"
                ref={imageInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              {isLoading ? (
                <div
                  // onClick={() => stop()}
                  className="border cursor-pointer border-gray-300 rounded-md flex items-center justify-center"
                >
                  <StopIcon size={17} />
                </div>
              ) : (
                <>
                  {!message.trim() ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        listening ? stopListening() : startListening();
                      }}
                    >
                      {listening ? (
                        <div className="flex space-x-1">
                          <span className="w-1 h-4 bg-blue-500 animate-bounce rounded-full"></span>
                          <span className="w-1 h-6 bg-blue-500 animate-bounce delay-75 rounded-full"></span>
                          <span className="w-1 h-8 bg-blue-500 animate-bounce delay-150 rounded-full"></span>
                          <span className="w-1 h-6 bg-blue-500 animate-bounce delay-75 rounded-full"></span>
                          <span className="w-1 h-4 bg-blue-500 animate-bounce delay-150 rounded-full"></span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center hover:bg-white/10 rounded-full w-[45px] h-[45px]">
                          <img
                            src={SPEAKER}
                            className={`w-[35px] h-[35px] `}
                            alt="Sender Icon"
                          />
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSendMessage(message);
                      }}
                    >
                      <img
                        src={SENDER}
                        className={`w-[35px] h-[35px] `}
                        alt="Sender Icon"
                      />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </Fade>
      )}

      {liveCaption && (
        <motion.div
          initial={{ opacity: 0, translateY: 50, translateX: 50 }}
          animate={{ opacity: 1, translateY: 0, translateX: 0 }}
          exit={{ opacity: 0, translateY: 50, translateX: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs w-full flex justify-between items-center"
        >
          <p className="text-sm text-red-400">
            Live caption:{" "}
            <span className="font-semibold">
              {captions || "Captions would display here..."}
            </span>
          </p>
          <button
            onClick={() => {
              dispatch(setLiveCaption(false));
              setCaptions("");
            }}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Close"
          >
            ✖
          </button>
        </motion.div>
      )}
      {markAsFavorite && (
        <motion.div
          initial={{ opacity: 0, translateY: 50, translateX: 50 }}
          animate={{ opacity: 1, translateY: 0, translateX: 0 }}
          exit={{ opacity: 0, translateY: 50, translateX: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs w-full flex justify-between items-center"
        >
          <p className="text-sm text-red-400">
            <span className="font-semibold">Chat marked as favorite</span>
          </p>
          <button
            onClick={() => {
              setMarkAsFavorite(false);
            }}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Close"
          >
            ✖
          </button>
        </motion.div>
      )}
      {archivedAction && (
        <motion.div
          initial={{ opacity: 0, translateY: 50, translateX: 50 }}
          animate={{ opacity: 1, translateY: 0, translateX: 0 }}
          exit={{ opacity: 0, translateY: 50, translateX: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs w-full flex justify-between items-center"
        >
          <p className="text-sm text-red-400">
            <span className="font-semibold">Chat archived</span>
          </p>
          <button
            onClick={() => {
              setArchivedAction(false);
            }}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Close"
          >
            ✖
          </button>
        </motion.div>
      )}
      {deleted && (
        <motion.div
          initial={{ opacity: 0, translateY: 50, translateX: 50 }}
          animate={{ opacity: 1, translateY: 0, translateX: 0 }}
          exit={{ opacity: 0, translateY: 50, translateX: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs w-full flex justify-between items-center"
        >
          <p className="text-sm text-red-400">
            <span className="font-semibold">{"Chat deleted successfully"}</span>
          </p>
          <button
            onClick={() => {
              setDeleted(false);
            }}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Close"
          >
            ✖
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="fixed w-full bg-black/50 h-full flex items-center justify-center left-0 right-0 top-0 bottom-0 inset-0 z-50">
          <FadeLoader color="white" />
        </div>
      )}

      <ModalV2
        isOpen={deleteModal}
        isClose={() => setDeleteModal(false)}
        maxWidth="w-[500px]"
        edges="rounded-2xl"
      >
        <div className="flex flex-col gap-y-4 py-7">
          <span
            className={`text-lg font-semibold border-b text-left pb-3 pl-5 ${
              darkmode ? "text-gray-400 border-gray-700" : "text-[#141718]"
            }`}
          >
            Delete Chat?
          </span>
          <div className="flex flex-col items-end justify-start px-5">
            <span
              className={`w-full text-start text-[16px] font-medium ${
                darkmode ? "text-gray-400" : "text-[#141718]"
              }`}
            >
              This action is not{" "}
              <span className="font-semibold text-lg">Reversible!</span>
            </span>
            <div className="flex gap-x-2 pt-4">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className={`w-[100px] py-2 rounded-3xl ${
                  darkmode
                    ? "bg-white/10 text-white border border-gray-700"
                    : "bg-[#E8ECEF] text-gray-500"
                }  `}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteChat(chatId)}
                className="w-[100px] py-2  rounded-3xl bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </ModalV2>
    </div>
  );
}
