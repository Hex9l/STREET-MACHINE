import React, { useState, useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, X, ArrowLeft, Gauge, Zap, Wind } from 'lucide-react';
import ImageLoader from '../components/ui/ImageLoader';

const Compare = () => {
    const { compareList, removeFromCompare, clearComparison } = useCompare();

    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxCars = isMobile ? 2 : 3;
    const displayedVehicles = compareList.slice(0, maxCars);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15, mass: 0.5 } }
    };

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden px-8 md:px-8">
                {/* ─── Top Navigation ─── */}
                <div className="absolute top-6 left-4 md:top-10 md:left-10 z-50">
                    <Link to="/" className="inline-flex items-center group">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/40 flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] group-hover:text-white transition-all backdrop-blur-md shadow-2xl shadow-black/50 text-white/70">
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Background Texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center p-6 md:p-8 border border-white/10 bg-[#0a0a0a] backdrop-blur-md w-full max-w-sm md:max-w-md rounded-lg shadow-2xl"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                            <Zap size={32} className="text-[#ef4444]" />
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-display font-black italic uppercase mb-3 text-white">Empty Matrix</h1>
                    <p className="text-gray-500 mb-6 font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-relaxed max-w-xs mx-auto md:max-w-none">
                        Select up to 3 vehicles from the inventory to initiate a detailed technical comparison.
                    </p>
                    <Link to="/cars" className="block w-full sm:w-max mx-auto">
                        <Button variant="primary" className="w-full sm:w-auto px-6 py-4 sm:px-10">
                            <ArrowLeft strokeWidth={2.5} size={18} className="mr-3 transition-transform group-hover:-translate-x-1.5" />
                            <span className="translate-y-[1px]">Access Inventory</span>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Define the rows for the comparison matrix
    const specsConfig = [
        { label: "Price", key: "price", format: (val) => `₹${parseInt(val).toLocaleString('en-IN')}`, highlight: true },
        { label: "Engine", key: "specs.engine" },
        { label: "Power", key: "specs.power", highlight: true },
        { label: "Torque", key: "specs.torque" },
        { label: "0-100 KPH", key: "specs.zeroToHundred" },
        { label: "Top Speed", key: "specs.topSpeed", highlight: true },
        { label: "Transmission", key: "specs.transmission" },
        { label: "Drivetrain", key: "specs.driveType" },
        { label: "Weight", key: "dimensions.weight" },
        { label: "Seating", key: "dimensions.seating" },
        { label: "Year", key: "launchYear" },
    ];

    // Helper to safely access nested properties
    const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 'N/A';
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-12 md:pt-16 px-0 md:px-8 text-white overflow-x-hidden block">
            <div className="container mx-auto">

                {/* ─── Top Navigation ─── */}
                <div className="mb-10 md:mb-16 px-4 md:px-0">
                    <Link to="/" className="inline-flex items-center group">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-1.5 transition-transform duration-300" />
                        </div>
                    </Link>
                </div>

                {/* Header - Perfected Balance & Aesthetics */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-16 border-b border-white/10 pb-6 md:pb-10 px-4 md:px-0">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <span className="text-[#ef4444] uppercase tracking-[0.4em] text-[8px] sm:text-[10px] font-black block mb-2 opacity-80">Matrix Analysis // Technical</span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black italic text-white uppercase tracking-tighter leading-none">
                            Comparison <span className="text-[#ef4444] border-b-2 border-[#ef4444]/30">Matrix</span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <Link to="/cars">
                            <Button variant="secondary" className="bg-white/5 border-white/10 hover:border-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444] py-2.5 px-4 sm:py-3.5 sm:px-8 text-[11px] sm:text-xs font-black tracking-widest transition-all duration-200">
                                <ArrowLeft size={16} className="mr-2 opacity-70" /> ADD VEHICLE
                            </Button>
                        </Link>
                        <Button variant="secondary" onClick={clearComparison} className="bg-red-500/5 border-red-500/10 hover:border-red-500 text-red-500 hover:text-white hover:bg-red-500 py-2.5 px-4 sm:py-3.5 sm:px-8 text-[11px] sm:text-xs font-black tracking-widest transition-all duration-200">
                            <Trash2 size={16} className="mr-2 opacity-70" /> CLEAR MATRIX
                        </Button>
                    </div>
                </div>

                {/* Matrix Grid */}
                <div className="overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
                    <div
                        className="w-full grid gap-x-2 sm:gap-x-4 md:gap-x-8 gap-y-0"
                        style={{
                            gridTemplateColumns: `minmax(90px, ${isMobile ? '30%' : '220px'}) repeat(${maxCars}, minmax(${isMobile ? '35vw' : '200px'}, 1fr))`
                        }}
                    >

                        {/* 1. Vehicle Headers - Final Pixel-Perfect Polish */}
                        <div className="sticky left-0 z-40 bg-[#050505]/98 backdrop-blur-3xl flex flex-col justify-end pb-3 sm:pb-10 border-b-2 border-white/10 pr-3 pl-4 md:pl-0 shadow-[15px_0_30px_-10px_rgba(0,0,0,0.9)]">
                            <span className="text-[#ef4444] font-black uppercase tracking-[0.4em] text-[6px] sm:text-[11px] mb-0.5 leading-none opacity-80">TECHNICAL //</span>
                            <span className="text-white font-display font-black italic uppercase text-[11px] sm:text-2xl leading-none tracking-tighter">CROSS<br className="hidden sm:block" />CHECK</span>
                        </div>

                        {displayedVehicles.map((vehicle) => (
                            <motion.div
                                key={vehicle._id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group flex flex-col justify-end pb-3 sm:pb-10 border-b-2 border-[#ef4444]/60 snap-start px-2.5 md:px-0"
                            >
                                <div className="aspect-[16/10] sm:aspect-[4/3] md:aspect-video relative overflow-hidden rounded-md sm:rounded-xl bg-gradient-to-br from-[#111] to-[#000] mb-2 sm:mb-6 border border-white/10 group-hover:border-[#ef4444] transition-all duration-200 group/image shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                                    <ImageLoader
                                        src={vehicle.images[0] || 'https://via.placeholder.com/600x400?text=Machine'}
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover scale-100 transition-transform duration-200"
                                        imagePreset="group-hover:scale-110"
                                    />

                                    {/* Remove Button - Micro-Polish */}
                                    <button
                                        onClick={() => removeFromCompare(vehicle._id)}
                                        className="absolute top-1.5 right-1.5 z-50 bg-black/80 backdrop-blur-md border border-white/20 text-white w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-[#ef4444] transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 shadow-xl"
                                        title="Remove"
                                    >
                                        <X className="w-2.5 h-2.5 sm:w-4 sm:h-4 md:w-5 md:h-5" strokeWidth={3} />
                                    </button>
                                </div>
                                <h3 className="text-[13px] sm:text-xl md:text-2xl font-display font-black italic uppercase mb-0.5 leading-none text-white group-hover:text-[#ef4444] transition-colors line-clamp-1 tracking-tight">{vehicle.name}</h3>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="w-0.5 h-2 sm:w-1 sm:h-3 bg-[#ef4444] block"></span>
                                    <p className="text-gray-500 text-[6px] sm:text-[11px] font-black uppercase tracking-widest truncate">{vehicle.brand}</p>
                                </div>
                            </motion.div>
                        ))}


                        {/* Placeholder slots to keep grid structure */}
                        {[...Array(maxCars - displayedVehicles.length)].map((_, i) => (
                            <div key={`placeholder-${i}`} className="border-b-2 border-white/5 flex flex-col items-center justify-end pb-8 opacity-40">
                                <Link to="/cars" className="flex flex-col items-center group">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 border-dashed flex items-center justify-center mb-4 group-hover:border-[#ef4444] group-hover:bg-[#ef4444]/10 group-hover:text-[#ef4444] transition-all duration-200">
                                        <ArrowLeft size={20} className="rotate-180" />
                                    </div>
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Add Vehicle</span>
                                </Link>
                            </div>
                        ))}


                        {/* 2. Specs Rows - Ultimate Precision */}
                        {specsConfig.map((row, idx) => (
                            <React.Fragment key={row.key}>
                                {/* Label - Sticky Pillar */}
                                <div
                                    className={`py-3 sm:py-8 md:py-10 border-b border-white/[0.05] flex items-center pr-3 md:pr-6 sticky left-0 z-30 bg-[#050505]/98 backdrop-blur-2xl shadow-[15px_0_30px_-10px_rgba(0,0,0,0.9)] pl-4 md:pl-0 group/row transition-colors hover:bg-white/[0.02]`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`font-black uppercase tracking-[0.2em] text-[7px] sm:text-[11px] leading-none mb-1 ${row.highlight ? 'text-[#ef4444]' : 'text-gray-600'}`}>
                                            {row.label}
                                        </span>
                                        {row.highlight && <div className="w-3 sm:w-4 h-0.5 bg-[#ef4444]" />}
                                    </div>
                                </div>

                                {/* Values - Perfected Typography */}
                                {displayedVehicles.map((vehicle) => (
                                    <motion.div
                                        key={`${vehicle._id}-${row.key}`}
                                        variants={itemVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, margin: "-50px" }}
                                        className={`py-3 sm:py-8 md:py-10 border-b border-white/[0.05] flex items-center font-display uppercase italic transition-all duration-200 hover:bg-[#ef4444]/5 group/cell px-2.5 md:px-0 ${row.highlight ? 'text-[11px] sm:text-xl md:text-4xl text-white font-black tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'text-[9px] sm:text-sm md:text-xl text-gray-400 font-bold tracking-tight'}`}
                                    >
                                        <span className="line-clamp-2 transition-all duration-200 group-hover/cell:text-white group-hover/cell:translate-x-1">
                                            {row.format
                                                ? row.format(getValue(vehicle, row.key))
                                                : getValue(vehicle, row.key)}
                                        </span>
                                    </motion.div>
                                ))}

                                {[...Array(maxCars - displayedVehicles.length)].map((_, i) => (
                                    <div key={`empty-${idx}-${i}`} className="py-3 sm:py-10 border-b border-white/[0.05] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)] opacity-5"></div>
                                ))}
                            </React.Fragment>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Compare;
