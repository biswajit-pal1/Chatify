import { animationDefaultOptions } from "@/lib/utils";
import React from "react";
import Lottie from "react-lottie";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative overflow-hidden">
      {/* Background Glow Effect (Subtle) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Lottie Animation */}
      <div className="relative z-10">
        <Lottie
          isClickToPauseDisabled={true}
          height={200}
          width={200}
          options={animationDefaultOptions}
        />
      </div>

      {/* Text Content */}
      <div className="text-opacity-80 text-white flex flex-col gap-2 items-center mt-6 lg:text-4xl text-3xl transition-all duration-300 text-center z-10">
        <h3 className="poppins-medium font-semibold">
          Hi<span className="text-purple-500">!</span> Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600 font-bold">
            Chatify
          </span>
        </h3>

        {/* Subtitle */}
        <p className="text-base text-white/40 font-normal mt-2 max-w-xs md:max-w-md">
          Select a chat from the sidebar or start a new conversation to get
          connected.
        </p>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
