import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAppStore } from "@/store";

function NewDM() {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true },
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={() => setOpenNewContactModal(true)}
            className="w-full h-full flex items-center justify-center cursor-pointer group"
          >
            <FaPlus className="text-neutral-400 group-hover:text-white transition-all duration-300 text-sm" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1d25] border border-white/5 text-white/80 mb-2 p-2 text-xs">
          Select New Contact
        </TooltipContent>
      </Tooltip>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#1c1d25] border border-white/10 text-white w-[90vw] md:w-100 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-lg font-semibold tracking-wide text-white/90">
              Select a Contact
            </DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <Input
              placeholder="Search Contacts..."
              className="rounded-full py-5 px-6 bg-[#2a2b2f] border-none text-white focus-visible:ring-1 focus-visible:ring-purple-500 placeholder:text-white/30 transition-all"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 ? (
            <ScrollArea className="h-62.5 pr-2 custom-scrollbar">
              <div className="flex flex-col gap-2">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-4 items-center cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                    onClick={() => selectNewContact(contact)}
                  >
                    <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <AvatarFallback
                          className={`uppercase h-full w-full text-sm font-bold flex items-center justify-center rounded-full ${getColor(
                            contact.color,
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white/90">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs text-white/40">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col justify-center items-center py-6 opacity-70">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-white/50 text-center mt-4 text-sm">
                <p>Search for people to</p>
                <p className="font-semibold text-purple-400">start chatting.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
