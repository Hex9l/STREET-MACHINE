import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['car', 'bike'], required: true },
    engineRange: { type: String }, // e.g. "150-1000cc"
    bestFor: { type: String }, // e.g. "Racing and performance riding"
    topSpeed: { type: String }, // e.g. "250–320+ km/h"
    pros: [{ type: String }], // e.g. ["Fast acceleration", "Aerodynamic"]
    cons: [{ type: String }], // e.g. ["Expensive", "High maintenance"]
    image: { type: String }, // URL to category image (optional)
    seating: { type: String }, // e.g. "2", "4-5"
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categorySchema);
