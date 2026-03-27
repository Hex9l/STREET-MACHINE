import { motion } from 'framer-motion';

const Skeleton = ({ className = "", variant = "rect" }) => {
    const variants = {
        rect: "rounded-md",
        circle: "rounded-full",
        card: "rounded-xl",
    };

    return (
        <div className={`relative overflow-hidden bg-zinc-900/50 ${variants[variant]} ${className}`}>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
            />
        </div>
    );
};

export default Skeleton;
