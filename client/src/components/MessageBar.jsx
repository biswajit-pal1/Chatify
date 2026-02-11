import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

function MessageBar() {
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useSocket();

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // ---------------- EMOJI OUTSIDE CLICK ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- EMOJI ADD ----------------
  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  // ---------------- SEND TEXT MESSAGE ----------------
  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        channelId: selectedChatData._id,
      });
    }

    setMessage("");
  };

  // ---------------- ATTACHMENT CLICK ----------------
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // ---------------- FILE UPLOAD ----------------
  const handleAttachmentChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      setIsUploading(true);
      setFileUploadProgress(0);

      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setFileUploadProgress(percent);
          }
        },
      });

      if (response.status === 200) {
        const { fileUrl, publicId } = response.data || {};

        if (!fileUrl || !publicId) {
          throw new Error("Invalid upload response from server");
        }

        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            messageType: "file",
            file: {
              url: fileUrl,
              publicId,
              originalName: response.data.originalName,
              mimeType: response.data.mimeType,
              size: response.data.size,
            },
          });
        } else if (selectedChatType === "channel") {
          socket.emit("send-channel-message", {
            sender: userInfo.id,
            channelId: selectedChatData._id,
            messageType: "file",
            file: {
              url: fileUrl,
              publicId,
              originalName: response.data.originalName,
              mimeType: response.data.mimeType,
              size: response.data.size,
            },
          });
        }
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setIsUploading(false);
      setFileUploadProgress(0);
      event.target.value = ""; // IMPORTANT: reset file input
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="w-full bg-[#1c1d25] flex items-center px-3 py-3 sm:px-8 sm:py-4 gap-3 sm:gap-4 border-t border-white/5">
      {/* INPUT CONTAINER */}
      <div className="flex-1 flex bg-[#2a2b2f] rounded-full items-center gap-3 sm:gap-5 pr-3 pl-4 sm:pr-5 sm:pl-5 py-3 sm:py-4 border border-white/5 focus-within:border-[#8417ff]/50 focus-within:bg-[#2a2b2f]/80 transition-all duration-300 shadow-lg min-w-0">
        {/* Attachment Button */}
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-400 hover:text-purple-400 transition-all duration-300 hover:scale-110 shrink-0"
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Text Input */}
        <input
          type="text"
          className="flex-1 bg-transparent text-base sm:text-lg focus:outline-none text-white/90 placeholder:text-white/30 font-medium min-w-0"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {/* Emoji Button */}
        <div className="relative flex items-center shrink-0">
          <button
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
            className={`transition-all duration-300 hover:scale-110 ${
              emojiPickerOpen
                ? "text-purple-500"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>

          {emojiPickerOpen && (
            <div
              className="absolute bottom-16 right-0 sm:bottom-20 shadow-2xl rounded-2xl overflow-hidden border border-white/10 z-50"
              ref={emojiRef}
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
                searchDisabled={false}
                width={280} // smaller for mobile
                height={350}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
      </div>

      {/* SEND BUTTON */}
      <button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        className={`p-3 sm:p-5 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center shrink-0
          ${
            message.trim()
              ? "bg-linear-to-r from-[#8417ff] to-[#741bda] text-white hover:scale-105 hover:shadow-purple-500/30 cursor-pointer"
              : "bg-[#2a2b2f] text-white/30 cursor-default border border-white/5"
          }
        `}
      >
        <IoSend className="text-xl sm:text-2xl" />
      </button>
    </div>
  );
  
}

export default MessageBar;
