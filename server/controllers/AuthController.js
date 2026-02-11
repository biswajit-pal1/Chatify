import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        message: "Email already exists. Please login.",
      });
    }

    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Signup failed. Please try again.",
    });
  }
};


export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({
        message: "User with this email does not exist.",
      });      
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(401).json({
        message: "Incorrect password.",
      });      
    }

    response.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Login function error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User with the given id not found.");
    }

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Get User info function error");
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName) {
      return response
        .status(400)
        .send("First name, Last name & Color is required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Update Profile info function error");
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send("File is required.");
      return;
    }

    if (!req.file.mimetype.startsWith("image/")) {
      res.status(400).send("Only image files are allowed.");
      return;
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profiles", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.on("error", reject);
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
      { new: true },
    );

    res.status(201).json({ image: updatedUser.image });
  } catch (error) {
    console.error("Add profile image error:", error);
    res.status(500).send("Image upload failed");
  }
};


export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).send("User not found.");
      return;
    }

    if (user.image?.publicId) {
      await cloudinary.uploader.destroy(user.image.publicId, {
        resource_type: "image",
      });
    }

    user.image = null;
    await user.save();

    res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).send("Remove image failed");
  }
};


export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });

    return response.status(201).send("Logout successful.");
  } catch (error) {
    console.log(error);
    return response.status(500).send("Logout function error");
  }
};
