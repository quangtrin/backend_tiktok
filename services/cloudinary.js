const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file, nextAction) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = "data:" + file.mimetype + ";base64," + b64;
  try {
    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    nextAction(res.url);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteFile = async (fileName) => {
  try {
    await cloudinary.uploader.destroy(fileName.split(".")[0], {
      resource_type: "video",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadFile, deleteFile };
