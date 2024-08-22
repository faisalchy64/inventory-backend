const { unlinkSync } = require("fs");
const { v2 } = require("cloudinary");

// Cloudinary configuration
v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  try {
    if (file) {
      const response = await v2.uploader.upload(file, {
        folder: "inventory-management",
      });

      unlinkSync(file);

      return response;
    }
  } catch (err) {
    unlinkSync(file);
  }
};

module.exports = uploadImage;
