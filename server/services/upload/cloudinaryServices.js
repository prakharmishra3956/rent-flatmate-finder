const cloudinary = require("../../config/cloudinary");

const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "rent-flatmate-finder",
  });
};

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadImage,
  deleteImage,
};
