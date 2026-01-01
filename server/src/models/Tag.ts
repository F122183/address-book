import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    color: string;
    parent?: mongoose.Types.ObjectId | null;
}

const TagSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: '#808080'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        default: null
    }
});

TagSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model<ITag>('Tag', TagSchema);