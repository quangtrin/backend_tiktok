const stream = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

var fs = require("fs");
var path = require("path");

exports.compressFile = (req, res, next) => {
  const { startTime, endTime } = req.body;
  const file = req.file;
  if (!file) {
    next();
    return;
  }
  if (!startTime || !endTime) {
    next();
    return;
  }
  const outputFilePath = path.join(__dirname, `${Date.now()}.mp4`);

  const inputStream = new stream.PassThrough();
  inputStream.end(file.buffer);


  // Sử dụng ffmpeg để cắt video
  ffmpeg(inputStream)
    .setStartTime(startTime)
    .setDuration(endTime - startTime)
    .output(outputFilePath)
    .on("start", function (commandLine) {
      console.log("Spawned Ffmpeg with command: " + commandLine);
    })
    .on("progress", function (progress) {
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("end", function (stdout, stderr) {
      console.log("Finished");
      // Đọc file output
      const output = fs.readFileSync(outputFilePath);
      req.file = {
        buffer: output,
        mimetype: "video/mp4",
        size: output.length,
      };
      fs.unlinkSync(outputFilePath);
      next();
    })
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
      res.status(500).send("Lỗi server");
    })
    .run();
};
