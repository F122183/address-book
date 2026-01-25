import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect("mongodb://127.0.0.1:27017/address-book");
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;