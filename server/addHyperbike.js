import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const addHyperbike = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        const existing = await Category.findOne({ name: 'Hyperbike' });
        if (!existing) {
            await Category.create({
                name: "Hyperbike",
                description: "The absolute pinnacle of motorcycle engineering, delivering unmatched top speeds, extreme power, and aerodynamic perfection.",
                bestFor: "Track dominance, highly experienced riders, ultimate speed enthusiasts",
                seating: "1",
                engineRange: "1000cc – 1400cc+",
                topSpeed: "300+ km/h",
                pros: ["Mind-blowing acceleration", "Cutting-edge electronics", "Track-ready performance"],
                cons: ["Extremely expensive", "Uncomfortable for commuting", "Requires expert skill"],
                type: "bike"
            });
            console.log('Hyperbike category added successfully');
        } else {
            console.log('Hyperbike category already exists');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    }
}

addHyperbike();
