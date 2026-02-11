import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { FaHashtag } from "react-icons/fa";

function ContactList({ contacts, isChannel = false }) {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5 flex flex-col gap-1">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`relative flex items-center gap-4 p-3 mx-2 rounded-lg transition-all duration-300 cursor-pointer ease-in-out
            ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#2f303b] border-l-4 border-[#8417ff] text-white shadow-md" // Lighter Gray with Purple Accent Border
                : "text-neutral-400 hover:bg-[#2a2b2f] hover:text-white hover:translate-x-1"
            }`}
          onClick={() => handleClick(contact)}
        >
          {/* ---------------- AVATAR / ICON SECTION ---------------- */}
          <div className="relative shrink-0">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-white/10 shadow-sm">
                {contact.image ? (
                  <AvatarImage
                    src={contact.image.url}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`${
                      selectedChatData && selectedChatData._id === contact._id
                        ? "bg-[#8417ff] text-white border-none" // Highlight avatar when active
                        : `${getColor(contact.color)}`
                    } uppercase h-10 w-10 text-lg border flex items-center justify-center rounded-full transition-all duration-300`}
                  >
                    {contact.firstName
                      ? contact.firstName[0]
                      : contact.email[0]}
                  </div>
                )}
              </Avatar>
            )}

            {isChannel && (
              <div
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  selectedChatData && selectedChatData._id === contact._id
                    ? "bg-[#8417ff] text-white shadow-md"
                    : "bg-[#1c1d25] border border-white/10 text-neutral-400"
                }`}
              >
                <FaHashtag className="text-sm" />
              </div>
            )}
          </div>

          {/* ---------------- NAME SECTION ---------------- */}
          <div className="flex flex-col flex-1 min-w-0">
            {isChannel ? (
              <span
                className={`capitalize font-medium truncate tracking-wide text-sm ${
                  selectedChatData && selectedChatData._id === contact._id
                    ? "text-white font-semibold"
                    : "text-neutral-400 group-hover:text-white"
                }`}
              >
                {contact.name}
              </span>
            ) : (
              <span
                className={`capitalize font-medium truncate tracking-wide text-sm ${
                  selectedChatData && selectedChatData._id === contact._id
                    ? "text-white font-semibold"
                    : "text-neutral-400 group-hover:text-white"
                }`}
              >
                {`${contact.firstName} ${contact.lastName}`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
