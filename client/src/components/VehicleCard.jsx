import { API_URL } from '../api.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { preload } from 'swr';
import ImageLoader from './ui/ImageLoader';

const fetcher = url => fetch(url).then(res => res.json());

export const optimizeImageUrl = (url, width = 800) => {
  if (!url) return 'https://via.placeholder.com/600x400/111111/444444?text=Machine';
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // If it already contains optimization flags, skip
    if (url.match(/\/upload\/(q_|f_|w_|c_)/)) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

const VehicleCard = ({ vehicle }) => {
  return (
    <motion.div
      onMouseEnter={() => preload(`${API_URL}/api/vehicles/${vehicle._id}`, fetcher)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#ef4444]/20 cursor-pointer rounded-xl transition-all duration-200"
    >
      <Link to={`/vehicles/${vehicle._id}`} className="block h-full w-full">
        {/* Image Section - Smaller Vertically for "Wall" effect */}
        <div className="aspect-video sm:aspect-[4/3] overflow-hidden relative bg-[#050505]">
          <ImageLoader
            src={optimizeImageUrl(vehicle.images?.[0])}
            alt={vehicle.name}
            className="w-full h-full object-cover opacity-80"
            imagePreset="group-hover:scale-105 group-hover:opacity-100"
          />
          
          {/* Tag - More polished/Compact */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10 uppercase text-[7px] sm:text-[9px] tracking-widest font-black text-white z-10 rounded-sm">
            {vehicle.brand || 'Class'}
          </div>
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-t-xl" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
        </div>

        {/* Info Section - Tighter, High-Density App Feel */}
        <div className="p-2 sm:p-5 relative z-10 bg-[#0a0a0a]">
          {/* Corner accent - Smaller for mobile */}
          <div className="absolute top-0 right-0 w-4 h-4 sm:w-8 sm:h-8 border-t border-r border-[#ef4444]/40 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>

          <div className="mb-0.5 sm:mb-1.5">
            <h3 className="text-[10px] sm:text-lg md:text-xl lg:text-2xl font-display font-black uppercase italic text-white group-hover:text-[#ef4444] transition-colors leading-[1.1] tracking-tighter">
              {vehicle.name}
            </h3>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-1.5 sm:pt-4">
            <div className="flex flex-col">
               <span className="text-[#ef4444] font-display font-black text-xs sm:text-lg tracking-tighter">
                ₹{parseInt(vehicle.price).toLocaleString('en-IN')}
              </span>
              <span className="text-[7px] text-gray-600 font-bold uppercase tracking-tighter sm:hidden">MRP (Estimated)</span>
            </div>
            
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#ef4444] group-hover:border-[#ef4444] transition-all duration-200">
               <span className="text-white text-[10px] sm:text-sm">→</span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Line Accent */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ef4444] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left z-20"></div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
