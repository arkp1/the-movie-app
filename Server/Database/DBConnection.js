import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoDbURI = process.env.MONGODB_URI;

const DBConnection = async () => {
    try {
      await mongoose.connect(mongoDbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to mongoose server");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  };
  

export default DBConnection;