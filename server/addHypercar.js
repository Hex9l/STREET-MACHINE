import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const addHypercar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const existing = await Category.findOne({ name: 'Hypercar' });
        if (!existing) {
            await Category.create({
                name: "Hypercar",
                description: "Ultra-high-performance cars, representing the pinnacle of automotive engineering, beyond supercars.",
                bestFor: "Collectors, track dominance, ultimate performance",
                seating: "2",
                engineRange: "4.0L V8 – 8.0L W16 + Electric",
                topSpeed: "350–450+ km/h",
                pros: ["Pinnacle of performance", "Exclusivity", "Cutting-edge technology"],
                cons: ["Astronomical price", "Extremely limited practicality", "High maintenance"],
                type: "car"
            });
            console.log('Hypercar category added successfully');
        } else {
            console.log('Hypercar category already exists');
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

addHypercar();
