import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
    user: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    company?: string;
    address?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    fax?: string;
    comment?: string;
    tags: mongoose.Types.ObjectId[];
    customFields: Map<string, string>;
}

const ContactSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        company: {
            type: String
        },
        address: {
            type: String
        },
        phone: {
            type: String
        },
        mobile: {
            type: String
        },
        email: {
            type: String
        },
        fax: {
            type: String
        },
        comment: {
            type: String
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }],
        customFields: {
            type: Map,
            of: String,
            default: {}
        }
    },
    { timestamps: true }
);

ContactSchema.index({ firstName: 1, lastName: 1 });
ContactSchema.index({ user: 1 });

export default mongoose.model<IContact>('Contact', ContactSchema);