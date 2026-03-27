import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { Settings, X, LogOut, ShieldCheck } from 'lucide-react';

const Navigation = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const constraintsRef = useRef(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also pause Lenis if possible, but overflow hidden works well enough  
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'CARS', path: '/cars' },
        { name: 'BIKES', path: '/bikes' },
        { name: 'COMPARE', path: '/compare' },
        { name: 'GUIDE', path: '/knowledge' },
    ];

    return (
        <>
            {/* Draggable Area Constraints - We cover the screen but pointer-events-none so it doesn't block clicks */}
            <div className="fixed inset-0 pointer-events-none z-[100]" ref={constraintsRef} />

            {/* Draggable "Tyre" Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-[100] pointer-events-auto shadow-[0_0_30px_rgba(239,68,68,0.4)] rounded-full"
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                dragMomentum={false}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring', damping: 15 }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-14 h-14 bg-black border-[3px] border-[#ef4444] rounded-full flex items-center justify-center overflow-hidden group focus:outline-none"
                    aria-label="Toggle Navigation"
                >
                    {/* Inner Rim/Tyre Styling */}
                    <div className="absolute inset-1 rounded-full border border-white/20 border-dashed animate-[spin_10s_linear_infinite] group-hover:border-[#ef4444]/50 transition-colors" />
                    <div className="absolute inset-2 rounded-full border border-[#111] bg-[#1a1a1a] shadow-inner" />

                    {/* Center Cap */}
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                className="z-10 text-[#ef4444]"
                            >
                                <X size={26} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                                className="z-10 text-white group-hover:text-[#ef4444] transition-colors flex flex-col items-center justify-center gap-1.5"
                            >
                                <div className="w-5 h-0.5 bg-current rounded-full" />
                                <div className="w-5 h-0.5 bg-current rounded-full" />
                                <div className="w-5 h-0.5 bg-current rounded-full" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>

            {/* Backdrop Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 bg-black/60 z-[90] cursor-pointer"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Slide-out Rounded Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed top-4 bottom-4 right-4 w-[280px] sm:w-[320px] max-w-[calc(100%-2rem)] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl z-[95] flex flex-col overflow-hidden"
                        initial={{ x: '120%', opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: '120%', opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
                    >
                        {/* Panel Header */}
                        <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-5 sm:pb-6 border-b border-white/5">
                            <Link to="/" onClick={() => setIsOpen(false)} className="text-xl sm:text-2xl font-display font-black tracking-tighter italic uppercase flex items-center">
                                <span className="text-white">Street</span>
                                <span className="text-[#ef4444] ml-1">Machine</span>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-grow overflow-y-auto px-5 sm:px-8 py-5 sm:py-6 flex flex-col gap-4 sm:gap-6 no-scrollbar">
                            {navLinks.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05, ease: 'easeOut' }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg sm:text-xl font-display font-bold tracking-[0.1em] uppercase text-gray-400 hover:text-white hover:translate-x-2 transition-all block group"
                                    >
                                        {item.name}
                                        <div className="h-[2px] w-0 bg-[#ef4444] group-hover:w-12 transition-all mt-1 rounded-full" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-3 sm:p-6 pb-14 sm:pb-[72px] bg-black/50 border-t border-white/5 relative overflow-hidden flex-shrink-0">
                            {/* Decorative Red Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/15 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                            {user ? (
                                <div className="relative z-10 w-full bg-white/5 border border-yellow-500/50 p-2 sm:p-4 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)] flex flex-col gap-2 sm:gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ef4444] to-[#7f1d1d] flex items-center justify-center font-bold text-white text-[10px] sm:text-sm uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                                {user.username.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`text-[6px] sm:text-[9px] uppercase tracking-widest font-black leading-none mb-0.5 shadow-sm ${user.role === 'admin' ? 'text-[#ef4444]' : 'text-gray-400'}`}>
                                                    {user.role === 'admin' ? 'COMMANDER' : 'AUTHORIZED DRIVER'}
                                                </div>
                                                <div className="text-white text-[10px] sm:text-sm font-bold uppercase leading-none font-display tracking-widest">
                                                    {user.username}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Minimal Logout Button */}
                                        <button
                                            onClick={() => { logout(); setIsOpen(false); }}
                                            className="p-1.5 sm:p-2.5 bg-white/5 hover:bg-[#ef4444]/20 border border-white/10 hover:border-[#ef4444]/50 rounded-lg sm:rounded-xl text-gray-400 hover:text-[#ef4444] transition-all group"
                                            title="Initiate Logout"
                                        >
                                            <LogOut className="w-3 h-3 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>

                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-0.5 sm:my-0" />

                                    <div className="flex gap-2 sm:gap-3">
                                        {user.role === 'admin' ? (
                                            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-3 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/20 hover:border-[#ef4444]/50 text-[#ef4444] rounded-lg sm:rounded-xl text-[8px] sm:text-xs font-bold uppercase tracking-widest transition-all">
                                                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" /> Command
                                            </Link>
                                        ) : (
                                            <div className="flex-1 text-center py-1.5 sm:py-3 bg-white/5 border border-white/5 rounded-lg sm:rounded-xl text-gray-500 text-[8px] sm:text-xs font-bold uppercase tracking-widest cursor-default">
                                                Standard Access
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative z-10 w-full bg-white/5 border border-yellow-500/50 p-2.5 sm:p-5 rounded-xl backdrop-blur-md text-center shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full bg-gradient-to-br from-yellow-900/40 to-black border border-yellow-500/30 flex items-center justify-center mb-1.5 sm:mb-3 shadow-inner">
                                        <Settings className="text-yellow-500/80 w-4 h-4 sm:w-5 sm:h-5 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <p className="text-[8px] sm:text-[10px] text-yellow-500/80 uppercase tracking-widest font-bold mb-2 sm:mb-3">Access Control</p>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full">
                                        <Button variant="primary" className="w-full py-1.5 sm:py-3 text-[9px] sm:text-xs rounded-lg tracking-[0.1em] sm:tracking-[0.15em] bg-yellow-500 hover:bg-yellow-400 text-black border-none shadow-[0_0_10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all font-black">
                                            Ignition (Login)
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
