import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
const fetcher = url => fetch(url).then(res => res.json());

import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, X, Gauge, Zap, Users, Activity, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/ui/VehicleCardSkeleton';
import toast from 'react-hot-toast';
import { useLocation, Link } from 'react-router-dom';

// Highlight matching text in a string
const Highlight = ({ text = '', query = '' }) => {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} className="bg-[#ef4444]/30 text-white rounded-sm px-0.5">{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </span>
    );
};

const Vehicles = ({ type = 'all' }) => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    // Search state
    const [inputValue, setInputValue] = useState('');        // live input
    const [searchQuery, setSearchQuery] = useState('');      // debounced query
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Other filters
    const [sortBy, setSortBy] = useState('mixed');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // SWR Data Fetching
    const { data: vehiclesData, error: vError } = useSWR(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`, fetcher, { revalidateOnFocus: false });
    const { data: categoriesData, error: cError } = useSWR(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`, fetcher, { revalidateOnFocus: false });

    useEffect(() => {
        if (vehiclesData && categoriesData) {
            setVehicles(vehiclesData);
            setCategories(categoriesData);
            setLoading(false);
        } else if (vError || cError) {
            console.error('Error fetching data with SWR');
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [vehiclesData, categoriesData, vError, cError]);

    // Debounce search input
    const handleInputChange = useCallback((value) => {
        setInputValue(value);
        setActiveSuggestion(-1);

        // Build suggestions immediately for UX
        if (value.trim().length >= 1) {
            const q = value.toLowerCase();
            const pool = type !== 'all' ? vehicles.filter(v => v.type === type) : vehicles;
            const seen = new Set();
            const sugs = [];
            pool.forEach(v => {
                if (v.name.toLowerCase().includes(q) && !seen.has(v.name)) {
                    seen.add(v.name);
                    sugs.push({ label: v.name, sub: v.brand, type: 'name' });
                }
                if (v.brand.toLowerCase().includes(q) && !seen.has(v.brand)) {
                    seen.add(v.brand);
                    sugs.push({ label: v.brand, sub: 'Marque', type: 'brand' });
                }
            });
            setSuggestions(sugs.slice(0, 6));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        // Debounce the actual filter
        clearTimeout(debounceRef.current);
        setIsSearching(true);
        debounceRef.current = setTimeout(() => {
            setSearchQuery(value);
            setIsSearching(false);
        }, 300);
    }, [vehicles, type]);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Keyboard navigation in suggestions
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter') {
            if (activeSuggestion >= 0) {
                selectSuggestion(suggestions[activeSuggestion].label);
            } else {
                setShowSuggestions(false);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (label) => {
        setInputValue(label);
        setSearchQuery(label);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
    };

    const clearSearch = () => {
        setInputValue('');
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
    };

    const gridRef = useRef(null);

    // Main filter + sort logic
    useEffect(() => {
        let result = [...vehicles];

        if (type !== 'all') {
            result = result.filter(v => v.type === type);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.name?.toLowerCase().includes(q) ||
                v.brand?.toLowerCase().includes(q) ||
                (Array.isArray(v.category) ? v.category.some(c => c.toLowerCase().includes(q)) : v.category?.toLowerCase().includes(q)) ||
                v.description?.toLowerCase().includes(q) ||
                v.type?.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(v =>
                (Array.isArray(v.category) ? v.category.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase())) : v.category && v.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                (v.type && v.type.toLowerCase().includes(selectedCategory.toLowerCase()))
            );
        }

        if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'mixed') {
            // Interleave brands so they are mixed instead of grouped
            const brandMap = new Map();
            result.forEach(v => {
                const b = v.brand || 'Unknown';
                if (!brandMap.has(b)) brandMap.set(b, []);
                brandMap.get(b).push(v);
            });

            // Randomize the order within each brand first for variety
            brandMap.forEach(arr => {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
            });

            // Randomize brand keys themselves for true mix
            const brandKeys = Array.from(brandMap.keys());
            for (let i = brandKeys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [brandKeys[i], brandKeys[j]] = [brandKeys[j], brandKeys[i]];
            }

            const mixed = [];
            let itemsRemaining = true;
            let index = 0;

            while (itemsRemaining) {
                itemsRemaining = false;
                for (const b of brandKeys) {
                    const arr = brandMap.get(b);
                    if (arr && index < arr.length) {
                        mixed.push(arr[index]);
                        itemsRemaining = true;
                    }
                }
                index++;
            }
            result = mixed;
        }

        setFilteredVehicles(result);
        setCurrentPage(1); // Reset page on filter changes
    }, [vehicles, type, searchQuery, sortBy, selectedCategory]);

    const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'All';

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (gridRef.current) {
            const yOffset = -80; // offset for sticky navs
            const y = gridRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
            if (window.lenis) {
                window.lenis.scrollTo(y, { duration: 0.3 });
            } else {
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-6 md:pt-12 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white block">
            <div className="container mx-auto max-w-[1600px]">
                {/* ─── Top Navigation ─── */}
                <div className="mb-10 md:mb-16">
                    <Link to="/" className="inline-flex items-center group">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-1.5 transition-transform duration-300" />
                        </div>
                    </Link>
                </div>
                <main className="w-full">

                    {/* ─── Search Bar ─── */}
                    <div className="mb-6 md:mb-10 flex justify-center">
                        <div ref={searchRef} className="relative w-full max-w-2xl lg:max-w-4xl">
                            {/* Glow */}
                            <div className={`absolute inset-0 rounded-lg blur transition-opacity duration-200 ${inputValue ? 'bg-[#ef4444] opacity-25' : 'bg-[#ef4444] opacity-10'}`} />

                            {/* Input */}
                            <div className="relative flex items-center">
                                <div className="absolute left-4 md:left-5 text-[#ef4444] shrink-0 z-10">
                                    {isSearching
                                        ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}>
                                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                                        </motion.div>
                                        : <Search className="w-4 h-4 md:w-5 md:h-5" />
                                    }
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, brand, category..."
                                    value={inputValue}
                                    onChange={e => handleInputChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    className="relative w-full bg-[#0a0a0a] border border-white/10 text-white pl-11 md:pl-14 pr-12 py-3.5 md:py-4 rounded-lg focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/50 transition-all duration-200 font-display italic tracking-wider text-sm md:text-base placeholder:text-gray-600 uppercase"
                                />
                                {/* Clear button */}
                                <AnimatePresence>
                                    {inputValue && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.7 }}
                                            onClick={clearSearch}
                                            className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden z-50 shadow-2xl shadow-black/60"
                                    >
                                        <div className="px-3 py-1.5 border-b border-white/5 flex items-center gap-1.5">
                                            <span className="text-[#ef4444] text-[8px] font-bold uppercase tracking-[0.3em]">// Suggestions</span>
                                        </div>
                                        {suggestions.map((sug, i) => (
                                            <button
                                                key={i}
                                                onMouseDown={() => selectSuggestion(sug.label)}
                                                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${activeSuggestion === i ? 'bg-[#ef4444]/10 border-l-2 border-[#ef4444]' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                                            >
                                                <Search className="w-3 h-3 text-gray-600 shrink-0" />
                                                <div className="min-w-0">
                                                    <div className="text-white text-xs font-bold uppercase font-display italic leading-none">
                                                        <Highlight text={sug.label} query={inputValue} />
                                                    </div>
                                                    <div className="text-gray-600 text-[9px] uppercase tracking-widest mt-0.5">{sug.sub}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ─── Search Context Bar (shows only when searching) ─── */}
                    <AnimatePresence>
                        {searchQuery.trim() && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 overflow-hidden"
                            >
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest flex-wrap">
                                    <span className="text-[#ef4444] font-bold">// Searching for:</span>
                                    <span className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] px-2.5 py-0.5 rounded font-bold font-display italic">{searchQuery}</span>
                                    <span className="text-gray-600">—</span>
                                    <motion.span
                                        key={filteredVehicles.length}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-gray-400 font-bold"
                                    >
                                        {filteredVehicles.length} result{filteredVehicles.length !== 1 ? 's' : ''} found
                                    </motion.span>
                                    <button onClick={clearSearch} className="ml-auto text-gray-600 hover:text-white transition-colors flex items-center gap-1">
                                        <X className="w-3 h-3" /> Clear
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ─── Category Tabs ─── */}
                    <div className="mb-5 md:mb-8">
                        <div className="flex overflow-x-auto gap-2 md:gap-3 mb-4 md:mb-6 pb-4 scrollbar-hide snap-x" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${selectedCategory === 'All' ? 'bg-[#ef4444] border-[#ef4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-transparent border-white/20 text-gray-400 hover:border-[#ef4444] hover:text-white'} transition-all duration-200 text-[10px] md:text-xs font-bold uppercase tracking-widest active:scale-95`}
                            >
                                All
                            </button>
                            {categories.filter(c => c.type === type).map((cat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full border ${selectedCategory === cat.name ? 'bg-[#ef4444] border-[#ef4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-transparent border-white/20 text-gray-400 hover:border-[#ef4444] hover:text-white'} transition-all duration-200 text-[10px] md:text-xs font-bold uppercase tracking-widest active:scale-95 whitespace-nowrap`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Category Intel Panel */}
                        {selectedCategory !== 'All' && (() => {
                            const activeCat = categories.find(c => c.name === selectedCategory);
                            if (!activeCat) return null;
                            const [shortDesc] = activeCat.description.includes('. ')
                                ? activeCat.description.split('. ', 2)
                                : [activeCat.description];

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={selectedCategory}
                                    className="bg-[#0b0b0b]/80 border border-white/10 p-2 sm:p-4 backdrop-blur-md relative overflow-hidden rounded-lg mb-4 sm:mb-6"
                                >
                                    <div className="relative z-10">
                                        {/* Tighter Header */}
                                        <div className="flex items-center gap-x-3 mb-2.5 border-b border-white/10 pb-2">
                                            <span className="text-[#ef4444] font-black tracking-[0.2em] uppercase text-[8px] md:text-xs shrink-0">// Intel</span>
                                            <h2 className="text-sm sm:text-3xl font-display font-black italic text-white uppercase tracking-tight leading-none">
                                                {activeCat.name}
                                            </h2>
                                        </div>
                                        
                                        {/* Ultra-Condensed Stats Row - Enlarged Text */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-3">
                                            {[
                                                { icon: <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-[#ef4444]" />, label: 'Speed', val: activeCat.topSpeed },
                                                { icon: <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#ef4444]" />, label: 'Engine', val: activeCat.engineRange },
                                                { icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#ef4444]" />, label: 'Seats', val: activeCat.seating },
                                                { icon: <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-[#ef4444]" />, label: 'Type', val: activeCat.bestFor },
                                            ].map(({ icon, label, val }) => (
                                                <div key={label} className="bg-white/[0.04] p-1.5 md:p-2.5 border border-white/[0.08] rounded flex items-center gap-2 hover:border-[#ef4444]/30 transition-all">
                                                    <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded bg-white/5 flex items-center justify-center border border-white/5">{icon}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-black leading-none mb-1">{label}</div>
                                                        <div className="text-white font-display font-medium italic text-[11px] sm:text-lg leading-none truncate whitespace-nowrap">{val || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {(activeCat.pros || activeCat.cons) && (
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                                                {activeCat.pros && (
                                                    <div>
                                                        <div className="text-[8px] text-green-400 uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-1.5">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> Pros
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {activeCat.pros.slice(0, 3).map((pro, i) => (
                                                                <li key={i} className="text-gray-400 text-[10px] sm:text-xs font-medium flex items-center gap-1.5 leading-none">
                                                                    <span className="w-1 h-1 rounded-full bg-green-500/50 shrink-0" />{pro}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {activeCat.cons && (
                                                    <div>
                                                        <div className="text-[8px] text-red-400 uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-1.5">
                                                            <AlertCircle className="w-2.5 h-2.5" /> Cons
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {activeCat.cons.slice(0, 3).map((con, i) => (
                                                                <li key={i} className="text-gray-400 text-[10px] sm:text-xs font-medium flex items-center gap-1.5 leading-none">
                                                                    <span className="w-1 h-1 rounded-full bg-red-500/50 shrink-0" />{con}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </div>

                    {/* ─── Results Header ─── */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 border-b border-white/5 pb-3 md:pb-4">
                        <div>
                            <span className="text-[#ef4444] uppercase tracking-[0.3em] text-[10px] font-bold mb-1.5 block">
                                {type === 'all' ? 'Inventory' : type === 'car' ? `Automobiles // ${selectedCategory}` : 'Motorcycles'}
                            </span>
                            <div className="flex items-baseline gap-3">
                                <h1 className="text-3xl md:text-5xl font-display font-black italic text-white uppercase tracking-tighter">
                                    {type === 'all' ? 'The Collection' : type === 'car' ? 'Cars' : 'Bikes'}
                                </h1>
                                {/* Animated count badge */}
                                <motion.span
                                    key={filteredVehicles.length}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 relative top-1 sm:top-2"
                                >
                                    {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Asset' : 'Assets'}
                                </motion.span>
                            </div>
                            {type === 'car' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="mt-2.5 md:mt-3 flex flex-col gap-1.5 md:gap-2.5"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="h-[1px] w-6 md:w-8 bg-[#ef4444] shrink-0"></div>
                                        <p className="text-gray-400 text-[8px] md:text-[9.5px] uppercase font-bold tracking-[0.25em] italic leading-relaxed">
                                            Only major and premium car models (TOP) are featured,
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="h-[1px] w-6 md:w-8 bg-[#ef4444] shrink-0 mt-1.5"></div>
                                        <p className="text-gray-500 text-[8px] md:text-[9.5px] uppercase font-bold tracking-[0.25em] italic leading-relaxed">
                                            Mileage is not mentioned in the details because people who buy premium cars usually do not focus on mileage.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            {/* Active filters pill */}
                            {hasActiveFilters && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => { clearSearch(); setSelectedCategory('All'); }}
                                    className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#ef4444] border border-white/10 hover:border-[#ef4444]/40 px-2.5 py-1.5 rounded transition-all"
                                >
                                    <X className="w-2.5 h-2.5" /> Reset filters
                                </motion.button>
                            )}
                            <div className="h-4 w-[1px] bg-white/10" />
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-xs text-white focus:outline-none uppercase tracking-widest cursor-pointer hover:text-[#ef4444] transition-colors font-bold"
                            >
                                <option value="mixed" className="bg-black">Mix Brands</option>
                                <option value="priceLow" className="bg-black">Price: Low → High</option>
                                <option value="priceHigh" className="bg-black">Price: High → Low</option>
                            </select>
                        </div>
                    </div>



                    {/* ─── Results Grid ─── */}
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8">
                            {[...Array(10)].map((_, i) => (
                                <VehicleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredVehicles.length > 0 ? (
                        <>
                            <div
                                ref={gridRef}
                                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 lg:gap-8 focus:outline-none"
                                tabIndex={-1}
                            >
                                {currentVehicles.map((vehicle, i) => (
                                    <motion.div
                                        key={vehicle._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.25, ease: "easeOut", delay: (i % itemsPerPage) * 0.04 }}
                                        layout
                                    >
                                        <VehicleCard vehicle={vehicle} searchQuery={searchQuery} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 md:gap-16 mt-16 md:mt-24 border-t border-white/5 pt-10 pb-16"
                                >
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`group relative flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                                            currentPage === 1 
                                            ? 'border-white/5 opacity-20 cursor-not-allowed text-gray-600' 
                                            : 'border-white/10 text-gray-400 hover:border-[#ef4444]/50 hover:text-white hover:bg-[#ef4444]/5 shadow-xl hover:shadow-[#ef4444]/10'
                                        }`}
                                    >
                                        <ArrowLeft className={`w-4 h-4 transition-transform duration-200 ${currentPage !== 1 && 'group-hover:-translate-x-1'}`} /> 
                                        <span>Previous</span>
                                        {currentPage !== 1 && (
                                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                        )}
                                    </button>
                                    
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-gray-600 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.4em] mb-1">Navigation Matrix</span>
                                        <div className="relative group/indicator">
                                            <div className="absolute -inset-4 bg-[#ef4444]/5 blur-xl group-hover/indicator:bg-[#ef4444]/10 transition-colors duration-200" />
                                            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-6 sm:px-10 py-3 sm:py-4 flex items-baseline gap-3 shadow-2xl">
                                                <span className="text-[#ef4444] font-display italic font-black text-2xl sm:text-4xl drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] leading-none">{currentPage}</span>
                                                <span className="text-gray-700 font-black text-xs sm:text-sm uppercase tracking-widest">/</span>
                                                <span className="text-gray-400 font-display italic font-black text-xl sm:text-2xl leading-none">{totalPages}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`group relative flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                                            currentPage === totalPages 
                                            ? 'border-white/5 opacity-20 cursor-not-allowed text-gray-600' 
                                            : 'border-white/10 text-gray-400 hover:border-[#ef4444]/50 hover:text-white hover:bg-[#ef4444]/5 shadow-xl hover:shadow-[#ef4444]/10'
                                        }`}
                                    >
                                        <span>Next</span>
                                        <ArrowLeft className={`w-4 h-4 rotate-180 transition-transform duration-200 ${currentPage !== totalPages && 'group-hover:translate-x-1'}`} />
                                        {currentPage !== totalPages && (
                                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 md:py-32 border border-white/5 bg-[#0a0a0a] rounded-lg relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="relative z-10 px-4">
                                <p className="text-[#ef4444] uppercase tracking-[0.2em] text-sm font-bold mb-3">// No Results</p>
                                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-6">
                                    No assets found{searchQuery ? ` for "${searchQuery}"` : ' for this classification'}.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={() => { clearSearch(); setSelectedCategory('All'); }}
                                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded transition-all"
                                    >
                                        <X className="w-3 h-3" /> Clear all filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Vehicles;
