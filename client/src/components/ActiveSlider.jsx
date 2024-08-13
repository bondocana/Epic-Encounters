import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { FaArrowRight } from "react-icons/fa";
import "./styles/activeSlider.css";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { setPosts } from "../state/authSlice.js";
import { useNavigate } from "react-router-dom";

const ActiveSlider = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const navigate = useNavigate();

  const truncatedString = (str) => {
    return str.length > 40 ? `${str.substring(0, 40)}...` : str;
  };

  const getUserCountyPosts = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/county`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  }, [userId, token, dispatch]);

  useEffect(() => {
    getUserCountyPosts();
  }, [getUserCountyPosts]);

  return (
    <div className="active-slider">
      <div>
        <Swiper
          className="custom-swiper"
          breakpoints={{
            340: {
              slidesPerView: 6,
              spaceBetween: 4,
            },
            700: {
              slidesPerView: 6,
              spaceBetween: 4,
            },
          }}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          // loop={true}
          // autoplay={{
          //   delay: 0,
          //   disableOnInteraction: false,
          // }}
          // speed={10000}
          modules={[FreeMode, Pagination, Autoplay]}
        >
          {posts.length > 0 &&
            posts.map((item, index) => (
              <SwiperSlide key={index}>
                {/* <div className="flex flex-col gap-6 mb-20 group relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[215px] lg:h-[400px] lg:w-[350px] overflow-hidden cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.backgroundImage})` }}
                ></div>
                <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-50" />
                <div className="relative flex flex-col gap-3">
                  <item.icon className="text-blue-600 group-hover:text-blue-400 w-[32px] h-[32px]" />
                  <h1 className="text-xl lg:text-2xl">{item.title} </h1>
                  <p className="lg:text-[18px]">{item.content} </p>
                </div>
                <RxArrowTopRight className="absolute bottom-5 left-5 w-[35px] h-[35px] text-white group-hover:text-blue-500 group-hover:rotate-45 duration-100" />
              </div> */}
                <div
                  className="card"
                  onClick={() => {
                    navigate(`/post/${item._id}`);
                  }}
                  style={{
                    backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                  }}
                >
                  <div className="card-content">
                    {/* Placeholder for icon */}
                    <h2>{item.title}</h2>
                    <p>{truncatedString(item.description)}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          <br></br>
        </Swiper>
      </div>
    </div>
  );
};

export default ActiveSlider;
