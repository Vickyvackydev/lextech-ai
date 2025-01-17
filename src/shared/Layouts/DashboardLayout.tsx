/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect, useState } from "react";

import SidebarV2 from "../components/Sidebar/sidebarV2";
import { FaBars, FaEllipsisV } from "react-icons/fa";
import { useAppSelector, useMediaQuery } from "../../hooks";
import { selectDarkmode } from "../../states/slices/globalReducer";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkmode = useAppSelector(selectDarkmode);
  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const [isSideNavVisible, setSideNavVisible] = useState(false);
  const [sidebarV2Visible, setSidebarV2Visible] = useState(false);

  useEffect(() => {
    if (isMobileView) {
      setSideNavVisible(false);
      setSidebarV2Visible(false);
    } else {
      setSideNavVisible(false);
      setSidebarV2Visible(false);
    }
  }, [isMobileView]);
  return (
    <div className="h-screen w-full overflow-hidden lg:flex">
      {isMobileView || isTabletView ? (
        <div
          className={`fixed bottom-0 left-0 top-0 z-20 w-full bg-gray-800/60 ${
            isSideNavVisible || sidebarV2Visible ? "" : "hidden"
          }`}
          onClick={() => {
            isSideNavVisible
              ? setSideNavVisible(false)
              : setSidebarV2Visible(false);
          }}
        />
      ) : null}

      {isMobileView && (
        <div
          className={`w-full  ${
            darkmode ? "bg-[#232627]" : "bg-white"
          } shadow-md flex items-center justify-between p-5 absolute z-30`}
        >
          <div className="flex items-center gap-x-2">
            <div
              className={`flex items-center justify-center rounded-full w-[40px] h-[40px] ${
                darkmode ? "bg-white/20" : "bg-[#fbfcfe]"
              }`}
              onClick={() => setSideNavVisible(true)}
            >
              <FaBars
                className={`${darkmode ? "text-gray-300" : "text-black"}`}
              />
            </div>
            <span className={`${darkmode ? "text-gray-300" : "text-black"}`}>
              LexTech Ai.0
            </span>
          </div>
          <div
            onClick={() => setSidebarV2Visible(true)}
            className={`flex items-center justify-center rounded-full w-[40px] h-[40px] ${
              darkmode ? "bg-white/20" : "bg-[#fbfcfe]"
            }`}
          >
            <FaEllipsisV
              className={`${darkmode ? "text-gray-300" : "text-black"}`}
            />
          </div>
        </div>
      )}
      <Sidebar
        {...{
          open: isSideNavVisible,
          setOpen: setSideNavVisible,
          onClose: () => setSideNavVisible(false),
        }}
      />

      <div
        className={`[@media(max-width:767px)]:scrollbar-hide h-screen overflow-auto ${
          darkmode ? "bg-[#141718]" : "bg-[#fbfcfe] "
        } lg:pb-20 lg:w-[2100px] :w-full lg:mt-0 mt-10`}
      >
        {children}
      </div>

      <SidebarV2
        {...{
          v2Open: sidebarV2Visible,
          v2OnClose: () => setSidebarV2Visible(false),
          setV2Open: setSidebarV2Visible,
        }}
      />
    </div>
  );
}
