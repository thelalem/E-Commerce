import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderName: {
            type: String,
        },
        senderType: {
            type: String,
            enum: ["seller", "buyer"],
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientName: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
