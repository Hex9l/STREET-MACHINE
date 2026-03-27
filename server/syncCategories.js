import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from './models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const syncCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Read categories.json
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf-8'));
        const categories = data.value;

        console.log(`Found ${categories.length} categories in JSON. Starting sync...`);

        for (const cat of categories) {
            const { _id, __v, createdAt, ...updateData } = cat;
            
            // We use the name as the unique identifier for syncing
            const result = await Category.findOneAndUpdate(
                { name: cat.name },
                { $set: updateData },
                { upsert: true, new: true }
            );
            
            console.log(`Synced: ${cat.name}`);
        }

        console.log('Synchronization complete!');
    } catch (e) {
        console.error('Error during synchronization:', e);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    }
}

syncCategories();
