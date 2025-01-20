import React from "react";
import ButtonV2 from "../buttonV2";
import { LEXTECH_AI_LOGO, USER_IVON } from "../../../utils-func/image_exports";

function Footer() {
  return (
    <footer className="w-full lg:max-w-[1440px] bg-black lg:px-10 px-5 py-10 flex lg:flex-row flex-col lg:items-center mx-auto items-start lg:gap-x-0 gap-y-12 justify-between">
      <div className="flex flex-col items-start gap-y-7">
        <img src={LEXTECH_AI_LOGO} className="w-[221px] h-[100px]" alt="" />
        <span className="text-[#6C7574] font-medium text-[16px] w-[287.75px] break-words">
          LexTech assistant is a platform created to analyze legal databases,
          statutes, and case law to provide judges and lawyers with relevant
          information and potential arguments.
        </span>
      </div>
      <div>
        <span className="text-white font-normal text-[26.14px]">
          Useful links
        </span>
        <ul className="flex flex-col items-start gap-y-5 mt-5 text-[15.38px] font-normal text-[#6C7574]">
          <li className="hover:text-primary-200 cursor-pointer transition-all duration-300 hover:font-semibold">
            Features
          </li>

          <li className="hover:text-primary-200 cursor-pointer transition-all duration-300 hover:font-semibold">
            How it works
          </li>
          <li className="hover:text-primary-200 cursor-pointer transition-all duration-300 hover:font-semibold">
            Contact us
          </li>
          <li className="hover:text-primary-200 cursor-pointer transition-all duration-300 hover:font-semibold">
            Get started
          </li>
        </ul>
      </div>
      <div>
        <span className="text-white font-normal text-[26.14px]">
          Company information
        </span>
        <div className="flex flex-col items-start gap-y-5 mt-5">
          <div className="flex items-center gap-x-3">
            <svg
              width="28"
              height="27"
              viewBox="0 0 28 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.86464 13.0821L19.6883 7.14092C20.1075 7.0012 20.5605 7.22773 20.7002 7.64689C20.755 7.8111 20.755 7.98864 20.7002 8.15285L14.759 25.9765C14.6193 26.3957 14.1662 26.6222 13.7471 26.4825C13.5419 26.4141 13.3731 26.2655 13.2793 26.0706L9.53894 18.3022L1.77057 14.5619C1.37248 14.3702 1.20515 13.8921 1.39682 13.494C1.49066 13.2991 1.65943 13.1506 1.86464 13.0821Z"
                fill="#ffffff"
              />
            </svg>

            <span className="text-[#6C7574] font-normal text-[17.3px]">
              A4, Justice Coker Estate, Alausa, Lagos State
            </span>
          </div>
          <div className="flex items-center gap-x-3">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.575 22.0396C6.175 22.0396 2.85 18.2396 2.85 13.4146C2.85 7.71465 7.375 3.88965 12.525 3.88965C17.45 3.88965 21.125 6.91465 21.125 11.6896C21.125 16.0396 18.825 17.7646 16.525 17.7646C15.4 17.7646 14.475 17.2396 14.075 16.4896C13.3 17.2396 12.125 17.7146 11 17.7146C8.25 17.7146 6.85 15.7646 6.85 13.4146C6.85 10.3896 9.05 7.93965 12.275 7.93965C13.2 7.93965 13.95 8.18965 14.525 8.61465L14.625 8.18965H17L15.825 13.6896C15.6 14.7896 15.85 15.6646 16.925 15.6646C18.25 15.6646 19.025 14.5646 19.025 11.6396C19.025 7.73965 15.95 5.91465 12.5 5.91465C8.625 5.91465 5.05 8.58965 5.05 13.4146C5.05 17.3646 7.575 19.9396 11.575 19.9396C13.075 19.9396 14.625 19.6146 15.975 18.9146L16.8 20.9396C15.25 21.6397 13.2 22.0396 11.575 22.0396ZM11.4 15.3646C12.05 15.3646 12.7 15.1896 13.225 14.6646L14.025 10.9646C13.575 10.4896 12.925 10.2646 12.3 10.2646C10.65 10.2646 9.45 11.5396 9.45 13.2146C9.45 14.5146 10.075 15.3646 11.4 15.3646Z"
                fill="#ffffff"
              />
            </svg>

            <span className="text-[#6C7574] font-normal text-[17.3px]">
              contact@lextechgroup.com
            </span>
          </div>
          <div className="flex items-center gap-x-3">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.9149 14.7823L14.1189 12.5783C14.7276 11.9696 14.8785 11.0397 14.4935 10.2697L14.3686 10.0199C13.9837 9.24994 14.1346 8.32 14.7433 7.71128L17.4761 4.97848C17.6714 4.78322 17.9879 4.78322 18.1832 4.97848C18.2212 5.01648 18.2528 5.06036 18.2769 5.10842L19.3808 7.31638C20.2254 9.00549 19.8943 11.0455 18.559 12.3809L12.5602 18.3797C11.1066 19.8332 8.95659 20.3408 7.00646 19.6907L4.59198 18.8859C4.33001 18.7986 4.18843 18.5154 4.27576 18.2535C4.3003 18.1798 4.34166 18.1129 4.39654 18.058L7.04782 15.4068C7.65654 14.798 8.58648 14.6471 9.35646 15.0321L9.60622 15.157C10.3762 15.542 11.3061 15.3911 11.9149 14.7823Z"
                fill="#ffffff"
              />
            </svg>

            <span className="text-[#6C7574] font-normal text-[17.3px]">
              (+234) 802 312 7524
            </span>
          </div>
          <ButtonV2
            title="Talk to a consultant"
            image={USER_IVON}
            btnStyle="bg-[#0D0769] rounded-3xl w-[186.05px] h-[44.81px]  flex justify-center items-center gap-3 flex-row-reverse"
            textStyle="text-white font-bold text-sm"
            handleClick={() => {}}
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
