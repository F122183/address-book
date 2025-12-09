import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordhash: string;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordhash: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);