import { motion } from 'framer-motion';
import Skeleton from './Skeleton';

const VehicleCardSkeleton = () => {
    return (
        <div className="bg-[#0a0a0a] border border-white/5 overflow-hidden rounded-xl h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="aspect-video sm:aspect-[4/3] bg-[#050505]">
                <Skeleton className="w-full h-full" variant="card" />
            </div>
            
            {/* Content Skeleton */}
            <div className="p-3 sm:p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
                
                <div className="mt-auto pt-3 border-t border-white/5 flex justify-between items-center">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default VehicleCardSkeleton;
