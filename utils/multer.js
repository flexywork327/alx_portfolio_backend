const multer = require("multer");

// set storage engine
module.exports = multer({
  storage: multer.diskStorage({}),

  fileFilter: (req, file, cb) => {
    // reject a file
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/svg+xml" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/bmp" ||
      file.mimetype === "image/tiff" ||
      file.mimetype === "image/vnd.microsoft.icon" ||
      file.mimetype === "image/vnd.wap.wbmp" ||
      file.mimetype === "image/x-icon" ||
      file.mimetype === "image/x-jng"
    ) {
      cb(null, true);
    } else {
      cb(
        {
          message: "File type not supported",
        },
        false
      );
    }
  },
});
