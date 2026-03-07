import mongoose from "mongoose";

/**
 * Initializes MongoDB connection.
 * This wrapper keeps database setup isolated from the server startup logic.
 */
const initializeDatabase = async () => {
  try {
    // Ensure connection string exists before attempting connection
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Establish connection with MongoDB
    const connection = await mongoose.connect(process.env.MONGO_URI);

    // Helpful log to confirm which DB host was connected
    console.log(
      `MongoDB connection established at ${connection.connection.host}`,
    );
  } catch (error) {
    console.error("MongoDB initialization error:", error.message);

    // Exit process since the application cannot function without database access
    process.exit(1);
  }
};

export default initializeDatabase;
