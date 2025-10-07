import mongoose from "mongoose";
import { DB_NAME } from "./dbName";

export async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        const connection = mongoose.connection;

        connection.on('connected' , () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.log('MongoDB connection failed!!! Please make sure mongoDB running' + err);
            process.exit();
        });
    } catch (error) {
        console.log('Something goes wrong: MongoDB connection failed!!!', error);
        throw error;
    }
}