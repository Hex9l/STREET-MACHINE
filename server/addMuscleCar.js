import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const addMuscleCar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const existing = await Category.findOne({ name: 'Muscle Car' });
        if (!existing) {
            await Category.create({
                name: "Muscle Car",
                description: "High-performance American coupes with powerful V8 engines.",
                bestFor: "Straight-line speed and classic enthusiasts",
                seating: "2-4",
                engineRange: "5.0L – 6.2L V8",
                topSpeed: "250–320 km/h",
                pros: ["V8 sound", "High horsepower", "Iconic styling", "Strong acceleration"],
                cons: ["Poor fuel economy", "Heavy weight", "Less agile in corners"],
                type: "car"
            });
            console.log('Muscle Car category added successfully');
        } else {
            console.log('Muscle Car category already exists');
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

addMuscleCar();
