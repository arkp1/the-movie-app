import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId : { type: String, required: true, unique: true },
    userId: { type: String, required: true }, 
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now, expires: '14d' },
})

const Session = mongoose.model("Session", sessionSchema);

export default Session;