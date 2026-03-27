import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import Category from './models/Category.js';

dotenv.config();

const categories = [
  // Cars
  {
    name: "Hatchback",
    description: "Compact car with rear hatch door.",
    bestFor: "City driving and small families",
    seating: "4–5",
    engineRange: "1.0L – 2.0L",
    topSpeed: "150–200 km/h",
    pros: ["Fuel efficient", "Easy to park", "Affordable", "Low maintenance"],
    cons: ["Limited boot space", "Not ideal for long highway trips", "Less premium feel"],
    type: "car"
  },
  {
    name: "Sedan",
    description: "Three-box car with separate trunk.",
    bestFor: "Family comfort and highway driving",
    seating: "4–5",
    engineRange: "1.5L – 4.0L",
    topSpeed: "180–250 km/h",
    pros: ["Comfortable ride", "Large boot space", "Stable at high speeds", "Premium look"],
    cons: ["Lower ground clearance", "Not ideal for rough roads", "Larger turning radius than hatchbacks"],
    type: "car"
  },
  {
    name: "SUV",
    description: "Large vehicle with high ground clearance.",
    bestFor: "Rough roads and long trips",
    seating: "5–7",
    engineRange: "2.0L – 5.0L",
    topSpeed: "180–220 km/h",
    pros: ["High ground clearance", "Spacious interior", "Strong road presence", "Suitable for all terrains"],
    cons: ["Higher fuel consumption", "Expensive compared to sedans", "Difficult to park in tight spaces"],
    type: "car"
  },
  {
    name: "MPV",
    description: "Family-focused vehicle with multiple seats.",
    bestFor: "Large families and group travel",
    seating: "6–8",
    engineRange: "1.5L – 3.5L",
    topSpeed: "160–200 km/h",
    pros: ["Very spacious", "Comfortable for long trips", "Flexible seating"],
    cons: ["Bulky size", "Less sporty design", "Lower fuel efficiency"],
    type: "car"
  },
  {
    name: "Coupe",
    description: "Two-door sporty car.",
    bestFor: "Style and performance",
    seating: "2–4",
    engineRange: "2.0L – 5.0L",
    topSpeed: "220–300 km/h",
    pros: ["Stylish design", "Sporty performance", "Premium feel"],
    cons: ["Limited rear-seat space", "Expensive", "Not practical for families"],
    type: "car"
  },
  {
    name: "Convertible",
    description: "Car with removable or folding roof.",
    bestFor: "Open-air driving experience",
    seating: "2–4",
    engineRange: "2.0L – 5.0L",
    topSpeed: "200–280 km/h",
    pros: ["Unique driving experience", "Stylish appearance", "Fun to drive"],
    cons: ["Expensive", "Less structural rigidity", "Limited practicality", "Not suitable for extreme weather"],
    type: "car"
  },
  {
    name: "Pickup Truck",
    description: "Vehicle with open cargo bed.",
    bestFor: "Carrying goods and off-road use",
    seating: "2–5",
    engineRange: "2.5L – 6.0L",
    topSpeed: "160–200 km/h",
    pros: ["Strong and durable", "Large cargo capacity", "Good off-road capability"],
    cons: ["Large size", "Higher fuel consumption", "Harder to maneuver in cities"],
    type: "car"
  },
  {
    name: "Station Wagon",
    description: "Sedan-based car with extended rear cargo area.",
    bestFor: "Long-distance travel and cargo",
    seating: "5",
    engineRange: "1.5L – 3.0L",
    topSpeed: "180–240 km/h",
    pros: ["Large storage space", "Comfortable ride", "Better fuel efficiency than SUVs"],
    cons: ["Less popular in many markets", "Not as high ground clearance as SUVs"],
    type: "car"
  },
  {
    name: "Sports Car",
    description: "Performance-focused car built for speed.",
    bestFor: "Enthusiasts and performance driving",
    seating: "2–4",
    engineRange: "3.0L – 6.0L",
    topSpeed: "250–320+ km/h",
    pros: ["High speed and acceleration", "Aerodynamic design", "Exciting driving experience"],
    cons: ["Expensive", "Low ground clearance", "Limited practicality"],
    type: "car"
  },
  {
    name: "Supercar",
    description: "Extreme high-performance exotic cars.",
    bestFor: "Collectors and high-speed performance",
    seating: "2",
    engineRange: "4.0L – 8.0L",
    topSpeed: "300–400+ km/h",
    pros: ["Extreme speed", "Advanced technology", "Exclusive and rare"],
    cons: ["Very expensive", "High maintenance cost", "Not practical for daily use"],
    type: "car"
  },
  {
    name: "Hypercar",
    description: "Ultra-high-performance cars, representing the pinnacle of automotive engineering, beyond supercars.",
    bestFor: "Collectors, track dominance, ultimate performance",
    seating: "2",
    engineRange: "4.0L V8 – 8.0L W16 + Electric",
    topSpeed: "350–450+ km/h",
    pros: ["Pinnacle of performance", "Exclusivity", "Cutting-edge technology"],
    cons: ["Astronomical price", "Extremely limited practicality", "High maintenance"],
    type: "car"
  },
  {
    name: "Muscle Car",
    description: "High-performance American coupes with powerful V8 engines.",
    bestFor: "Straight-line speed and classic enthusiasts",
    seating: "2-4",
    engineRange: "5.0L – 6.2L V8",
    topSpeed: "250–320 km/h",
    pros: ["V8 sound", "High horsepower", "Iconic styling", "Strong acceleration"],
    cons: ["Poor fuel economy", "Heavy weight", "Less agile in corners"],
    type: "car"
  },
  {
    name: "Electric Car",
    description: "Fully electric-powered vehicle.",
    bestFor: "Eco-friendly commuting",
    seating: "4–5",
    engineRange: "Electric Motor",
    topSpeed: "150–250+ km/h",
    pros: ["Zero emissions", "Low running cost", "Quiet operation"],
    cons: ["Charging infrastructure required", "Higher initial cost", "Limited range in some models"],
    type: "car"
  },
  {
    name: "Hybrid Car",
    description: "Uses both fuel engine and electric motor.",
    bestFor: "Fuel-efficient driving",
    seating: "4–5",
    engineRange: "1.5L – 3.0L + Electric",
    topSpeed: "160–220 km/h",
    pros: ["Better fuel economy", "Lower emissions", "Smooth driving experience"],
    cons: ["Higher purchase cost", "Complex system", "Battery replacement cost"],
    type: "car"
  },

  // Bikes
  {
    name: "Commuter",
    description: "Basic Daily Use. Basic, fuel-efficient motorcycles for daily use.",
    bestFor: "City commuting",
    engineRange: "100–150cc",
    topSpeed: "80-100 km/h",
    pros: ["Low cost", "High mileage", "Easy maintenance"],
    cons: ["Low power", "Basic features"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Sport Bike",
    description: "High Performance. High-performance motorcycles built for speed.",
    bestFor: "Racing and performance riding",
    engineRange: "150–600cc",
    topSpeed: "150-250 km/h",
    pros: ["Fast acceleration", "Aerodynamic design"],
    cons: ["Aggressive posture", "Less comfortable"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Superbike",
    description: "High-performance sport motorcycle built for extreme speed and racing technology.",
    bestFor: "Track riding and high-speed performance",
    engineRange: "600–1000cc+",
    topSpeed: "250–320+ km/h",
    pros: ["Extreme speed", "Advanced electronics", "Premium design"],
    cons: ["Expensive", "Aggressive riding posture", "High maintenance"],
    seating: "1-2",
    type: "bike"
  },
  {
    name: "Naked / Street",
    description: "Sporty & Comfortable. Sporty bikes without full body fairing.",
    bestFor: "City and highway riding",
    engineRange: "150–900cc",
    topSpeed: "130-220 km/h",
    pros: ["Comfortable", "Powerful", "Stylish"],
    cons: ["Wind blast", "Minimal protection"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Cruiser",
    description: "Relaxed Riding. Low-slung bikes designed for relaxed riding.",
    bestFor: "Long-distance cruising",
    engineRange: "250–1800cc",
    topSpeed: "120-180 km/h",
    pros: ["Comfortable seating", "Smooth ride"],
    cons: ["Heavy", "Low ground clearance"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Touring",
    description: "Long Distance. Built for long-distance travel.",
    bestFor: "Highway touring",
    engineRange: "500–1800cc",
    topSpeed: "160-220 km/h",
    pros: ["Comfortable", "Luggage capacity"],
    cons: ["Heavy", "Expensive"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Adventure (ADV)",
    description: "All Terrain. Designed for both road and off-road riding.",
    bestFor: "Adventure trips, rough terrain",
    engineRange: "250–1300cc",
    topSpeed: "140-200 km/h",
    pros: ["High ground clearance", "Versatile"],
    cons: ["Tall seat height", "Heavy"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Dirt Bike",
    description: "Off-Road Focused. Lightweight bikes for off-road riding.",
    bestFor: "Trails, motocross",
    engineRange: "100–450cc",
    topSpeed: "80-120 km/h",
    pros: ["Light", "Strong suspension"],
    cons: ["Not street legal", "High maintenance"],
    seating: "1",
    type: "bike"
  },
  {
    name: "Dual-Sport",
    description: "Street Legal Off-Road. Street-legal bikes that can go off-road.",
    bestFor: "Mixed terrain",
    engineRange: "200–650cc",
    topSpeed: "110-150 km/h",
    pros: ["Versatile", "Durable"],
    cons: ["Vibration", "Small fuel tank"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Cafe Racer",
    description: "Retro Style. Retro-styled sporty motorcycles.",
    bestFor: "Style and short rides",
    engineRange: "250–900cc",
    topSpeed: "130-180 km/h",
    pros: ["Classic look", "Lightweight"],
    cons: ["Aggressive posture", "Minimal comfort"],
    seating: "1-2",
    type: "bike"
  },
  {
    name: "Scrambler",
    description: "Retro Off-Road. Retro bikes with off-road capability.",
    bestFor: "Light off-road and city riding",
    engineRange: "250–1200cc",
    topSpeed: "130-190 km/h",
    pros: ["Stylish", "Versatile"],
    cons: ["No wind protection", "Pricey"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Electric Bike",
    description: "Eco-Friendly. Runs on electric power.",
    bestFor: "Eco-friendly commuting",
    engineRange: "Electric",
    topSpeed: "80-150 km/h",
    pros: ["No fuel", "Silent", "Low maintenance"],
    cons: ["Range anxiety", "Charging time"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Scooter",
    description: "City Ease. Step-through frame with automatic transmission.",
    bestFor: "Easy city commuting",
    engineRange: "90–160cc",
    topSpeed: "80-110 km/h",
    pros: ["Easy to ride", "Storage space"],
    cons: ["Small wheels", "Not for highway"],
    seating: "2",
    type: "bike"
  },
  {
    name: "Roadster",
    description: "Modern Naked Performance. High-performance naked motorcycles with a focus on agility, minimalist design, and punchy power delivery.",
    bestFor: "Enthusiasts, city riding, and performance naked bike fans",
    engineRange: "600–1200cc+",
    topSpeed: "180–240 km/h",
    pros: ["Agile handling", "Powerful engine", "Minimalist aesthetic", "Versatile"],
    cons: ["No wind protection", "Exposed components", "Limited luggage space"],
    seating: "2",
    type: "bike"
  }
];

