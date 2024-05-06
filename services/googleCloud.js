const { Storage } = require("@google-cloud/storage");

const projectId = process.env.PROJECT_ID;
const keyFilename = process.env.KEYFILENAME;
const bucketName = process.env.BUCKET_NAME;
const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(bucketName);

exports.uploadFile = async (file, nextAction) => {
  const fileOutputName = `${Date.now()}_${file.originalname}`;
  const blob = bucket.file(fileOutputName);
  const blobStream = blob.createWriteStream();

  blobStream.on("finish", async (data) => {
    try {
      await blob.makePublic();
      const url = `https://storage.googleapis.com/${bucketName}/${fileOutputName}`;
      nextAction(url);
    } catch (error) {
      console.log(error);
    }
  });
  await blobStream.end(file.buffer);
};

exports.deleteFile = async (fileName) => {
  try {
    await bucket.file(fileName).delete();
  } catch (error) {
    console.log(error);
  }
};
