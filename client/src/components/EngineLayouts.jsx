import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Settings2, Info } from 'lucide-react';

import tyreImg from '../assets/Cars_Tyre.png';
import inlineImg from '../assets/Engine-images/Inline engine.jpg';
import vEngineImg from '../assets/Engine-images/V engine.jpg';
import wEngineImg from '../assets/Engine-images/W engine.jpg';
import boxerImg from '../assets/Engine-images/Flat engine.jpg';
import rotaryImg from '../assets/Engine-images/Rotary.jpg';
import opposedImg from '../assets/Engine-images/Opposed-piston.jpg';

const engineData = [
  {
    id: 'inline',
    name: 'Inline Engine',
    types: 'I2, I3, I4, I5, I6, I8, I12, I16',
    overview: 'Cylinders are arranged in a straight line.',
    pros: ['Simple design', 'Easy maintenance', 'Fuel efficient'],
    cons: ['Longer engine (especially I6)', 'Less compact than V engines'],
    usedIn: 'Most daily cars and entry-level vehicles',
    image: inlineImg,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'group-hover:border-cyan-500/50'
  },
  {
    id: 'v-engine',
    name: 'V Engine',
    types: 'V6, V8, V12, V16, V18, V20, V24',
    overview: 'Cylinders arranged in a V shape.',
    pros: ['Compact length', 'High power output', 'Better performance'],
    cons: ['More complex', 'Higher cost'],
    usedIn: 'Sports cars, SUVs, performance vehicles',
    image: vEngineImg,
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'group-hover:border-red-500/50'
  },
  {
    id: 'w-engine',
    name: 'W Engine',
    types: 'W8, W12, W16, W18, W20, W24',
    overview: 'Combination of two V engines, forming a “W” shape.',
    pros: ['Extremely powerful', 'Compact for high cylinder count'],
    cons: ['Very complex', 'Expensive', 'Rare'],
    usedIn: 'Bugatti Chiron, Bentley Continental GT',
    image: wEngineImg,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'group-hover:border-purple-500/50'
  },
  {
    id: 'boxer',
    name: 'Flat / Boxer Engine',
    types: 'Flat-2, Flat-3, Flat-4, Flat-6, Flat-8, Flat-10, Flat-12, Flat-16',
    overview: 'Cylinders lie flat and move opposite each other.',
    pros: ['Low center of gravity', 'Better stability', 'Smooth operation'],
    cons: ['Wider engine', 'More complex servicing'],
    usedIn: 'Subaru, Porsche',
    image: boxerImg,
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'group-hover:border-emerald-500/50'
  },
  {
    id: 'rotary',
    name: 'Rotary Engine (Wankel)',
    types: '13B, 20B, 26B, 13B-REW, 13B-MSP, 20B-REW, 26B-REW',
    overview: 'Uses a rotor instead of pistons.',
    pros: ['Compact size', 'High RPM capability', 'Lightweight'],
    cons: ['Lower fuel efficiency', 'Higher wear'],
    usedIn: 'Mazda (RX series)',
    image: rotaryImg,
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'group-hover:border-yellow-500/50'
  },
  {
    id: 'opposed',
    name: 'Opposed Piston Engine',
    types: 'OPOC, Opposed-Piston',
    overview: 'Each cylinder has two pistons moving toward each other (no cylinder head).',
    pros: ['High efficiency', 'Better combustion', 'Lower heat loss'],
    cons: ['Complex design', 'Less common'],
    usedIn: 'Military vehicles, Heavy-duty engines',
    image: opposedImg,
    color: 'from-zinc-500/20 to-gray-500/20',
    borderColor: 'group-hover:border-gray-500/50'
  }
];

const EngineLayouts = () => {
  const [activeLayout, setActiveLayout] = useState(engineData[0].id);

  const activeData = engineData.find(e => e.id === activeLayout);

  return (
    <section className="relative w-full bg-[#030303] py-20 px-4 sm:px-6 md:px-12 border-t border-white/10 overflow-hidden">
      {/* Background glow based on active item */}
      <div className="absolute inset-0 pointer-events-none opacity-30 transition-colors duration-700 ease-in-out">
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-tr ${activeData.color}`}></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="relative text-center mb-16 flex flex-col justify-center items-center">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase italic tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    Engine
                </h2>
                <img 
                    src={tyreImg} 
                    alt="Tyre" 
                    className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain animate-spin"
                    style={{ animationDuration: '4s' }}
                />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase italic tracking-tighter text-[#ef4444] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    Layout Types
                </h2>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold font-sans relative z-10">
                The Complete Guide to Inner Mechanics. Select a layout to explore its architecture and characteristics.
            </p>
        </div>

        {/* Layout Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {engineData.map((engine) => (
                <button
                    key={engine.id}
                    onClick={() => setActiveLayout(engine.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                        activeLayout === engine.id 
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                            : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white'
                    }`}
                >
                    {engine.name.split(' ')[0]}
                </button>
            ))}
        </div>

        {/* Interactive Cards Display */}
        <AnimatePresence mode="wait">
            <motion.div
                key={activeData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
                {/* Engine Image & Visuals */}
                <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden group border border-white/10 hover:border-white/30 transition-colors duration-500 bg-[#0a0a0a]">
                    <img 
                        src={activeData.image} 
                        alt={activeData.name} 
                        className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                </div>

                {/* Specs & Pros/Cons */}
                <div className="flex flex-col gap-6 md:gap-8">
                    <div>
                        <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
                            <span className="text-[#ef4444] font-bold text-xs uppercase tracking-widest">{activeData.types}</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-display font-black uppercase italic text-white leading-none mb-3">
                            {activeData.name}
                        </h3>
                        <p className="text-gray-300 text-sm md:text-base border-l-2 border-[#ef4444] pl-3">
                            {activeData.overview}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Pros */}
                        <div className="bg-white/5 border border-green-500/20 rounded-xl p-5 hover:border-green-500/50 transition-colors">
                            <h4 className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-xs mb-4">
                                <CheckCircle2 size={16} /> Advantages
                            </h4>
                            <ul className="space-y-3">
                                {activeData.pros.map((pro, index) => (
                                    <li key={index} className="text-gray-300 text-xs md:text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-1.5 flex-shrink-0"></div>
                                        <span>{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cons */}
                        <div className="bg-white/5 border border-red-500/20 rounded-xl p-5 hover:border-red-500/50 transition-colors">
                            <h4 className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                                <XCircle size={16} /> Limitations
                            </h4>
                            <ul className="space-y-3">
                                {activeData.cons.map((con, index) => (
                                    <li key={index} className="text-gray-300 text-xs md:text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 flex-shrink-0"></div>
                                        <span>{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Used In */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-white/30 transition-colors relative overflow-hidden group">
                        <Settings2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 group-hover:rotate-90 transition-all duration-700" />
                        <h4 className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                            <Info size={16} className="text-[#ef4444]" /> Commonly Used In
                        </h4>
                        <p className="text-white font-display text-lg md:text-xl font-bold uppercase tracking-wide">
                            {activeData.usedIn}
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EngineLayouts;
