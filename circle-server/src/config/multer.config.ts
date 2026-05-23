import multer from "multer";
import path from "path";
import { SessionInterface } from "../modules/user/user.interface";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "src/uploads/profile-picture");
  },

  filename: (req: SessionInterface, file, cb ) => {

    const userId = req?.id;

    const ext = path.extname(
      file.originalname
    );

    const fileName = `${userId}${ext}`;

    cb(null, fileName);
  },
});


const fileFilter: multer.Options["fileFilter"] = ( req, file, cb) => {

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
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
        "Only image files allowed"
      )
    );
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