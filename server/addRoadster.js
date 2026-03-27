import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const addRoadster = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const existing = await Category.findOne({ name: 'Roadster' });
        if (!existing) {
            await Category.create({
                name: "Roadster",
                description: "Modern Naked Performance. High-performance naked motorcycles with a focus on agility, minimalist design, and punchy power delivery.",
                bestFor: "Enthusiasts, city riding, and performance naked bike fans",
                engineRange: "600–1200cc+",
                topSpeed: "180–240 km/h",
                pros: ["Agile handling", "Powerful engine", "Minimalist aesthetic", "Versatile"],
                cons: ["No wind protection", "Exposed components", "Limited luggage space"],
                seating: "2",
                type: "bike"
            });
            console.log('Roadster category added successfully');
        } else {
            console.log('Roadster category already exists');
        }
    } catch (e) {
        console.error('Error adding Roadster category:', e);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    }
}

addRoadster();