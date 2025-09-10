import mongoose, { Document, Schema } from 'mongoose';

//for define type we use interface 
// at the end it will be a mongoose document
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