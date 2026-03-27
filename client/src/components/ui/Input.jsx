import { cn } from '../../utils/cn';

const Input = ({ label, className, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">{label}</label>}
            <input
                className={cn(
                    "bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 backdrop-blur-sm",
                    className
                )}
                {...props}
            />
        </div>
    );
};

export default Input;
