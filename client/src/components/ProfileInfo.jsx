import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useAppStore } from "@/store";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

function ProfileInfo() {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });

      setUserInfo(null);

      navigate("/auth", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  

  const imageUrl = userInfo?.image?.url || null;

  return (
    <div className="absolute bottom-0 left-0 w-full h-20 flex items-center justify-between px-6 bg-[#1c1d25] border-t border-white/5 backdrop-blur-lg z-20">
      
      {/* USER DETAILS SECTION */}
      <div className="flex gap-3 items-center justify-start flex-1 overflow-hidden">
        <div className="w-10 h-10 relative shrink-0">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-white/10 shadow-md">
            {imageUrl ? (
              <AvatarImage
                src={imageUrl}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback
                className={`uppercase h-full w-full text-sm font-bold border flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName ? userInfo.firstName[0] : userInfo.email[0]}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex flex-col truncate">
          <span className="text-sm font-semibold text-white/90 truncate">
            {userInfo.firstName && userInfo.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : "User"}
          </span>
          <span className="text-xs text-white/40 truncate font-medium tracking-wide">
             {userInfo.email}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 items-center pl-2">
        <Tooltip>
          <TooltipTrigger>
            <div 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate("/profile")}
            >
                <FiEdit2 className="text-purple-500 text-lg group-hover:scale-110 transition-transform" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black/90 border-white/10 text-white text-xs">
            Edit Profile
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <div 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 transition-all duration-300 cursor-pointer group"
                onClick={logOut}
            >
                <IoPowerSharp className="text-red-500 text-lg group-hover:scale-110 transition-transform" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black/90 border-white/10 text-white text-xs">
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default ProfileInfo;