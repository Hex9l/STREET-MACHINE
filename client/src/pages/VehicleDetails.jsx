import { API_URL } from '../api.js';
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
const fetcher = url => fetch(url).then(res => res.json());

import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../components/ui/Button';
import {
    Zap, Gauge, Fuel, Wind, ArrowLeft, ChevronDown, Check, X, BatteryCharging, Rotate3d
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCompare } from '../context/CompareContext';
import ImageLoader from '../components/ui/ImageLoader';
import Skeleton from '../components/ui/Skeleton';

gsap.registerPlugin(ScrollTrigger);

const SpecCard = ({ label, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: delay * 0.1 }}
        className="bg-[#0f0f0f] border border-white/8 p-4 md:p-6 flex flex-col gap-3 hover:border-[#ef4444]/60 transition-all duration-200 group relative overflow-hidden cursor-default"
        whileHover={{ scale: 1.03, y: -2 }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute top-0 right-0 w-12 h-12 bg-[#ef4444]/8 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-[#ef4444]/20" />
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[#ef4444]/10 flex items-center justify-center border border-[#ef4444]/20 group-hover:bg-[#ef4444]/20 group-hover:border-[#ef4444]/50 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-200">
            <Icon className="text-[#ef4444]" size={16} />
        </div>
        <div>
            <span className="text-gray-600 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] block mb-1">{label}</span>
            <span className="text-base md:text-xl lg:text-2xl font-display font-bold italic text-white uppercase leading-tight">{value || 'N/A'}</span>
        </div>
    </motion.div>
);

const FeatureTag = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border-l-2 border-[#ef4444] text-[9px] md:text-[10px] text-gray-300 uppercase font-bold tracking-widest hover:bg-[#ef4444]/10 hover:text-white hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] transition-all duration-200 cursor-default"
    >
        <div className="w-1 h-1 bg-[#ef4444] rounded-full shrink-0"></div>
        {children}
    </motion.div>
);

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const { addToCompare, compareList } = useCompare();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // GSAP References
    const pageRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const detailsRef = useRef(null);

    // Scroll handling for sticky header
    const [isSticky, setIsSticky] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const heroRef = useRef(null);

    useGSAP(() => {
        if (loading || !vehicle || !imageRef.current || !titleRef.current || !detailsRef.current || !heroRef.current) return;

        // Cinematic Entry Sequence
        const tl = gsap.timeline();

        tl.fromTo(imageRef.current,
            { scale: 1.2, opacity: 0, filter: 'blur(20px)' },
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2, ease: "power4.out" }
        )
            .fromTo(titleRef.current,
                { y: 100, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
                { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.3, ease: "expo.out" },
                "-=1.2"
            )
            .fromTo(detailsRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.25, stagger: 0.1, ease: "power2.out" },
                "-=1"
            );

        // Scroll Parallax for the main image
        gsap.to(imageRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1.5 // Added inertia delay for ultra-premium feel
            }
        });

    }, [loading, vehicle]);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 30);
            if (heroRef.current) {
                const heroHeight = heroRef.current.offsetHeight;
                setIsSticky(window.scrollY > heroHeight - 100);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data: swrVehicle, error: swrError } = useSWR(`${API_URL}/api/vehicles/${id}`, fetcher, { revalidateOnFocus: false });

    useEffect(() => {
        if (swrVehicle) {
            setVehicle(swrVehicle);
            setLoading(false);
        } else if (swrError) {
            console.error('Error fetching vehicle:', swrError);
            toast.error("Failed to load vehicle data");
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [swrVehicle, swrError]);

    useEffect(() => {
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Skeleton */}
                <Skeleton className="w-full aspect-video md:h-[70vh]" variant="card" />
                
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4 w-full md:w-1/2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-3/4" />
                    </div>
                    <div className="w-full md:w-1/4 h-12">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>

                {/* Specs Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" variant="card" />
                    ))}
                </div>
            </div>
        </div>
    );

    if (!vehicle) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-display uppercase italic mb-4">Vehicle Not Found</h2>
            <Link to="/showroom">
                <Button variant="primary">Return to Showroom</Button>
            </Link>
        </div>
    );

    // Data Safes
    const getImageUrl = (imagePath, width = 1920) => {
        if (!imagePath) return 'https://via.placeholder.com/1920x1080/111111/444444?text=Machine';
        if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
        if (imagePath.includes('cloudinary.com') && imagePath.includes('/upload/')) {
            if (imagePath.match(/\/upload\/(q_|f_|w_|c_)/)) return imagePath;
            return imagePath.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
        }
        return imagePath;
    };

    const mainImage = getImageUrl(vehicle.images?.[selectedImageIndex]);
    const specs = vehicle.specs || {};
    const dimensions = vehicle.dimensions || {};
    const features = vehicle.features || [];
    const pros = vehicle.pros || [];
    const cons = vehicle.cons || [];
    const isInCompare = compareList.find(v => v._id === vehicle._id);

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">

            {/* 1. Immersive Hero Section */}
            <div ref={heroRef} className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col">
                {/* Floating Back Button */}
                <button onClick={() => {
                    if (window.history.length > 2) {
                        navigate(-1);
                    } else {
                        navigate('/cars');
                    }
                }}
                    className="absolute top-6 left-4 md:top-10 md:left-10 z-50 inline-flex items-center group">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/40 flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] group-hover:text-white transition-all backdrop-blur-md shadow-2xl shadow-black/50 text-white/70">
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                    </div>
                </button>

                {/* Car Image — Main Visual (top 60% of screen) */}
                <div className="flex-1 relative flex items-center justify-center px-0 md:px-12 pt-16 md:pt-10 overflow-hidden perspective-[1000px]">
                    <div ref={imageRef} className="w-full max-w-4xl h-full relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="w-full h-full absolute top-0 left-0"
                            >
                                <ImageLoader
                                    src={mainImage}
                                    alt={vehicle.name}
                                    className="w-full h-full object-contain object-center will-change-transform"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    {/* Subtle bottom fade behind text */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                </div>

                {/* Hero Content — Attached below the car */}
                <div className="relative z-20 px-4 md:px-12 lg:px-24 pb-10 md:pb-16 pt-4 md:pt-6 shrink-0">
                    <div ref={titleRef}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-[#ef4444] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                {vehicle.brand}
                            </span>
                            <span className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] border-l border-white/20 pl-3">
                                {vehicle.type === 'bike' ? `LAUNCH YEAR ${vehicle.launchYear}` : `${vehicle.launchYear} Edition`}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black italic uppercase tracking-tighter mb-4 md:mb-6 text-white leading-[0.9] drop-shadow-2xl">
                            {vehicle.name}
                        </h1>

                        <div ref={detailsRef} className="flex flex-row flex-wrap gap-6 md:gap-12 border-l-2 border-[#ef4444] pl-5 py-1 mb-8">
                            <div>
                                <span className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5">Power</span>
                                <span className="text-lg md:text-3xl font-display font-bold italic text-white">{specs.power || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5">0-100 KPH</span>
                                <span className="text-lg md:text-3xl font-display font-bold italic text-[#ef4444]">{specs.zeroToHundred || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5">Top Speed</span>
                                <span className="text-lg md:text-3xl font-display font-bold italic text-white">{specs.topSpeed || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Image Thumbnails Gallery (Hero Integrated) */}
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="relative w-full max-w-3xl mt-4 md:mt-6">
                                {/* Scroll Indicator Gradient */}
                                <div className="absolute top-0 right-0 bottom-6 w-12 md:w-24 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-20" />

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.25 }}
                                    className="flex gap-3 md:gap-4 overflow-x-auto pb-6 pt-4 px-2 md:px-4 snap-x w-full border-t border-white/5 
                                [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-[#ef4444] [&::-webkit-scrollbar-thumb]:rounded-full"
                                >
                                    {vehicle.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`group shrink-0 snap-start relative w-16 h-10 md:w-[120px] md:h-[70px] rounded object-cover overflow-hidden transition-all duration-200 bg-black/80 border-2 ${selectedImageIndex === idx
                                                ? 'border-white opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105 filter brightness-110 z-10'
                                                : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/40 hover:scale-[1.02]'
                                                }`}
                                        >
                                            <ImageLoader
                                                src={getImageUrl(img, 400)}
                                                alt={`${vehicle.name} view ${idx + 1}`}
                                                className={`w-full h-full object-cover transition-transform duration-200 ${selectedImageIndex === idx ? 'scale-110' : 'group-hover:scale-110 scale-100'}`}
                                            />
                                            {/* Subtle dark overlay for inactive */}
                                            {selectedImageIndex !== idx && (
                                                <div className="absolute inset-0 bg-black/30 transition-opacity duration-200 group-hover:opacity-0" />
                                            )}
                                        </button>
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll Indicator - Hides on scroll */}
                <AnimatePresence>
                    {!hasScrolled && (
                        <motion.div
                            key="explore-indicator"
                            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group"
                            onClick={() => {
                                if (window.lenis) {
                                    window.lenis.scrollTo(window.innerHeight, { duration: 0.3 });
                                } else {
                                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                                }
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12, transition: { duration: 0.3 } }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                        >

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                                className="relative flex items-center justify-center w-8 h-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                                    className="absolute inset-0 rounded-full border border-[#ef4444]"
                                />
                                <div className="w-6 h-6 rounded-full border border-[#ef4444]/60 bg-[#ef4444]/10 flex items-center justify-center group-hover:bg-[#ef4444] group-hover:border-[#ef4444] transition-all duration-200 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                                    <ChevronDown className="text-[#ef4444] group-hover:text-white w-3.5 h-3.5 transition-colors" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Sticky Navigation Bar */}
            <div className={`sticky top-0 z-50 transition-all duration-200 border-b border-white/10 ${isSticky ? 'bg-black/80 backdrop-blur-md py-3 md:py-4' : 'bg-[#050505] py-4 md:py-6'}`}>
                <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0 mr-2 md:mr-4">
                        <h3 className="text-sm sm:text-lg md:text-xl font-display font-bold italic uppercase truncate">{vehicle.name}</h3>
                        <span className="text-[#ef4444] text-[10px] md:text-xs font-bold uppercase tracking-widest block md:inline md:mt-1">
                            Est. ₹{parseInt(vehicle.price).toLocaleString('en-IN')}
                        </span>
                    </div>

                    <div className="hidden md:flex gap-2 md:gap-4 shrink-0">
                        <Button
                            variant="secondary"
                            className={`px-3 md:px-4 py-2 border-white/10 hover:border-[#ef4444] ${isInCompare ? 'bg-[#ef4444] text-white border-[#ef4444]' : ''}`}
                            onClick={() => addToCompare(vehicle)}
                        >
                            {isInCompare ? <Check size={16} /> : <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs uppercase font-bold"><Rotate3d size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Compare</span></div>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Grid */}
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Column: Description & Features */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl md:text-3xl font-display font-black italic uppercase mb-5 md:mb-8">
                            <span className="text-[#ef4444] mr-2">///</span> Engineering Masterpiece
                        </h2>

                        <p className="text-sm md:text-base text-gray-400 leading-7 mb-8 font-light">
                            {vehicle.description || "Experience the pinnacle of automotive engineering. This machine combines raw power with sophisticated design, delivering a driving experience that is both visceral and refined."}
                        </p>

                        {vehicle.category && vehicle.category.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mb-6"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.category.map((cat, i) => (
                                        <span key={i} className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-[9px] md:text-[10px] uppercase font-bold tracking-widest rounded-sm">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mb-8 md:mb-12"
                        >
                            <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-4 border-b border-white/10 pb-3">Key Features</h3>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {features.length > 0 ? features.map((feature, i) => (
                                    <FeatureTag key={i}>{feature}</FeatureTag>
                                )) : <span className="text-gray-500 italic text-sm">No features listed.</span>}
                            </div>
                        </motion.div>

                        {vehicle.colors && vehicle.colors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mb-8 md:mb-12"
                            >
                                <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-white mb-4 border-b border-white/10 pb-3">Available Colors</h3>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {vehicle.colors.map((color, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-[#111] border border-white/10 text-[9px] md:text-[10px] text-gray-300 uppercase font-bold tracking-widest">
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Pros and Cons */}
                        {(pros.length > 0 || cons.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                                className="mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Pros */}
                                {pros.length > 0 && (
                                    <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 shadow-inner">
                                        <h3 className="text-[#4ade80] text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            <Check size={16} /> Pros
                                        </h3>
                                        <ul className="space-y-3">
                                            {pros.map((pro, i) => (
                                                <li key={i} className="text-gray-400 text-xs md:text-sm flex items-start gap-3 leading-relaxed">
                                                    <span className="text-[#4ade80] shrink-0 block w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ marginTop: '0.4rem' }}></span>
                                                    <span>{pro}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Cons */}
                                {cons.length > 0 && (
                                    <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 shadow-inner">
                                        <h3 className="text-[#ef4444] text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            <X size={16} /> Cons
                                        </h3>
                                        <ul className="space-y-3">
                                            {cons.map((con, i) => (
                                                <li key={i} className="text-gray-400 text-xs md:text-sm flex items-start gap-3 leading-relaxed">
                                                    <span className="text-[#ef4444] shrink-0 block w-1.5 h-1.5 rounded-full bg-[#ef4444]" style={{ marginTop: '0.4rem' }}></span>
                                                    <span>{con}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* EV Specific Details Section */}
                        {specs.fuelType && (
                            (() => {
                                const fuelTypesArray = Array.isArray(specs.fuelType) ? specs.fuelType : [specs.fuelType];
                                return fuelTypesArray.some(ft => [
                                    'fully electric (battery ev)',
                                    'plug-in hybrid (petrol + electric)',
                                    'electric',
                                    'ev'
                                ].includes(typeof ft === 'string' ? ft.toLowerCase() : ''))
                            })()
                        ) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                                    className="mb-8 md:mb-12 border-t border-white/10 pt-8"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <BatteryCharging className="text-[#4ade80]" size={24} />
                                        <h3 className="text-lg md:text-xl font-display font-bold uppercase tracking-wider text-white">
                                            BATTERY & RANGE
                                        </h3>
                                    </div>
                                    <div className="space-y-5">
                                        {specs.batteryCapacity && (
                                            <div>
                                                <h4 className="text-white font-bold text-sm md:text-base mb-1">Battery Capacity</h4>
                                                <p className="text-gray-300 text-sm md:text-base">{specs.batteryCapacity}</p>
                                            </div>
                                        )}
                                        {specs.drivingRange && (
                                            <div>
                                                <h4 className="text-white font-bold text-sm md:text-base mb-1">Driving Range (WLTP)</h4>
                                                <p className="text-gray-300 text-sm md:text-base">{specs.drivingRange}</p>
                                            </div>
                                        )}
                                        {specs.chargingTime && (
                                            <div>
                                                <h4 className="text-white font-bold text-sm md:text-base mb-1">Charging (DC Fast Charging)</h4>
                                                <p className="text-gray-300 text-sm md:text-base">{specs.chargingTime}</p>
                                            </div>
                                        )}
                                        {specs.maxChargingPower && (
                                            <div>
                                                <h4 className="text-white font-bold text-sm md:text-base mb-1">Max DC Charging Power</h4>
                                                <p className="text-gray-300 text-sm md:text-base">{specs.maxChargingPower}</p>
                                            </div>
                                        )}
                                        {specs.evDescription && (
                                            <div className="pt-2">
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    {specs.evDescription}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                    </div>

                    {/* Right Column: "Tech Specs" Matrix */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-8 relative">
                            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 border-t-2 border-r-2 border-[#ef4444] opacity-50"></div>

                            <h3 className="text-base md:text-xl font-display font-bold italic uppercase mb-5 md:mb-8 text-white">Technical Data</h3>

                            <div className="space-y-3 md:space-y-5">
                                {specs.engine && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Engine</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{specs.engine}</span>
                                    </div>
                                )}
                                {specs.transmission && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Transmission</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{specs.transmission}</span>
                                    </div>
                                )}
                                {specs.driveType && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Drive Type</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{specs.driveType}</span>
                                    </div>
                                )}
                                {specs.fuelType && specs.fuelType.length > 0 && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Fuel Type</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{specs.fuelType.join(', ')}</span>
                                    </div>
                                )}
                                {specs.mileage && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Mileage</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{specs.mileage}</span>
                                    </div>
                                )}
                                {dimensions.seating && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Seating</span>
                                        <span className="font-display font-bold italic text-sm md:text-base">{dimensions.seating} Persons</span>
                                    </div>
                                )}
                                {dimensions.weight && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Weight</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{dimensions.weight}</span>
                                    </div>
                                )}
                                {dimensions.fuelTank && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Fuel Tank</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{dimensions.fuelTank}</span>
                                    </div>
                                )}
                                {dimensions.groundClearance && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Gr. Clearance</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{dimensions.groundClearance}</span>
                                    </div>
                                )}
                                {dimensions.wheelbase && (
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="text-gray-500 text-[10px] md:text-xs uppercase font-bold tracking-widest">Wheelbase</span>
                                        <span className="font-display font-bold italic text-sm md:text-base text-right max-w-[55%]">{dimensions.wheelbase}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* 4. Full Performance Cards */}
                <div className="mt-12 md:mt-20">
                    <h3 className="text-center text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] text-[#ef4444] mb-3">Performance Metrics</h3>
                    <h2 className="text-center text-2xl md:text-4xl font-display font-black italic uppercase mb-8 md:mb-14">Numbers That Matter</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <SpecCard icon={Gauge} label="Top Speed" value={specs.topSpeed} delay={0} />
                        <SpecCard icon={Zap} label="Max Power" value={specs.power} delay={1} />
                        <SpecCard icon={Wind} label="0-100 km/h" value={specs.zeroToHundred} delay={2} />
                        <SpecCard icon={Fuel} label="Torque" value={specs.torque} delay={3} />
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 p-4 pb-6 flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                <div className="flex-1 min-w-0">
                    <span className="text-white text-lg font-display font-black italic tracking-tight truncate block leading-tight">{vehicle.name}</span>
                    <span className="text-[#ef4444] text-[10px] font-bold uppercase tracking-widest block">Est. ₹{parseInt(vehicle.price).toLocaleString('en-IN')}</span>
                </div>
                <Button
                    variant={isInCompare ? "primary" : "secondary"}
                    className={`flex-shrink-0 px-6 py-3 border-white/10 ${isInCompare ? 'bg-[#ef4444] text-white border-[#ef4444]' : ''}`}
                    onClick={() => addToCompare(vehicle)}
                >
                    {isInCompare ? <Check size={18} /> : <div className="flex items-center gap-2 text-xs uppercase font-bold"><Rotate3d size={16} /> Compare</div>}
                </Button>
            </div>

            {/* Pad bottom of page to account for fixed action bar on mobile */}
            <div className="h-24 md:hidden" />
        </div>
    );
};

export default VehicleDetails;
