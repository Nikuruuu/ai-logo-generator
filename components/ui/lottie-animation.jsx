import React from "react";
import Lottie from "lottie-react";
import animationData from "@/public/animations/loading-custom.json";

const LottieAnimation = () => {
  return (
    <div className="w-100 h-100">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieAnimation;
