import mongoose, { Document, mongo, Schema } from 'mongoose';

export interface IContact extends Document {
    user: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    firm?: string;
    address?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    fax?: string;
    comment?: string;
    tags: mongoose.Types.ObjectId[];
    customFields: Map<string, string>;
}

const ContactSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    firm: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    fax: {
        type: String,
        trim: true
    },
    comment: {
        type: String
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    customFields: {
        type: Map,
        of: String,
        default: {}
    },
}, { timestamps: true });

export default mongoose.model<IContact>('Contact', ContactSchema);