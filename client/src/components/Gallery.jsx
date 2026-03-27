import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ImageLoader from './ui/ImageLoader';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(24);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`);
                setImages(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching images:', err);
                setError('Failed to load gallery data.');
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 24);
    };

    const currentImages = images.slice(0, visibleCount);

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24 relative">
            <div className="absolute top-8 left-4 md:left-8 z-50">
                <Link to="/" className="inline-flex items-center group">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center group-hover:border-[#ef4444] group-hover:bg-[#ef4444] text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-1.5 transition-transform duration-300" />
                    </div>
                </Link>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {loading ? (
                    Array.from({ length: 24 }).map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="relative bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg aspect-[4/3] animate-pulse overflow-hidden">
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-zinc-800/80 to-transparent"></div>
                        </div>
                    ))
                ) : (
                    <AnimatePresence>
                        {currentImages.map((image) => (
                        <motion.div
                            key={image.public_id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative group overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg hover:border-red-600/50 transition-colors duration-200 aspect-[4/3]"
                        >
                            <ImageLoader
                                src={image.url}
                                alt="Gallery Image"
                                loading="lazy"
                                className="w-full h-full object-cover"
                                imagePreset="group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                                <span className="text-xs text-zinc-400 font-mono truncate w-full">
                                    {image.public_id.split('/').pop()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                )}
            </div>
            {!loading && images.length === 0 && (
                <div className="text-center text-zinc-500 mt-20">
                    No images found in the gallery.
                </div>
            )}
            
            {!loading && visibleCount < images.length && (
                <div className="flex justify-center mt-12 mb-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-transparent border border-white/20 text-white text-xs tracking-widest uppercase font-bold hover:bg-white/10 hover:border-white transition-all duration-200 flex items-center gap-3"
                    >
                        Load More Gallery
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gallery;
