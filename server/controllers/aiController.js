import OpenAI from 'openai';
import Vehicle from '../models/Vehicle.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI only if key exists
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const getRecommendations = async (req, res) => {
    const { query } = req.body;

    try {
        // Fetch all vehicles to provide context to AI (or filtered subset)
        const vehicles = await Vehicle.find({});

        // Prepare vehicle data string for prompt
        const vehicleData = vehicles.map(v =>
            `${v.name} (${v.brand}): ${v.type}, Price $${v.price}, ${v.specs.mileage}, ${v.specs.engine}, Features: ${v.features.join(', ')}`
        ).join('\n');

        if (!openai) {
            // Mock Response if no API Key
            console.log('No OpenAI API Key found. Returning mock response.');

            // Simple keyword matching for mock
            const mockRecommendations = vehicles.slice(0, 3); // Just return first 3 as fallback

            return res.json({
                recommendations: mockRecommendations,
                reasoning: "AI System Offline (Missing API Key). Displaying featured vehicles instead.",
            });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert automotive advisor for 'Street Machine', a futuristic vehicle platform. 
          Analyze the user's request and the available vehicle fleet data provided below.
          Return a JSON object with:
          1. 'recommendations': an array of exactly 3 vehicle names from the fleet that best match the request.
          2. 'reasoning': a short, futuristic, and persuasive explanation of why these vehicles were chosen (max 2 sentences).
          
          Fleet Data:
          ${vehicleData}
          `
                },
                { role: "user", content: query }
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);

        // Map names back to full vehicle objects
        const recommendedVehicles = await Vehicle.find({
            name: { $in: aiResponse.recommendations }
        });

        res.json({
            recommendations: recommendedVehicles,
            reasoning: aiResponse.reasoning
        });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'AI Neural Network Error' });
    }
};
