import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String }, // e.g., 'Launch', 'Rumor', 'Review'
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('News', newsSchema);
