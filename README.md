# 💬 Real-Time Chat Application (MERN + Socket.io + Cloudinary)

## 📌 Project Overview

This is a real-time chat application built using:

-   **Frontend:** React.js
-   **Backend:** Node.js + Express.js
-   **Database:** MongoDB (Mongoose)
-   **Real-time Communication:** Socket.io
-   **File Storage:** Cloudinary
-   **Authentication:** JWT + Cookies

The application supports:

-   Direct Messaging (DM)
-   Channel Messaging
-   Real-time updates
-   Image & File Uploads (Cloudinary)
-   File Download
-   Emoji Support
-   Upload Progress Tracking

------------------------------------------------------------------------

## 🏗️ Project Architecture

### 🔹 Backend Structure

    backend/
    │
    ├── config/
    │   └── cloudinary.js
    │
    ├── controllers/
    │   ├── MessagesController.js
    │   ├── AuthController.js
    │   └── ChannelController.js
    │
    ├── middlewares/
    │   ├── AuthMiddleware.js
    │   └── multer.js
    │
    ├── models/
    │   ├── MessagesModel.js
    │   ├── UserModel.js
    │   └── ChannelModel.js
    │
    ├── routes/
    │   ├── AuthRoutes.js
    │   ├── MessagesRoutes.js
    │   ├── ContactRoutes.js
    │   └── ChannelRoutes.js
    │
    ├── socket.js
    ├── index.js
    └── .env

------------------------------------------------------------------------

## 🧠 Core Features

### ✅ 1. Real-Time Messaging

-   Uses Socket.io
-   Maintains user-socket mapping
-   Supports:
    -   `sendMessage`
    -   `receiveMessage`
    -   `send-channel-message`
    -   `receive-channel-message`

------------------------------------------------------------------------

### ✅ 2. File Upload with Cloudinary

Files are uploaded using:

-   `multer.memoryStorage()`
-   `cloudinary.uploader.upload_stream()`

Supports: - Images (PNG, JPG, WebP, etc.) - Documents (PDF, ZIP, DOCX,
etc.)

Stored in DB as:

``` js
file: {
  url: String,
  publicId: String
}
```

------------------------------------------------------------------------

### ✅ 3. Secure Authentication

-   JWT-based authentication
-   Cookies with credentials
-   Protected routes using middleware

------------------------------------------------------------------------

### ✅ 4. Channel Messaging

-   Channel model maintains:
    -   Members
    -   Admin
    -   Messages reference
-   Real-time broadcast to all members

------------------------------------------------------------------------

### ✅ 5. File Download Support

Cloudinary URLs are directly used for:

-   Image rendering
-   File download
-   No backend proxy required

------------------------------------------------------------------------

## 🔐 Environment Variables (.env)

    PORT=8080
    DATABASE_URL=your_mongodb_connection
    ORIGIN=http://localhost:5173

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    JWT_KEY=your_jwt_secret

------------------------------------------------------------------------

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies

Backend:

    npm install

Frontend:

    npm install

------------------------------------------------------------------------

### 2️⃣ Start Backend

    npm run dev

------------------------------------------------------------------------

### 3️⃣ Start Frontend

    npm run dev

------------------------------------------------------------------------

## 🔄 Real-Time Flow (File Upload Example)

1.  User selects file

2.  File uploaded to backend

3.  Backend uploads to Cloudinary

4.  Cloudinary returns:

    -   `secure_url`
    -   `public_id`

5.  Socket emits message with:

    ``` js
    file: {
      url,
      publicId
    }
    ```

6.  Message stored in MongoDB

7.  Real-time broadcast to users

------------------------------------------------------------------------

## 🛠️ Technologies Used

-   React.js
-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   Socket.io
-   Cloudinary
-   Multer
-   JWT
-   Tailwind CSS

------------------------------------------------------------------------

## 🎯 Future Improvements

-   Message Reactions
-   Typing Indicators
-   Read Receipts
-   Delete Message + Delete Cloudinary File
-   Pagination for Messages
-   Drag & Drop Upload
-   File Type Icons
-   Image Compression

------------------------------------------------------------------------

## 👨‍💻 Author

Developed as a full-stack real-time messaging application with
production-ready file handling and cloud integration.

------------------------------------------------------------------------

# ✅ Project Status

✔ Real-time messaging\
✔ Cloudinary file upload\
✔ Channel support\
✔ Image rendering\
✔ Download support\
✔ Production-ready architecture

------------------------------------------------------------------------

💬 Built with modern full-stack technologies and scalable architecture.
