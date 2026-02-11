import Message from "../models/MessagesModel.js";
import cloudinary from "../config/cloudinary.js";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    if (!user1 || !user2) {
      return response.status(400).send("Both user Id's are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timeStamp: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Get messages function error");
  }
};

export const uploadFile = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required.");
    }

    const isImage = request.file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const originalName = request.file.originalname;

    // 🔥 Generate unique public_id (VERY IMPORTANT)
    const uniquePublicId = `${Date.now()}-${originalName
      .replace(/\s+/g, "-")
      .replace(/[^\w.-]/g, "")}`;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "chat-app-files",
          resource_type: resourceType,

          // ✅ Use unique public id (prevents overwrite)
          public_id: uniquePublicId,

          // Optional: prevent overwrite explicitly
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(request.file.buffer);
    });

    return response.status(200).json({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      originalName, // ✅ Used in frontend display
      fileType: resourceType,
    });
  } catch (error) {
    console.error("Upload file error:", error);
    return response.status(500).send("Upload File function error");
  }
};