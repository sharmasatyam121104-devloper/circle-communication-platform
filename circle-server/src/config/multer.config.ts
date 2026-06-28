import multer from "multer";
import path from "path";
import fs from "fs";
import { SessionInterface } from "../modules/user/user.interface";

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "profile-picture"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (
    req: SessionInterface,
    file,
    cb
  ) => {
    const userId = req?.id;
    const ext = path.extname(file.originalname);

    cb(null, `${userId}${ext}`);
  },
});

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

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;