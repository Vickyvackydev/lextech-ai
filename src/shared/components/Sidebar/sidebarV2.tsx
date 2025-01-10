/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */

import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useEffect, useState, useRef } from "react";
import { BiLogOut } from "react-icons/bi";
import {
  FaCheck,
  FaEllipsisH,
  FaEllipsisV,
  FaSignOutAlt,
} from "react-icons/fa";

import Tooltip from "@mui/material/Tooltip";

import ButtonV2 from "../buttonV2";
import { Bounce, Fade } from "react-awesome-reveal";

import { Skeleton } from "@mui/material";

import toast from "react-hot-toast";

import { FaUser } from "react-icons/fa6";
import { useQuery } from "react-query";
import { useAppDispatch, useAppSelector, useMediaQuery } from "../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { getChats } from "../../../services/chat/chat.service";
import {
  passPreviouseChats,
  selectDarkmode,
  setChatId,
  setChats,
  setLiveCaption,
  setMessage,
  setSettings,
} from "../../../states/slices/globalReducer";

import {
  CAPTIONS,
  DARK_STATUS,
  MAN,
  ONLINE_STATUS,
  TRASH,
} from "../../../utils-func/image_exports";
import { formatTimeElapsed } from "../../../utils-func/functions";
import { date } from "zod";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setOpen: any;
}

interface MessageType {
  messages: [
    {
      chat_id: string;
      content: string;
    }
  ];
}

