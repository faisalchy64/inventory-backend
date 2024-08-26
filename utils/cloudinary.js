const { unlinkSync } = require("fs");
const dotenv = require("dotenv");
const { v2 } = require("cloudinary");

// Load environment variables from .env file
dotenv.config();

// Cloudinary configuration
v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  try {
    if (file) {
      const { secure_url } = await v2.uploader.upload(file, {
        folder: "inventory-management",
      });

      unlinkSync(file);

      return secure_url;
    }
  } catch (err) {
    unlinkSync(file);
  }
};

const destroyImage = async (src) => {
  try {
    const public_id = src.split("/").pop().split(".")[0];
    await v2.uploader.destroy(`inventory-management/${public_id}`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { uploadImage, destroyImage };
