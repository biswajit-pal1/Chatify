import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import upload from "../middlewares/multer.js";

const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default messageRoutes;