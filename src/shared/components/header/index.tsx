import React from "react";
import { LANDING_LOGO } from "../../../utils-func/image_exports";
import ButtonV2 from "../buttonV2";

function Header() {
  return (
    <div className="w-full  bg-[#0055FE] h-full py-10 px-28 flex items-center justify-between">
      <img src={LANDING_LOGO} className="w-[221px] h-[41px]" alt="" />
      <div className="flex items-center gap-x-10 w-fit">
        <span className="text-lg font-semibold text-white">Features</span>
        <svg
          width="2"
          height="17"
          viewBox="0 0 2 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path opacity="0.5" d="M1 0.5V16.5" stroke="white" />
        </svg>
        <span className="text-lg font-semibold text-white">How it works</span>
        <svg
          width="2"
          height="17"
          viewBox="0 0 2 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path opacity="0.5" d="M1 0.5V16.5" stroke="white" />
        </svg>
        <ButtonV2
          title={"Get started"}
          btnStyle={"bg-[#0A0449] w-[134px] h-full rounded-xl py-4"}
          textStyle={"text-[#FEFEFE] font-semibold"}
          handleClick={function (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}

export default Header;
