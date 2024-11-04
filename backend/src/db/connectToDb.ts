import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_DB_URI));
    console.log("Connected to mongodb successfully!");
  } catch (error: any) {
    console.log("Error connecting to MongoDb", error.message);
  }
};
