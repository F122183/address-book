import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
    name: string;
    color: string;
    useer: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
}

const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#808080'
    },
    useer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        default: null
    }
});

TagSchema.index({user: 1, name: 1}, {unique: true});

export default mongoose.model<ITag>('Tag', TagSchema);