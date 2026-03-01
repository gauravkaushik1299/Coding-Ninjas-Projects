import multer from "multer";
import path from "path";

/**
 * Configure disk storage for uploaded post images.
 * Files are stored in public/uploads directory.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    // Extract file extension safely
    const extension = path.extname(file.originalname);

    // Generate unique filename to avoid collisions
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e6,
    )}${extension}`;

    cb(null, uniqueName);
  },
});

/**
 * Accept only image files.
 */
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
