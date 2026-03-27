import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({ children, className, variant = 'primary', ...props }) => {
    const baseStyles = "px-8 py-3 font-display font-bold tracking-wider uppercase transition-all duration-200 relative overflow-hidden group [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]";

    const variants = {
        primary: "bg-[#ef4444] text-white hover:bg-white hover:text-[#ef4444] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-transparent before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:animate-none",
        secondary: "bg-transparent text-white border border-white/30 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]",
        danger: "bg-transparent text-gray-400 border border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.92 }}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:transition-all group-hover:duration-200 group-hover:translate-x-[150%] z-0"></span>
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </motion.button>
    );
};

export default Button;
