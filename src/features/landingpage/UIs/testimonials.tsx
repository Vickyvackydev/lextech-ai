import React, { useState } from "react";
import {
  ARROW_GREY,
  ARROW_WHITE,
  WOMAN,
} from "../../../utils-func/image_exports";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
function Testimonials() {
  const [btnHovered, setBtnHovered] = useState(false);
  const [btn2Hovered, setBtn2Hovered] = useState(false);
  return (
    <div className="px-16 mt-20">
      <div className="flex items-center justify-between">
        <span className="text-[56px] font-medium">
          What Our Client Said about us
        </span>
        <div className="flex items-center gap-x-7">
          <div
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            className={`custom-next-button flex items-center  w-[85px] h-[85px] rounded-full justify-center ${
              btnHovered ? "bg-[#007AFF]" : "bg-[#F8F9FF]"
            }`}
          >
            <img
              src={btnHovered ? ARROW_WHITE : ARROW_GREY}
              className={` w-[24.5px] h-[21.44px] ${
                btnHovered && "scale-x-[-1]"
              } `}
              alt=""
            />
          </div>
          <div
            onMouseEnter={() => setBtn2Hovered(true)}
            onMouseLeave={() => setBtn2Hovered(false)}
            className={`custom-prev-button flex items-center  w-[85px] h-[85px] rounded-full justify-center ${
              btn2Hovered ? "bg-[#007AFF]" : "bg-[#F8F9FF]"
            }`}
          >
            <img
              src={btn2Hovered ? ARROW_WHITE : ARROW_GREY}
              className={` w-[24.5px] h-[21.44px] ${
                btn2Hovered && "scale-x-[1]"
              }  scale-x-[-1]`}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          breakpoints={{
            1024: { slidesPerView: 3 }, // For desktop
            640: { slidesPerView: 2 }, // For tablets
            320: { slidesPerView: 1 }, // For mobile
          }}
          spaceBetween={20}
          navigation={{
            nextEl: ".custom-next-button",
            prevEl: ".custom-prev-button",
          }}
        >
          {[1, 2, 3, 4, 5].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full p-7 rounded-xl hover:bg-[#0055FE14] bg-[#F8F9FF]">
                <div className="flex items-start gap-x-3">
                  <div className="w-[60px] h-[60px] rounded-full">
                    <img
                      src={WOMAN}
                      className="w-full h-full object-cover "
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col -gap-y-1">
                    <span className="text-[25px] font-semibold">
                      Amelia Joseph
                    </span>
                    <span className="text-lg font-normal">Chief Manager</span>
                  </div>
                </div>
                <p className="text-[#000000CC] font-normal text-[16px] mt-5">
                  My vision came alive effortlessly. Their blend of casual and
                  professional approach made the process a breeze. Creativity
                  flowed, and the results were beyond my expectations.
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonials;
