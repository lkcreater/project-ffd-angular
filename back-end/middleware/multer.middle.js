const multer = require("multer");
const env = require('../configuration');
const MIME_TYPE_IMAGE = ["image/gif", "image/jpeg", "image/png"];
const MIME_TYPE_DOCUMENT = ["application/pdf"];

const queryMimeType = (type) => {
  let mimeType = [];
  switch (type) {
    case "image":
      mimeType = MIME_TYPE_IMAGE;
      break;
    case "document":
      mimeType = MIME_TYPE_DOCUMENT;
      break;
    case "all":
      mimeType = [...MIME_TYPE_IMAGE, ...MIME_TYPE_DOCUMENT];
      break;
  }

  return mimeType;
};

const settingMulter = (options) => {
  const fileSize = options?.fileSize ?? env.OBS_FILE_SIZE; //-- 5MB
  const allowMimeTypes = queryMimeType(options?.allowMimeTypes ?? "all");
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
      if (allowMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("mime type not supported"));
      }
    },
    limits: { fileSize: fileSize },
  });
};

const uploadFileOne = (inputName, options) => {
  const upload = settingMulter(options).single(inputName);

  return (req, res, next) => {
    upload(req, res, function (err) {
      let isError = false;
      let errorMessage = "";
      if (err instanceof multer.MulterError) {
        isError = true;
        errorMessage = err?.message;
      } else if (err) {
        isError = true;
        errorMessage = err?.message;
      }

      if (isError == true) {
        return res.status(403).json({
          statusCode: 403,
          message: errorMessage,
        });
      }

      return next();
    });
  };
};

module.exports = {
  uploadFileOne
};
