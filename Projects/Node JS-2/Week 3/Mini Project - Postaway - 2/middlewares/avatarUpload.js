import multer from "multer";
import path from "path";

/**
 * Configure storage for user avatar uploads.
 * Files are stored inside /uploads/avatars directory.
 */
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);

    cb(null, `avatar-${uniqueSuffix}${fileExtension}`);
  },
});

/**
 * Restrict file types to common image formats
 */
const avatarFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extensionValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extensionValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for avatar upload"));
  }
};

/**
 * Multer middleware used for uploading avatar images.
 */
export const uploadAvatarImage = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
});
