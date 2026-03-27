import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from './Skeleton';

const ImageLoader = ({ src, alt, className = "", containerPreset = "", imagePreset = "", onLoad, onError, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    
    // Reset state if src changes
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    const handleLoaded = (e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
    };

    const handleError = (e) => {
        setHasError(true);
        setIsLoaded(true); // Treat as loaded to stop skeleton, show fallback
        if (onError) onError(e);
    };

    return (
        <div className={`relative overflow-hidden w-full h-full ${containerPreset}`}>
            <AnimatePresence>
                {!isLoaded && !hasError && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 z-10"
                    >
                        <Skeleton className="w-full h-full" variant="card" />
                    </motion.div>
                )}
            </AnimatePresence>
            
            <img
                src={hasError ? 'https://via.placeholder.com/800x600/111111/444444?text=Unavailable' : src}
                alt={alt || "Asset"}
                onLoad={handleLoaded}
                onError={handleError}
                className={`w-full h-full ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 ease-in-out ${imagePreset}`}
                {...props}
            />
        </div>
    );
};

export default ImageLoader;
