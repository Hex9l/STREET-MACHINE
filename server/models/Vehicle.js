import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, enum: ['car', 'bike'], required: true },
    category: [{ type: String, required: true }], // e.g., ['SUV', 'Electric Car']
    price: { type: Number, required: true },
    launchYear: { type: Number },
    images: [{ type: String }], // URLs to images
    specs: {
        engine: String,
        mileage: String,
        topSpeed: String,
        zeroToHundred: String,
        fuelType: [String],
        transmission: String,
        driveType: String, // RWD, FWD, AWD
        power: String,
        torque: String,
        batteryCapacity: String,
        drivingRange: String,
        chargingTime: String,
        maxChargingPower: String,
        evDescription: String,
    },
    dimensions: {
        seating: Number,
        weight: String,
        fuelTank: String,
        groundClearance: String,
        wheelbase: String,
    },
    features: [{ type: String }],
    description: String,
    pros: [{ type: String }],
    cons: [{ type: String }],
    colors: [{ type: String }],
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Vehicle', vehicleSchema);
