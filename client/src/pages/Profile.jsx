import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { MdEmail } from "react-icons/md"; // Added icon for email

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if (userInfo.image?.url) {
      setImage(userInfo.image.url);
    } else {
      setImage(null);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (!validateProfile()) return;

    try {
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        { firstName, lastName, color: selectedColor },
        { withCredentials: true },
      );

      if (response.status === 200 && response.data) {
        setUserInfo(response.data);
        toast.success("Profile updated successfully.");
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile.");
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profile-image", file);

      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });

      if (response.status === 201 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        setImage(response.data.image.url);
        toast.success("Image updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed.");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Image removed successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove image.");
    }
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Decor (Optional Subtle Glows) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Profile Card */}
      <div className="relative bg-[#2a2b2f]/90 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-8 w-[90vw] md:w-112.5 flex flex-col items-center gap-6">
        {/* Header / Back Button */}
        <div className="w-full flex items-center justify-start">
          <button
            onClick={handleNavigate}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80"
          >
            <IoArrowBack className="text-2xl" />
          </button>
          <span className="ml-4 text-white/90 font-semibold text-lg">
            Edit Profile
          </span>
        </div>

        {/* Avatar Section */}
        <div className="relative group">
          <div
            className={`h-36 w-36 rounded-full relative flex items-center justify-center border-4 transition-colors duration-300 ${colors[selectedColor].replace("bg-", "border-")}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-full w-full rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-5xl flex items-center justify-center rounded-full bg-[#1c1d25] text-white/80 font-bold`}
                >
                  {firstName ? firstName[0] : userInfo.email[0]}
                </div>
              )}
            </Avatar>

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
              onClick={image ? handleDeleteImage : handleFileInputClick}
            >
              {image ? (
                <FaTrash className="text-white text-2xl drop-shadow-lg" />
              ) : (
                <FaPlus className="text-white text-2xl drop-shadow-lg" />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </div>
        </div>

        {/* Inputs Section */}
        <div className="w-full flex flex-col gap-4">
          {/* Email (Read Only) */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <MdEmail />
            </div>
            <Input
              disabled
              value={userInfo.email}
              className="pl-10 rounded-xl bg-[#1c1d25] border border-white/5 text-white/50 focus-visible:ring-0 focus-visible:border-white/10"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl p-6 bg-[#1c1d25] border border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500/50 transition-all"
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-xl p-6 bg-[#1c1d25] border border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="w-full">
          <p className="text-xs text-white/40 mb-3 ml-1 uppercase tracking-widest font-medium">
            Select Theme Color
          </p>
          <div className="flex gap-4 justify-between">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                  selectedColor === index
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#2a2b2f]"
                    : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setSelectedColor(index)}
              />
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          className="w-full h-12 bg-linear-to-r from-[#8417ff] to-[#6d14d6] hover:opacity-90 transition-all duration-300 rounded-xl shadow-lg shadow-purple-900/20 text-md font-medium tracking-wide mt-2"
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default Profile;
