import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        messsage: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;