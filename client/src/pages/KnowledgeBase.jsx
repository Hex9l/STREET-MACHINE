import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Car, Fuel, Settings2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const KnowledgeBase = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    const categories = [
        { name: "Hatchback", desc: "Rear door + compact body. Built for efficiency & practicality. Great for city, easy parking.", pros: ["Best city car", "Easy parking", "High fuel efficiency"], cons: ["Limited luggage space", "Not highway luxury focused"], example: "First car, students, daily commute" },
        { name: "Sedan", desc: "3-box design (Engine + Cabin + Boot). Built for comfort & stability. Longer wheelbase, better aero.", pros: ["Smooth ride quality", "Premium look", "Highway stability"], cons: ["Lower ground clearance"], example: "Family & business travel" },
        { name: "SUV (Sport Utility Vehicle)", desc: "High ground clearance, strong suspension. Often AWD/4WD. Built for versatility.", pros: ["Bad roads friendly", "Commanding driving position", "Large cabin space"], cons: ["Higher fuel consumption"], example: "Indian roads + long trips" },
        { name: "MPV", desc: "Maximum passengers. 6-8 seats, flexible seating layout. Sliding seats common.", pros: ["Joint families", "Commercial travel", "Maximum space"], cons: ["Bulky handling"], example: "Large family trips" },
        { name: "Sports Car", desc: "Low center of gravity, lightweight, powerful engines. Built for speed and handling.", pros: ["Agile handling", "Fast acceleration", "Aesthetic appeal"], cons: ["Stiff ride", "Low practicality"], example: "Weekend driving, track days" },
        { name: "Supercar", desc: "Next level of sports car. Carbon fiber, mid-engine layout, race tech. Extreme performance.", pros: ["Unmatched speed", "Exclusivity", "Track-ready"], cons: ["Extremely expensive", "Impractical for daily use"], example: "Collecting, extreme track use" },
        { name: "Electric Car (EV)", desc: "No traditional engine. Features Battery pack, Electric motor, Inverter.", pros: ["Instant torque", "Silent drive", "Zero tailpipe emissions"], cons: ["Charging infrastructure dependency"], example: "Eco-friendly commuting, modern tech" },
        { name: "Pickup Truck", desc: "Utility-focused design with an open bed. Used for cargo, off-road, towing.", pros: ["High utility", "Towing capability", "Off-road prowess"], cons: ["Heavy", "Poor fuel economy in cities"], example: "Hauling, commercial use" },
    ];

    const fuels = [
        { name: "Petrol Engine", tech: "Spark plug ignition", traits: "Smooth acceleration, higher RPM, less vibration.", best: "City driving & occasional highways." },
        { name: "Diesel Engine", tech: "Compression ignition", traits: "High torque, strong pulling power, better long-distance efficiency.", best: "Highway & heavy usage." },
        { name: "Mild Hybrid", tech: "Motor assists engine", traits: "Small electric motor helps reduce fuel consumption and smooth acceleration. Does NOT drive alone.", best: "Stop-and-go traffic." },
        { name: "Full Hybrid", tech: "Motor + Engine", traits: "System automatically switches between EV, Petrol, or combined mode.", best: "Maximum efficiency in mixed conditions." },
        { name: "Plug-in Hybrid (PHEV)", tech: "Hybrid + Charging", traits: "Drive short distances on electricity only, use petrol for long trips.", best: "Daily short commutes + occasional long trips." },
        { name: "Fully Electric (EV)", tech: "Battery -> Motor", traits: "Instant torque, regenerative braking, zero tailpipe emissions.", best: "Tech-forward, predictable driving patterns." },
    ];

    const drives = [
        { name: "FWD (Front Wheel Drive)", desc: "Engine powers front wheels. Lightweight, cheaper to produce, better fuel efficiency.", feel: "Stable & predictable." },
        { name: "RWD (Rear Wheel Drive)", desc: "Rear wheels push car forward. Better weight balance, sporty handling, drift capability.", feel: "Dynamic & sport-oriented." },
        { name: "AWD (All Wheel Drive)", desc: "Computer sends power where needed automatically. Maximum grip, safe in rain/snow.", feel: "Planted & confident." },
        { name: "4WD (Four Wheel Drive)", desc: "Mechanical system for off-road with 2H, 4H, 4L modes. Designed for mud, rocks, sand.", feel: "Rugged & unstoppable." },
    ];

    const fields = [
        { name: "Performance", items: ["Horsepower (HP)", "Torque (Nm)", "0-100 km/h", "Top Speed"] },
        { name: "Dimensions", items: ["Length", "Width", "Height", "Wheelbase", "Ground Clearance"] },
        { name: "Efficiency", items: ["Mileage / Range", "Battery Capacity", "Charging Time"] },
        { name: "Comfort", items: ["Seating Capacity", "Boot Space", "Suspension Type"] },
        { name: "Safety", items: ["Airbags", "ADAS", "ABS / ESC", "Crash Rating"] },
    ];

    return (
        <div className="min-h-screen bg-[#050505] pt-8 md:pt-12 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white pb-20 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

            <div className="container mx-auto max-w-[1400px] relative z-10">
                {/* ─── Top Navigation ─── */}
                <div className="mb-10 md:mb-16">
                    <Link to="/" className="inline-flex items-center group">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-1.5 transition-transform duration-300" />
                        </div>
                    </Link>
                </div>

                {/* ─── Header ─── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-24 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/30 mb-6">
                        <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-[#ef4444]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black italic uppercase tracking-tighter mb-4">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-orange-500">Knowledge</span> Base
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs max-w-2xl mx-auto leading-relaxed border-l-2 border-[#ef4444] pl-4 text-left">
                        Cars are not just transportation—they are built around passenger capacity, driving environment, performance expectations, and lifestyle. Master the terminology here.
                    </p>
                </motion.div>

                {/* ─── Core Concepts ─── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
                    {[
                        { title: "Category", subtitle: "Lifestyle & Usage", desc: "Explains HOW the car is used practically.", icon: Car },
                        { title: "Fuel Type", subtitle: "Running Cost & Tech", desc: "Explains HOW the car gets its energy.", icon: Fuel },
                        { title: "Drive Type", subtitle: "Handling & Terrain", desc: "Explains HOW power reaches the wheels.", icon: Settings2 },
                    ].map((concept, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-[#ef4444]/10" />
                            <concept.icon className="w-8 h-8 text-[#ef4444] mb-4 relative z-10" />
                            <h3 className="text-xl md:text-2xl font-display font-black italic uppercase mb-1">{concept.title}</h3>
                            <p className="text-[#ef4444] text-[10px] font-bold uppercase tracking-widest mb-3">{concept.subtitle}</p>
                            <p className="text-gray-400 text-sm">{concept.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ─── 1. Category Breakdown ─── */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[#ef4444] font-display text-4xl font-black italic">01.</span>
                        <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">Vehicle Categories</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-[#111] border border-white/5 p-6 rounded-xl hover:border-[#ef4444]/50 transition-colors group">
                                <h3 className="text-xl font-display font-bold italic uppercase mb-3 text-white group-hover:text-[#ef4444] transition-colors">{cat.name}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[60px]">{cat.desc}</p>
                                <div className="space-y-3 border-t border-white/10 pt-4">
                                    <div>
                                        <span className="text-[9px] text-green-400 uppercase tracking-widest font-bold mb-1.5 block">Advantages:</span>
                                        <ul className="text-[11px] text-gray-300 space-y-1">
                                            {cat.pros.map((p, i) => <li key={i} className="flex gap-2"><span className="text-green-500 opacity-70">▹</span>{p}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-red-400 uppercase tracking-widest font-bold mb-1.5 block">Limitations:</span>
                                        <ul className="text-[11px] text-gray-300 space-y-1">
                                            {cat.cons.map((c, i) => <li key={i} className="flex gap-2"><span className="text-red-500 opacity-70">▹</span>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Example Use:</span>
                                    <span className="text-white text-xs font-bold">{cat.example}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ─── 2. Fuel Types ─── */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[#ef4444] font-display text-4xl font-black italic">02.</span>
                        <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">Deep Engine Technology</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {fuels.map((fuel, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="flex flex-col sm:flex-row gap-4 bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 p-6 rounded-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.05)] transition-shadow">
                                <div className="sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4">
                                    <h3 className="text-lg md:text-xl font-display font-black italic uppercase text-white mb-2">{fuel.name}</h3>
                                    <span className="inline-block bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 px-2 py-1 text-[9px] uppercase tracking-widest font-bold rounded">
                                        {fuel.tech}
                                    </span>
                                </div>
                                <div className="sm:w-2/3 flex flex-col justify-center">
                                    <p className="text-gray-300 text-xs lg:text-sm leading-relaxed mb-3">
                                        {fuel.traits}
                                    </p>
                                    <div>
                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Best For:</span>
                                        <span className="text-white text-xs font-bold">{fuel.best}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ─── 3. Drive Types ─── */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[#ef4444] font-display text-4xl font-black italic">03.</span>
                        <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight">Advanced Vehicle Dynamics</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                        {drives.map((drive, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-[#0d0d0d] p-6 rounded-xl border-l-2 border-[#ef4444]">
                                <h3 className="text-xl font-display font-black italic uppercase mb-3 text-white">{drive.name}</h3>
                                <p className="text-gray-400 text-xs mb-4 min-h-[60px]">{drive.desc}</p>
                                <div className="bg-black/50 p-3 rounded">
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Driving Feel:</span>
                                    <span className="text-[#ef4444] text-xs font-bold uppercase tracking-wider">{drive.feel}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* ─── 4. Industry Level Fields ─── */}
                <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-2xl p-6 md:p-12 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef4444]/10 rounded-full blur-[80px] pointer-events-none -mr-20 -mt-20"></div>

                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <Info className="text-[#ef4444] w-6 h-6" />
                        <h2 className="text-xl md:text-3xl font-display font-black uppercase tracking-tight text-white">Industry Standard Fields</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 relative z-10">
                        {fields.map((field, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-[#ef4444] mb-4 pb-2 border-b border-[#ef4444]/30">{field.name}</h4>
                                <ul className="space-y-2">
                                    {field.items.map((item, i) => (
                                        <li key={i} className="text-gray-300 text-[11px] md:text-xs font-medium uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1 h-1 bg-white/30 rounded-full"></span>{item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

            </div>
        </div>
    );
};

export default KnowledgeBase;
