import mongoose, { Document, Schema } from 'mongoose';

//for define type we use interface 
// at the end it will be a mongoose document
// extends Document = your fields + all Mongoose document methods.
// Needed in older Mongoose + TS patterns.
// In newer Mongoose (v7+), you can skip extends Document and just use Schema<IType> and model<IType>.
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

export default  mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>('Message', messageSchema);