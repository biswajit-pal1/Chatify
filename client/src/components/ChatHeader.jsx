import { useAppStore } from "@/store";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { FaHashtag } from "react-icons/fa";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  // Prevent rendering glitch if data not ready
  if (!selectedChatData) return null;

  const imageUrl =
    selectedChatType === "contact" ? selectedChatData?.image?.url : null;

  return (
    <div className="h-[10vh] border-b border-white/5 bg-[#1c1d25] flex items-center justify-between px-6 sm:px-8 backdrop-blur-xl z-20 relative">
      <div className="flex gap-4 items-center w-full">
        {/* AVATAR SECTION */}
        <div className="relative">
          {selectedChatType === "contact" ? (
            <Avatar
              key={selectedChatData?._id} // 🔥 Prevents avatar reuse glitch
              className="h-12 w-12 rounded-full border border-white/10 shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {imageUrl ? (
                <AvatarImage
                  src={imageUrl}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full font-bold text-white ${getColor(
                    selectedChatData?.color,
                  )}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData.firstName[0]
                    : selectedChatData?.email?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
          ) : (
            // Channel Icon
            <div
              key={selectedChatData?._id}
              className="bg-linear-to-br from-[#2a2b2f] to-[#1c1d25] h-12 w-12 flex items-center justify-center rounded-full border border-white/5 shadow-md"
            >
              <FaHashtag className="text-purple-500 text-lg" />
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div className="flex flex-col justify-center">
          <span className="text-lg font-semibold text-white/90 tracking-tight truncate max-w-50 sm:max-w-100">
            {selectedChatType === "channel" && selectedChatData?.name}

            {selectedChatType === "contact" &&
              (selectedChatData?.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName || ""}`
                : selectedChatData?.email)}
          </span>

          {/* Subtitle for Contact */}
          {selectedChatType === "contact" && selectedChatData?.firstName && (
            <span className="text-xs text-neutral-400 font-medium tracking-wide truncate max-w-50">
              {selectedChatData?.email}
            </span>
          )}
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <div className="flex items-center justify-center">
        <button
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300 ease-in-out"
          onClick={closeChat}
          title="Close Chat"
        >
          <RiCloseFill className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
