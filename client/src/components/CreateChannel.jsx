import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FaPlus, FaHashtag } from "react-icons/fa"; // Added FaHashtag
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constants";
import { Button } from "./ui/button";
import MultipleSelector from "./ui/multipleselect";
import { useAppStore } from "@/store";

function CreateChannel() {
  const { addChannel } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true },
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer group"
            onClick={() => setNewChannelModel(true)}
          >
            <FaPlus className="text-neutral-400 group-hover:text-white transition-all duration-300 text-sm" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1d25] border border-white/5 text-white/80 mb-2 p-2 text-xs">
          Create New Channel
        </TooltipContent>
      </Tooltip>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#1c1d25] border border-white/10 text-white w-[90vw] md:w-100 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-lg font-semibold tracking-wide text-white/90 flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-purple-500 mb-2">
                <FaHashtag className="text-xl" />
              </div>
              Create New Channel
            </DialogTitle>
            <p className="text-center text-white/40 text-xs px-4">
              Enter a name and select members to get started.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* Channel Name Input */}
            <Input
              placeholder="Channel Name"
              className="rounded-full py-5 px-6 bg-[#2a2b2f] border-none text-white focus-visible:ring-1 focus-visible:ring-purple-500 placeholder:text-white/30 transition-all"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />

            {/* Member Selector */}
            <div className="bg-[#2a2b2f] rounded-xl p-1">
              <MultipleSelector
                className="bg-transparent border-none py-2 text-white placeholder:text-white/30"
                defaultOptions={allContacts}
                placeholder="Search Members..."
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-sm text-white/40 py-4">
                    No results found.
                  </p>
                }
              />
            </div>

            {/* Create Button */}
            <Button
              className="w-full rounded-xl py-6 bg-linear-to-r from-[#8417ff] to-[#6d14d6] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-900/20 text-md font-medium mt-2"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
