import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useAppSelector } from "../../hooks";
import { selectDarkmode } from "../../states/slices/globalReducer";

import ButtonV2 from "../../shared/components/buttonV2";
import {
  ICON_BOX,
  MINUS,
  PLUS,
  UPDATE_IMAGE,
} from "../../utils-func/image_exports";

import { useQuery } from "react-query";
import { getAllFAQs, getAllUpdates } from "../../services/others/service";
import moment from "moment";

function Updates() {
  const darkmode = useAppSelector(selectDarkmode);
  const [activeTab, setActiveTab] = useState("update");
  const [selectedFaq, setSelectedFaq] = useState<number | string>(0);

  const { data: updates } = useQuery("updates", getAllUpdates);
  const { data: FAQs } = useQuery("faqs", getAllFAQs);
  return (
    <div className="lg:p-10 p-5">
      <div
        className={`flex flex-col gap-y-1 border-b ${
          darkmode ? "border-[#343839]" : "border-[#E8ECEF]"
        } pb-3 lg:pt-0 pt-10`}
      >
        <span
          className={`lg:text-[40px] text-[20px] font-semibold  ${
            darkmode ? "text-white/80" : "text-black"
          }`}
        >
          Legal Documents
        </span>
        <span className="lg:text-[24px] text-lg font-normal text-[#6C7275]">
          Features, fixes & improvements.
        </span>
        <div className="flex items-center gap-x-1 mt-9 transition-all duration-300">
          <ButtonV2
            title="Updates"
            btnStyle={`w-[110px] h-[40px] ${
              activeTab === "update" && "bg-[#0084FF]"
            }  rounded-3xl`}
            textStyle={` ${
              activeTab === "update" ? "text-white" : "text-[#6C7275]"
            } `}
            handleClick={() => setActiveTab("update")}
          />
          <ButtonV2
            title="FAQ"
            btnStyle={`w-[110px] h-[40px] ${
              activeTab === "faq" && "bg-[#0084FF]"
            }  rounded-3xl`}
            textStyle={` ${
              activeTab === "faq" ? "text-white" : "text-[#6C7275]"
            } `}
            handleClick={() => setActiveTab("faq")}
          />
        </div>
      </div>
      {activeTab === "update" && (
        <div className="flex flex-col gap-y-8 w-full mt-9 h-[600px] max-h-[600px] overflow-y-scroll">
          {updates?.length > 0 &&
            updates !== undefined &&
            updates?.map(
              (item: {
                id: number | string;
                title: string;
                description: string;
                image: string;
                created_at: string;
              }) => (
                <div
                  className="flex items-start justify-between lg:flex-row flex-col"
                  key={item?.id}
                >
                  <div className="flex flex-col gap-y-3">
                    <img src={ICON_BOX} className="w-[60px] h-[60px]" alt="" />
                    <span
                      className={` ${
                        darkmode ? "text-gray-300" : "text-[#141718]"
                      } font-semibold text-[18px]`}
                    >
                      {item?.title}
                    </span>
                    <span
                      className={`${
                        darkmode ? "text-white/80" : "text-[#6C727580]"
                      } font-semibold text-[16px]`}
                    >
                      {moment(item?.created_at).format("MMM D, YYYY h:mma")}
                    </span>
                  </div>
                  <img
                    src={item.image ?? UPDATE_IMAGE}
                    className="w-[500px] h-[400.31px] rounded-2xl"
                    alt=""
                  />
                </div>
              )
            )}

          {/* <div className="flex items-start justify-between lg:flex-row flex-col">
            <div className="flex flex-col gap-y-3">
              <img src={ICON_BOX} className="w-[60px] h-[60px]" alt="" />
              <span className="text-[#141718] font-semibold text-[18px]">
                Improved Natural Language Processing (NLP) Algorithms
              </span>
              <span
                className={`${
                  darkmode ? "text-white/80" : "text-[#6C727580]"
                } font-semibold text-[16px]`}
              >
                22 Feb, 2023
              </span>
            </div>
            <img
              src={UPDATE_IMAGE}
              className="w-full h-[400.31px] rounded-2xl"
              alt=""
            />
          </div> */}
        </div>
      )}
      {activeTab === "faq" && (
        <div className="flex flex-col gap-y-8 w-full mt-9 h-[600px] max-h-[600px] overflow-y-scroll">
          {FAQs?.length > 0 &&
            FAQs !== undefined &&
            FAQs?.map(
              (item: {
                id: number | string;
                title: string;
                description: string;
              }) => (
                <div
                  className={`border-b pb-3 flex items-start gap-x-4 justify-start ${
                    darkmode && "border-[#343839]"
                  }`}
                >
                  {selectedFaq === item?.id ? (
                    <img
                      src={MINUS}
                      className="w-[21px] mt-2 cursor-pointer"
                      alt=""
                      onClick={() => setSelectedFaq(0)}
                    />
                  ) : (
                    <img
                      src={PLUS}
                      className="w-[21px] cursor-pointer"
                      alt=""
                      onClick={() => setSelectedFaq(item.id)}
                    />
                  )}
                  <div className="flex flex-col gap-y-2">
                    <span
                      className={`font-medium text-[16px] ${
                        darkmode && "text-[#6C7275]"
                      }`}
                    >
                      {item?.title}
                    </span>
                    {selectedFaq === item.id && (
                      <Fade
                        direction="down"
                        duration={500}
                        className={`text-[#939393] font-medium text-[16px]`}
                      >
                        {item.description}
                      </Fade>
                    )}
                  </div>
                </div>
              )
            )}
        </div>
      )}
    </div>
  );
}

export default Updates;
