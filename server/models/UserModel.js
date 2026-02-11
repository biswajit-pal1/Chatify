import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    // 🔥 Cloudinary image storage
    image: {
      url: {
        type: String, // cloudinary secure_url
        required: false,
      },
      publicId: {
        type: String, // cloudinary public_id
        required: false,
      },
    },

    color: {
      type: Number,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await genSalt();
  this.password = await hash(this.password, salt);
});


const User = mongoose.model("Users", userSchema);
export default User;
