import mongoose from "mongoose";


export const connectMongoose =async () => {
    try {
        const mongoUrl = process.env.MONGO_URL
        if(mongoUrl){
            mongoose.connect(mongoUrl, {
                serverSelectionTimeoutMS: 30000, // 30 seconds timeout
              });
              
            console.log("Mongoose connected successfully");
        } else {
            console.log("Provide the mongo url in env file");
        }
    } catch (error) {
        console.log("Data base connection failed ", error);
    }
}