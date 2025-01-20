import React from "react";
import { ARROW_POINTER, WOMAN } from "../../../utils-func/image_exports";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { swiperData } from "../../../constants";
function HowItWorks() {
  return (
    <div className="px-16 mt-20">
      <div className="flex items-start justify-between">
        <img
          src={WOMAN}
          className="w-[702px] h-[373px] object-cover"
          style={{ borderRadius: "30px" }}
          alt=""
        />
        <div className="flex flex-col gap-y-20 items-end">
          <div className="flex items-end w-[365px] justify-end gap-y-3 flex-col">
            <span className="text-[49px] font-medium">How It Works</span>
            <span className="text-xl font-normal text-end">
              The entire process is easy, get <br /> started with using the
              platform
            </span>
          </div>
          <img
            src={ARROW_POINTER}
            className="w-[100px] h-[100px] object-cover"
            alt=""
          />
        </div>
      </div>
      <div className="mt-20">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          breakpoints={{
            1024: { slidesPerView: 4 }, // For desktop
            640: { slidesPerView: 3 }, // For tablets
            320: { slidesPerView: 1 }, // For mobile
          }}
          //   navigation= {
          //     {
          //         nextEl: ".custom-next-button",
          //         prevEl: ".custom-prev-button"
          //     }
          //   }
        >
          {swiperData.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-[300px] h-[300px] p-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(105, 92, 224, 0.2) -29.5%, rgba(255, 255, 255, 0) 100%)",
                }}
              >
                <div className="flex flex-col gap-y-2 items-center">
                  <span className="text-[#464646] text-center font-bold text-lg">
                    {item.title}
                  </span>
                  <span className="text-center">{item.para}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HowItWorks;
