import { Router } from "express";
import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/multer.js";

const authRoutes = Router();

console.log("verifyToken typeof:", typeof verifyToken);


authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);

authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage,
);

authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

authRoutes.post("/logout", logout);

export default authRoutes;
