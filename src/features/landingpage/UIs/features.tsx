import React from "react";
import {
  CAPTION,
  HOMEPAGE,
  LOOKING,
  UPLOAD_DOC,
} from "../../../utils-func/image_exports";

function Features() {
  return (
    <div className="flex items-center flex-col justify-center mt-4">
      <div className="flex flex-col items-center gap-y-5">
        <span className="text-[56px] font-medium leading-[60px] text-center">
          Features that work <br /> for Your Litigation
        </span>
        <span className="text-xl font-normal text-center">
          Check out our amazing features and <br /> experience AI yourself.
        </span>
      </div>
      <div className="mt-10 flex flex-col gap-y-5">
        <div className="flex items-center gap-x-4">
          <Cards
            width="w-[609.36px]"
            para="Quickly access relevant cases and streamline your research with our robust search functionality."
            title="Advanced Search with History"
            bgImg={LOOKING}
            imgSize=""
          />
          <Cards
            width="w-[609.36px]"
            para="Organize all your case documents in one secure place for easy access."
            title="Document Uploads"
            bgImg={UPLOAD_DOC}
            imgSize={""}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <Cards
            width="w-[388]"
            para="Convert your spoken words into accurate text for effortless documentation."
            title="Speech-to-Text Capabilities"
            bgImg={null}
            imgSize={""}
          />
          <Cards
            width="w-full"
            para="Receive real-time captions during proceedings to ensure you never miss a detail."
            title="Live Captions"
            bgImg={CAPTION}
            imgSize={"w-[552.36px] h-[282.54px]"}
          />
        </div>
        <Cards
          width="w-full"
          para="Get tailored suggestions and comprehensive case analysis to support your decision-making."
          title="AI-Driven Insights"
          bgImg={HOMEPAGE}
          imgSize={"w-[760.44px] h-[491.56px] -bottom-[124px]"}
        />
      </div>
    </div>
  );
}

export default Features;

export const Cards = ({
  width,
  bgImg,
  title,
  para,
  imgSize,
}: {
  width: string;
  bgImg: string | null;
  title: string;
  para: string;
  imgSize: string;
}) => {
  return (
    <div
      className={`h-[346.31px] relative ${
        width || "w-[400px]"
      } rounded-xl shadow bg-gradient-to-br from-white/80 via-white/60 to-[#0055FE]/50 `}
    >
      <div className="flex items-start flex-col gap-y-4 w-[330.46px] p-5">
        <span className="text-[28.96px] font-bold text-black leading-tight">
          {title}
        </span>
        <p className="text-[19.31px] text-[#333333CC]">{para}</p>
      </div>
      {bgImg && (
        <img
          src={bgImg}
          className={` ${
            imgSize || "w-[359.97px] h-[261.55px]"
          } object-contain absolute right-0 -bottom-5`}
          alt=""
        />
      )}
    </div>
  );
};
