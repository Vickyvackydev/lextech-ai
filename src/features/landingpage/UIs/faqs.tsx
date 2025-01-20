import React, { useState } from "react";
import { FAQs } from "../../../constants";
import { ARROW_RIGHT_UP } from "../../../utils-func/image_exports";
import { Fade } from "react-awesome-reveal";

function Faqs() {
  const [selectedFaq, setSelectedFaq] = useState(0);
  return (
    <div className="p-28">
      <div className="bg-[#0055FE14] p-10 rounded-2xl flex items-start justify-between">
        <span className="text-[56px] font-medium text-[#0B001A]">FAQs</span>
        <div className="min-w-[715px] border-t border-[#17003466] pt-4 flex flex-col gap-y-5">
          {FAQs.map((item) => (
            <div
              key={item.id}
              className="min-w-[715px] flex items-center border-b border-[#17003466]  justify-between"
            >
              <div className="flex items-start flex-col gap-y-1">
                <span className="text-lg text-[#0B001A] font-medium">
                  {item.question}
                </span>
                {selectedFaq === item.id && (
                  <Fade
                    direction="down"
                    duration={1000}
                    className="w-[715px] text-sm font-normal text-[#0B001A]"
                  >
                    {item.answer}
                  </Fade>
                )}
              </div>
              <img
                src={ARROW_RIGHT_UP}
                className={`w-[40px] h-[36px] transition-all duration-500 cursor-pointer ${
                  selectedFaq === item.id ? "rotate-90" : ""
                }`}
                onClick={() => {
                  selectedFaq === item.id
                    ? setSelectedFaq(0)
                    : setSelectedFaq(item.id);
                }}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
