import React from "react";
import Header from "../../shared/components/header";
import Footer from "../../shared/components/footer";
import ButtonV2 from "../../shared/components/buttonV2";
import { ALL_LOGO, UI } from "../../utils-func/image_exports";
import Features from "./UIs/features";
import HowItWorks from "./UIs/howitworks";

function LandingPage() {
  return (
    <>
      <Header />
      <div
        className="h-[700px] relative w-full flex items-center py-5 flex-col gap-y-4 justify-start"
        style={{
          background: "linear-gradient(180deg, #007AFF 0%, #0A0449 100%)",
        }}
      >
        <span className="text-[64px] leading-[60px] text-center font-semibold text-white">
          AI-Powered Case <br /> Management for Judges
        </span>
        <span className="text-xl font-normal text-white text-center">
          Discover intelligent tools that simplify your <br /> workload and
          enhance your decision-making
        </span>
        <ButtonV2
          title={"Get Started Today"}
          btnStyle={"bg-white rounded-xl py-4 w-[218.82px] h-[60.37px]"}
          textStyle={"text-[#0A0449] font-semibold"}
          handleClick={function (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
        <img
          src={UI}
          className="w-[1154px] h-[718px] object-contain absolute top-96"
          alt=""
        />
      </div>
      <div className="mt-[30rem] flex items-center justify-center flex-col">
        <span className="text-xl font-semibold text-[#C4C4C4]">
          Trusted By Well-known Public and Private Legal Firms
        </span>
        <img
          src={ALL_LOGO}
          className="w-full h-[115.36px] object-contain"
          alt=""
        />
      </div>
      <div>
        <Features />
        <HowItWorks />
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
