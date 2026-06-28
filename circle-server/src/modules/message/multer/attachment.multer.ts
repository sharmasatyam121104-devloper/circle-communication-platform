import multer from "multer";
import path from "path";
import { SessionInterface } from "../../user/user.interface";
import fs from "fs"


const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "attachments"
);

// Folder automatically create ho jayega
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
    const userId = req.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);

    cb(null, `${userId}-${timestamp}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] =
  (req, file, cb) => {

    const allowedTypes = [

      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",

      "video/mp4",

      "application/pdf",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);

    } else {

      cb(
        new Error(
          "Unsupported file type"
        )
      );
    }
  };

const uploadAttachment = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadAttachment;

