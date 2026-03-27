import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    try {
        console.log('Starting Verification...');

        // 1. Create dummy image
        const imagePath = path.join(__dirname, 'test_car.jpg');
        fs.writeFileSync(imagePath, 'fake image content');

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@streetmachine.com', password: 'admin123' })
        });

        if (!loginRes.ok) {
            throw new Error(`Login Failed: ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login Successful');

        // 3. Create FormData
        console.log('Creating Test Vehicle with Image...');
        const formData = new FormData();
        formData.append('name', 'Verification Car');
        formData.append('brand', 'VerifyMotors');
        formData.append('price', '999999');
        formData.append('type', 'car');
        formData.append('category', 'Supercar'); // Ensure "Supercar" category exists, assume standard seeding
        formData.append('launchYear', '2025');

        // Append file
        const fileBuffer = fs.readFileSync(imagePath);
        const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
        formData.append('images', fileBlob, 'test_car.jpg');

        // 4. Post
        const createRes = await fetch('http://localhost:5000/api/vehicles', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await createRes.json();
        console.log('Create Response Status:', createRes.status);
        console.log('Create Response Data:', data);

        if (!createRes.ok) {
            throw new Error('Failed to create vehicle');
        }

        // Verify Image URL
        if (data.images && data.images.length > 0 && data.images[0].includes('uploads')) {
            console.log('✅ Image Upload Verified:', data.images[0]);
        } else {
            console.error('❌ Image Upload Failed or URL Malformed', data.images);
        }

        // 5. Cleanup (Delete created vehicle)
        console.log('Cleaning up...');
        await fetch(`http://localhost:5000/api/vehicles/${data._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Test Vehicle Deleted');

        // Cleanup file
        fs.unlinkSync(imagePath);

        console.log('✅ Verification Complete!');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    }
}

run();
