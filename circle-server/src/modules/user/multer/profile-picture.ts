import multer from "multer";

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } 
  else {
    cb(
      new Error(
        "Only image files are allowed"
      )
    );
  }
};

const uploadProfilePicture = multer({

  storage: multer.memoryStorage(),

  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export default uploadProfilePicture;