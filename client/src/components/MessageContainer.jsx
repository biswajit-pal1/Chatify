import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
} from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip, MdDownload } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

function MessageContainer() {
  const scrollRef = useRef(null);

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState("file");

  // ---------------- FETCH MESSAGES ----------------
  useEffect(() => {
    if (!selectedChatData?._id) return;

    const fetchMessages = async () => {
      try {
        let response;
        if (selectedChatType === "contact") {
          response = await apiClient.post(
            GET_ALL_MESSAGES_ROUTE,
            { id: selectedChatData._id },
            { withCredentials: true },
          );
        } else {
          response = await apiClient.get(
            `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
            { withCredentials: true },
          );
        }

        if (response?.data?.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [selectedChatData?._id, selectedChatType, setSelectedChatMessages]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // ---------------- HELPERS ----------------
  const checkIfImage = (url) =>
    /\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg|heic|heif)$/i.test(url);

  const downloadFile = async (url, originalName = "file") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ---------------- RENDER ----------------
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="flex items-center justify-center my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative z-10 px-4 text-xs font-medium text-white/40 uppercase tracking-widest bg-[#1c1d25]">
                {moment(message.timeStamp).format("LL")}
              </span>
            </div>
          )}

          {selectedChatType === "contact"
            ? renderDMMessages(message)
            : renderChannelMessages(message)}
        </div>
      );
    });
  };

  // ---------------- DM MESSAGES ----------------
  const renderDMMessages = (message) => {
    const isMe = message.sender !== selectedChatData._id;

    const fileUrl = message.file?.url;
    const originalName = message.file?.originalName || "file";

    const containerClass = isMe ? "justify-end" : "justify-start";
    const bubbleClass = isMe
      ? "bg-[#8b5cf6] text-white rounded-2xl rounded-tr-sm"
      : "bg-[#2a2b2f] text-gray-100 border border-white/5 rounded-2xl rounded-tl-sm";

    return (
      <div className={`flex w-full mb-4 ${containerClass}`}>
        <div
          className={`flex flex-col max-w-[70%] ${
            isMe ? "items-end" : "items-start"
          }`}
        >
          {/* TEXT MESSAGE */}
          {message.messageType === "text" && (
            <div
              className={`${bubbleClass} px-5 py-3 shadow-md relative group wrap-break-word`}
            >
              <div className="pr-8 pb-1 text-[15px] leading-relaxed">
                {message.content}
              </div>
              <span
                className={`text-[9px] absolute bottom-2 right-3 ${
                  isMe ? "text-white/70" : "text-gray-400"
                }`}
              >
                {moment(message.timeStamp).format("LT")}
              </span>
            </div>
          )}

          {/* FILE MESSAGE */}
          {message.messageType === "file" && fileUrl && (
            <div className={`${bubbleClass} p-2 shadow-sm overflow-hidden`}>
              {checkIfImage(fileUrl) ? (
                <div
                  className="relative group rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(fileUrl);
                    setImageName(originalName);
                  }}
                >
                  <img
                    src={fileUrl}
                    alt={originalName}
                    className="max-w-70 max-h-75 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      View
                    </span>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                    {moment(message.timeStamp).format("LT")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-2 min-w-50">
                  <div className="bg-black/20 p-3 rounded-lg text-purple-200">
                    <MdFolderZip className="text-2xl" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium w-30">
                      {originalName}
                    </span>
                    <span className="text-[10px] text-white/50">
                      {moment(message.timeStamp).format("LT")}
                    </span>
                  </div>
                  <div
                    className="ml-auto p-2 hover:bg-black/20 rounded-full cursor-pointer transition-colors"
                    onClick={() => downloadFile(fileUrl, originalName)}
                  >
                    <IoMdArrowRoundDown />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------- CHANNEL MESSAGES ----------------
  const renderChannelMessages = (message) => {
    const isOwnMessage = message.sender._id === userInfo.id;
    const fileUrl = message.file?.url;
    const originalName = message.file?.originalName || "file";

    const containerClass = isOwnMessage ? "justify-end" : "justify-start";

    const bubbleClass = isOwnMessage
      ? "bg-[#8b5cf6] text-white rounded-2xl rounded-tr-sm"
      : "bg-[#2a2b2f] text-gray-100 border border-white/5 rounded-2xl rounded-tl-sm";

    return (
      // CHANGE 1: Changed items-end to items-start to align avatar to top
      <div className={`flex w-full mb-6 ${containerClass} gap-3 items-start`}>
        {!isOwnMessage && (
          // CHANGE 2: Added mt-1 for precise alignment with the name
          <Avatar className="h-8 w-8 mt-1 shadow-lg ring-2 ring-white/5 cursor-pointer hover:scale-110 transition-transform">
            {message.sender.image?.url ? (
              <AvatarImage
                src={message.sender.image.url}
                className="object-cover"
              />
            ) : (
              <AvatarFallback
                className={`text-xs font-bold ${getColor(
                  message.sender.color,
                )} text-white`}
              >
                {message.sender.firstName?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
        )}

        <div
          className={`flex flex-col max-w-[70%] ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {/* Sender Name */}
          {!isOwnMessage && (
            <span className="text-[11px] text-gray-400 ml-1 mb-1 font-medium">
              {message.sender.firstName} {message.sender.lastName}
            </span>
          )}

          {/* TEXT */}
          {message.messageType === "text" && (
            <div className={`${bubbleClass} px-5 py-3 shadow-md relative`}>
              <div className="pr-8 pb-1 text-[15px] leading-relaxed">
                {message.content}
              </div>
              <span
                className={`text-[9px] absolute bottom-2 right-3 ${
                  isOwnMessage ? "text-white/70" : "text-gray-400"
                }`}
              >
                {moment(message.timeStamp).format("LT")}
              </span>
            </div>
          )}

          {/* FILE */}
          {message.messageType === "file" && fileUrl && (
            <div className={`${bubbleClass} p-2 shadow-sm overflow-hidden`}>
              {checkIfImage(fileUrl) ? (
                <div
                  className="relative group rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(fileUrl);
                    setImageName(originalName);
                  }}
                >
                  <img
                    src={fileUrl}
                    alt={originalName}
                    className="max-w-70 max-h-75 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 text-[9px] text-white/90 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                    {moment(message.timeStamp).format("LT")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-2 min-w-50">
                  <div className="bg-black/20 p-3 rounded-lg text-purple-200">
                    <MdFolderZip className="text-2xl" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium w-30">
                      {originalName}
                    </span>
                    <span className="text-[10px] text-white/50">
                      {moment(message.timeStamp).format("LT")}
                    </span>
                  </div>
                  <div
                    className="ml-auto p-2 hover:bg-black/20 rounded-full cursor-pointer transition-colors"
                    onClick={() => downloadFile(fileUrl, originalName)}
                  >
                    <IoMdArrowRoundDown />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
      {renderMessages()}
      <div ref={scrollRef} />

      {showImage && imageUrl && (
        <div
          className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowImage(false)}
        >
          <div className="absolute top-5 right-5 flex gap-4">
            <button
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(imageUrl, imageName);
              }}
            >
              <MdDownload className="text-xl" />
            </button>
            <button
              className="p-3 bg-white/10 rounded-full hover:bg-red-500/80 transition-all text-white"
              onClick={() => setShowImage(false)}
            >
              <IoCloseSharp className="text-xl" />
            </button>
          </div>

          <img
            src={imageUrl}
            alt={imageName}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl border border-white/5"
          />
          <span className="mt-4 text-white/60 text-sm font-medium tracking-wide">
            {imageName}
          </span>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
