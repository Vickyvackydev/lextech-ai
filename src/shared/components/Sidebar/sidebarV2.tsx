import {
  MenuButton,
  Menu,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useState, useRef } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import ButtonV2 from "../buttonV2";
import { Fade } from "react-awesome-reveal";
import { Skeleton } from "@mui/material";
import { FaUser } from "react-icons/fa6";
import { useQuery } from "react-query";
import { useAppDispatch, useAppSelector, useMediaQuery } from "../../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { getChats } from "../../../services/chat/chat.service";
import {
  passPreviouseChats,
  selectDarkmode,
  setChatId,
  setLiveCaption,
  setSettings,
} from "../../../states/slices/globalReducer";

import {
  CAPTIONS,
  DARK_STATUS,
  MAN,
  ONLINE_STATUS,
  TRASH,
} from "../../../utils-func/image_exports";
import { formatDate, formatTimeElapsed } from "../../../utils-func/functions";
import { selectProfile, selectUser } from "../../../states/slices/authReducer";
import { FadeLoader } from "react-spinners";

interface SidebarV2Props {
  v2Open: boolean;
  v2OnClose: () => void;
  setV2Open: any;
}

const SidebarV2 = (props: SidebarV2Props) => {
  const { v2Open, v2OnClose, setV2Open } = props;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectProfile);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const ChatId = location.pathname.split("/").pop();

  const [selectedIds, setSelectedIds] = useState<any>([]);
  const { data: ChatHistory, isLoading } = useQuery(["chats", page], () =>
    getChats(page)
  );
  const filterUnarchivedChat = ChatHistory?.data?.filter(
    (item: { is_archived: boolean }) => item.is_archived === false
  );

  const handlePageNext = () => {
    setLoading(isLoading);
    setPage(page + 1);
  };
  const handlePagePrev = () => {
    setLoading(isLoading);
    setPage(page - 1);
  };
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
      file_path: mess.file_path || [],
      created_at: mess.created_at,
    }));
    dispatch(passPreviouseChats(selectedChatMessages));
    navigate(`/chat/${id}`);
    dispatch(setChatId(id));
  };

  console.log(ChatHistory);

  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const darkmode = useAppSelector(selectDarkmode);
  const navigate = useNavigate();

  return (
    <>
      {isMobileView || isTabletView ? (
        <Transition
          as="div"
          className="fixed z-30 top-0 h-full w-80 flex-none bg-brand-light lg:static"
          enter="transition-all ease-in duration-300"
          enterFrom="transform -translate-x-full"
          enterTo="transform -translate-x-0"
          leave="transition-all ease-out duration-300"
          leaveFrom="transform -translate-x-0"
          leaveTo="transform -translate-x-full"
          show={v2Open}
        >
          {/* mobile screen section */}
          <div
            className={`flex h-screen z-20 flex-col py-7   ${
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
                        src={user?.image ?? MAN}
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
                    {filterUnarchivedChat?.length}/{ChatHistory?.meta?.total}
                  </div>
                </div>
                {/* {ChatHistory?.data?.length > 0 &&
                  (loading ? (
                    <FadeLoader />
                  ) : (
                    <button type="button" onClick={handlePageNext}>
                      See more
                    </button>
                  ))} */}
              </div>
              <Fade direction="up" duration={1000}>
                <div className="mt-16 flex flex-col gap-y-3 h-[400px] max-h-[400px] overflow-y-scroll">
                  {filterUnarchivedChat?.length > 0 ? (
                    filterUnarchivedChat?.map(
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
                            className={`flex relative w-full flex-col items-end gap-y-0 cursor-pointer px-2 rounded-lg py-1 ${
                              darkmode
                                ? "hover:bg-white/20"
                                : "hover:bg-[#F3F5F7]"
                            }`}
                            onClick={(e) =>
                              handleChatClick(item?.id, item?.messages, e)
                            }
                          >
                            <div className="flex flex-col w-full items-start">
                              <span
                                className={`${
                                  darkmode ? "text-white" : "text-[#141718]"
                                } text-[16px] font-semibold`}
                              >
                                {item?.title.length > 15
                                  ? `${item?.title.slice(0, 15)}...`
                                  : item?.title}
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  darkmode ? "text-gray-300" : ""
                                } `}
                              >
                                {item.messages
                                  .filter(
                                    (mes) => mes.sender === "assistant"
                                  )[0]
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
                      src={user?.image ?? MAN}
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
                  {ChatHistory?.meta?.to ?? 0}/{ChatHistory?.meta?.total ?? 0}
                </div>
              </div>
            </div>
            <Fade direction="up" duration={1000}>
              <div className="mt-16 flex flex-col gap-y-3 h-[400px] max-h-[400px] overflow-y-scroll">
                {filterUnarchivedChat?.length > 0 ? (
                  filterUnarchivedChat?.map(
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
                          className={`flex relative w-full flex-col items-end gap-y-0 cursor-pointer px-2 rounded-lg py-1 ${
                            darkmode
                              ? "hover:bg-white/20"
                              : "hover:bg-[#F3F5F7]"
                          }`}
                          onClick={(e) =>
                            handleChatClick(item?.id, item?.messages, e)
                          }
                        >
                          <div className="flex flex-col items-start justify-start w-full">
                            <span
                              className={`${
                                darkmode ? "text-white" : "text-[#141718]"
                              } text-[16px] font-semibold`}
                            >
                              {item?.title.length > 15
                                ? `${item?.title.slice(0, 15)}...`
                                : item?.title}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                darkmode ? "text-gray-300" : ""
                              } `}
                            >
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
                    {/* <div className="w-[80%]">
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
                    </div> */}
                    <div className="flex items-center justify-center">
                      <FadeLoader color="#6C7275BF" />
                    </div>
                  </>
                ) : (
                  <div className="text-[16px] font-medium text-gray-400 text-center">
                    No recents chats
                  </div>
                )}
                {ChatHistory?.data?.length > 10 &&
                  (loading ? (
                    <FadeLoader />
                  ) : (
                    <button
                      type="button"
                      className="text-sm rounded-2xl hover:bg-gray-300 border border-gray-200 w-fit py-2 px-2 flex justify-center items-center self-center"
                      onClick={() => {
                        ChatHistory?.meta?.to === ChatHistory?.meta?.total
                          ? handlePagePrev()
                          : handlePageNext();
                      }}
                    >
                      {ChatHistory?.meta?.to === ChatHistory?.meta?.total
                        ? "See less"
                        : "See more"}
                    </button>
                  ))}
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarV2;