const SidebarV2 = (props: SidebarProps) => {
  const { open, onClose, setOpen } = props;
  const dispatch = useAppDispatch();
  const btnRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showLogOutBox, setShowLogOutBox] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const location = useLocation();
  const ChatId = location.pathname.split("/").pop();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any>([]);
  const { data: ChatHistory, isLoading } = useQuery("chats", getChats);
  const handleChatClick = (
    id: string,
    messages: any[],
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    const selectedChatMessages = messages.map((mess) => ({
      id: mess.id,
      sender: mess.sender,
      content: mess.content,
      created_at: new Date(mess.created_at).toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
    dispatch(passPreviouseChats(selectedChatMessages));
    navigate(`/chat/${id}`);
    dispatch(setChatId(id));
  };
  const handleSelectId = (id: string) => {
    setSelectedIds(
      (prevId: any) =>
        prevId.includes(id)
          ? prevId.filter((_id: any) => _id !== id) // unselect ids
          : [...prevId, id] // select id
    );
  };

  console.log(ChatHistory);

  // const {
  //   data: chatHistory,
  //   isLoading,
  //   mutate,
  // } = useSWR(`/api/history`, fetcher, {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  //   fallbackData: [],
  //   onSuccess: (newData) => {
  //     if (!newData || newData.length === 0) {
  //       setHasMore(false);
  //       setIsLoadingMore(false);
  //     }
  //     setIsLoadingMore(false);
  //   },
  // });
  // useEffect(() => {
  //   if (isLoadingMore) {
  //     mutate();
  //   }
  // }, [isLoadingMore, mutate]);

  // const handleDeleteChat = async (chatIds: string[], e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   try {
  //     await deleteChats(chatIds);
  //     // await mutate(); // Refresh the chat list
  //     setLoading(false);
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Error deleting chat:", error);
  //     toast.error("error deleting chat");
  //   }
  // };

  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const darkmode = useAppSelector(selectDarkmode);
  const navigate = useNavigate();

  return (
    <>
      {isMobileView || isTabletView ? (
        <Transition
          as="div"
          className="fixed z-30 h-full w-56 flex-none bg-brand-light lg:static"
          enter="transition-all ease-in duration-300"
          enterFrom="transform -translate-x-full"
          enterTo="transform -translate-x-0"
          leave="transition-all ease-out duration-300"
          leaveFrom="transform -translate-x-0"
          leaveTo="transform -translate-x-full"
          show={open}
        >
          {/* mobile screen section */}
          <div className="h-screen"></div>
        </Transition>
      ) : (
        <div
          className={`flex h-screen z-20 flex-col py-7 w-[650px]  ${
            darkmode ? "bg-[#232627]" : "bg-[#FEFEFE]"
          }`}
          style={{ boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <div
            className={`w-full h-[72px]  border-b ${
              darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
            }  flex items-center justify-end gap-x-8 pr-6 pb-4`}
          >
            <Tooltip title="Start live caption">
              <div
                className="w-[50px] h-[50px] rounded-full cursor-pointer items-center justify-center flex bg-white/20"
                onClick={() => {
                  dispatch(setLiveCaption(true));
                }}
              >
                <img src={CAPTIONS} className="w-[34px] h-[34px]" alt="" />
              </div>
            </Tooltip>

            <Menu>
              <MenuButton className="inline-flex -ml-4 items-start  gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none   data-[focus]:outline-1 data-[focus]:outline-white">
                <Tooltip title="Profile">
                  <div className="relative">
                    <img
                      src={MAN}
                      className="w-[40px] h-[40px] rounded-full"
                      alt="image"
                    />
                    <img
                      src={darkmode ? DARK_STATUS : ONLINE_STATUS}
                      className="w-[18px] h-[18px] rounded-full absolute -right-1 top-7"
                      alt="image"
                    />
                  </div>
                </Tooltip>
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className={`w-52 origin-top-right rounded-xl border border-white/5 ${
                  darkmode ? "bg-[#232627]" : "bg-white"
                }  shadow-lg p-1 text-sm/6 text-white z-50 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
              >
                <MenuItem>
                  <button
                    onClick={() => dispatch(setSettings(true))}
                    className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-2 px-3  ${
                      darkmode
                        ? "data-[focus]:bg-white/10 text-white"
                        : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                    } `}
                  >
                    <FaUser size={16} color={"#007AFF"} />
                    View profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => navigate("/sign-in")}
                    className={`group flex w-full text-[#6C7275] font-normal text-sm items-center gap-2 rounded-lg py-1.5 px-3  ${
                      darkmode
                        ? "data-[focus]:bg-white/10 text-white"
                        : "data-[focus]:bg-[#F3F5F7] text-[#6C7275]"
                    } `}
                  >
                    <FaSignOutAlt size={16} color={"red"} />
                    Log out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>

            <ButtonV2
              title="Share"
              btnStyle="bg-[#007AFF] rounded-lg w-[87px] h-[40px]"
              textStyle="text-[#FEFEFE] font-semibold"
              handleClick={() => {}}
            />
          </div>
          <div className="h-full  inset-0 px-5 mt-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <span
                  className={` ${
                    darkmode ? "text-white" : "text-[#6C7275BF"
                  } font-semibold text-sm`}
                >
                  Chat history
                </span>
                <div
                  className={`w-[55px] h-[20px] rounded-xl ${
                    darkmode
                      ? "border border-[#343839] bg-none text-white/80"
                      : "bg-[#E8ECEF] border-0 text-[#6C7275]"
                  }  flex items-center shadow-md justify-center text-xs font-medium `}
                >
                  {ChatHistory?.data?.length}/{ChatHistory?.meta?.total}
                </div>
              </div>
              {selectedIds.length > 0 && (
                <img
                  src={TRASH}
                  className="w-[20px] h-[20px] cursor-pointer"
                  alt=""
                  // onClick={(e) => handleDeleteChat(selectedIds, e)}
                />
              )}
            </div>
            <Fade direction="up" duration={1000}>
              <div className="mt-16 flex flex-col gap-y-3 h-[400px] max-h-[400px] overflow-y-scroll">
                {ChatHistory?.data?.length > 0 ? (
                  ChatHistory?.data?.map(
                    (item: {
                      id: string;
                      title: string;
                      summary: string;
                      created_at: string;
                      messages: any[];
                    }) => (
                      <div className="flex items-start justify-start cursor-pointer">
                        {/* <div
                          className={`max-w-[20px] max-h-[20px] p-1 rounded-md border-2 ${
                            darkmode ? "border-white/50" : "border-[#6C727580]"
                          }  mt-2 flex items-center justify-center cursor-pointer`}
                          onClick={() => handleSelectId(item?.id)}
                        >
                          {selectedIds.includes(item?.id) && (
                            <FaCheck
                              size={14}
                              color={`${darkmode ? "#ffffff" : "#6C727580"}`}
                            />
                          )}
                        </div> */}
                        {/* <div className=" left-4 mt-4">
                          <FaEllipsisV className="text-gray-500 hover:text-white" />
                        </div> */}
                        <div
                          className={`flex relative flex-col items-end gap-y-0 cursor-pointer px-2 rounded-lg py-1 ${
                            darkmode
                              ? "hover:bg-white/20"
                              : "hover:bg-[#F3F5F7]"
                          }`}
                          onClick={(e) =>
                            handleChatClick(item?.id, item?.messages, e)
                          }
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                darkmode ? "text-white" : "text-[#141718]"
                              } text-[16px] font-semibold`}
                            >
                              {item?.title.length > 15
                                ? `${item?.title.slice(0, 15)}...`
                                : item?.title}
                            </span>
                            <span className={`text-xs font-medium  `}>
                              {item.messages
                                .filter((mes) => mes.sender === "assistant")[0]
                                ?.content?.slice(0, 40)}
                              ...
                            </span>
                          </div>
                          <span
                            className={`${
                              darkmode ? "text-white/50" : "text-[#6C7275BF]"
                            } font-medium text-[11px]`}
                          >
                            {formatTimeElapsed(item?.created_at)}
                          </span>
                        </div>
                      </div>
                    )
                  )
                ) : isLoading ? (
                  <>
                    <div className="w-[80%]">
                      <Skeleton
                        className="w-full mb-4"
                        height={20}
                        variant="rectangular"
                      />
                      <Skeleton
                        className="w-[40%] mb-4"
                        height={20}
                        variant="rectangular"
                      />
                    </div>
                    <div className="w-[80%]">
                      <Skeleton
                        className="w-full mb-4"
                        height={20}
                        variant="rectangular"
                      />
                      <Skeleton
                        className="w-[40%] mb-4"
                        height={20}
                        variant="rectangular"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-[16px] font-medium text-gray-400 text-center">
                    No recents chats
                  </div>
                )}
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarV2;
