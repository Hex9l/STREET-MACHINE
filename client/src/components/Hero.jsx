
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { ChevronLeft, ChevronRight, Settings, LogOut, ShieldCheck } from 'lucide-react';
import LogoMarquee from './LogoMarquee';
import { useAuth } from '../context/AuthContext';

import karlBenzImage from '../assets/father_of_automobile.png';
import gottliebDaimlerImage from '../assets/father_of_motorcycle.png';

import jeskoImage from '../assets/Jesko.jpg';

import yangwangImage from '../assets/yangwang_u9.jpg';
import bugattiImage from '../assets/bugatti_chiron_ss.jpg';

const heroData = [
  {
    id: 'benz',
    prefix: 'Father of the Automobile',
    name: { first: 'Karl', last: 'Benz' },
    description: "The visionary German engineer who invented the world's first practical gasoline-powered car, the <strong>Benz Patent-Motorwagen</strong>, in 1885.",
    stats: [
      { value: '1844', label: 'Born' },
      { value: '1886', label: 'Patented' },
      { value: 'Germany', label: 'Origin' }
    ],
    tags: ['Patent-Motorwagen', 'Mercedes-Benz'],
    cta: { text: 'Explore Machine', link: '/cars' },
    image: karlBenzImage,
    bgPosition: 'object-center',
    didYouKnow: "In 1888, his wife <strong>Bertha Benz</strong> made the first long-distance car journey (106 km).",
    est: 'EST. 1886'
  },
  {
    id: 'daimler',
    prefix: 'Father of the Motorcycle',
    name: { first: 'Gottlieb', last: 'Daimler' },
    description: "A German engineer and inventor who played a major role in the development of the internal combustion engine and built the world's first gasoline-powered motorcycle.",
    stats: [
      { value: '1834', label: 'Born' },
      { value: '1885', label: 'Invention' },
      { value: 'Germany', label: 'Origin' }
    ],
    tags: ['Daimler Reitwagen', 'Internal Combustion'],
    cta: { text: 'Explore Machine', link: '/bikes' },
    image: gottliebDaimlerImage,
    bgPosition: 'object-left-top',
    didYouKnow: "The <strong>Daimler Reitwagen</strong> was made mostly of wood, like a bicycle, and powered by a small petrol engine.",
    est: 'EST. 1885'
  },
  {
    id: 'jesko',
    prefix: 'Fastest Claimed Car',
    name: { first: 'Koenigsegg', last: 'Jesko Absolut' },
    description: "The Swedish hypercar designed purely for top speed. With a low-drag body and a 5.0L twin-turbo V8, it is theoretically capable of exceeding <strong>330 mph</strong>.",
    stats: [
      { value: '531 km/h', label: 'Top Speed' },
      { value: '1600 hp', label: 'Power' },
      { value: '2.5s', label: '0-100 km/h' }
    ],
    tags: ['Hypercar', 'Top Speed', 'Aerodynamics'],
    cta: { text: 'View Specs', link: '/cars' },
    image: jeskoImage,
    bgPosition: 'object-center',
    didYouKnow: "The <strong>531 km/h</strong> top speed is currently theoretical. No official real-world speed record has been completed yet.",
    est: 'EST. 2020'
  },
  {
    id: 'yangwang',
    prefix: 'Fastest Verified EV',
    name: { first: 'Yangwang', last: 'U9' },
    description: "China's electric hypercar by BYD. Featuring quad-motor AWD and the DiSus body control system, it is the fastest officially verified production car for 2025-2026.",
    stats: [
      { value: '496 km/h', label: 'Top Speed' },
      { value: '1300+ hp', label: 'Power' },
      { value: 'Electric', label: 'Type' }
    ],
    tags: ['Electric Hypercar', 'Quad-Motor', 'DiSus System'],
    cta: { text: 'View Specs', link: '/cars' },
    image: yangwangImage,
    bgPosition: 'object-center',
    didYouKnow: "The <strong>Yangwang U9</strong> can drive on three wheels and even jump thanks to its advanced DiSus suspension system.",
    est: 'EST. 2024'
  },
  {
    id: 'chiron-ss',
    prefix: 'World Record Holder',
    name: { first: 'Bugatti', last: 'Chiron Super Sport 300+' },
    description: "The first production car to break the 300 mph (482 km/h) barrier. A masterpiece of engineering with a quad-turbo W16 engine and long-tail aerodynamics.",
    stats: [
      { value: '490 km/h', label: 'Top Speed' },
      { value: '1578 hp', label: 'Power' },
      { value: 'Quad-Turbo', label: 'Engine' }
    ],
    tags: ['300+ MPH', 'W16 Engine', 'Long Tail'],
    cta: { text: 'View Specs', link: '/cars' },
    image: bugattiImage,
    bgPosition: 'object-center',
    didYouKnow: "The <strong>Chiron Super Sport 300+</strong> was the first hypercar to officially break the magic 300 mph barrier, hitting <strong>304.773 mph</strong>.",
    est: 'EST. 2019'
  }
];

const Hero = () => {
  const { user, logout } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const interactionRef = useRef(false);

  const navLinks = [
    { name: 'CARS', path: '/cars' },
    { name: 'BIKES', path: '/bikes' },
    { name: 'COMPARE', path: '/compare' },
    { name: 'GUIDE', path: '/knowledge' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroData.length) % heroData.length);
  };

  // Auto-slide functionality with smart interaction pause
  useEffect(() => {
    return () => {
      if (window.heroTimer) clearTimeout(window.heroTimer);
    };
  }, []);

  const resetTimer = (delay = 8000) => {
    if (window.heroTimer) clearTimeout(window.heroTimer);
    window.heroTimer = setTimeout(() => {
      // Upon auto-slide, reset interaction state so it goes back to 8s
      interactionRef.current = false;
      nextSlide();
    }, delay);
  };

  useEffect(() => {
    const delay = interactionRef.current ? 30000 : 8000;
    resetTimer(delay);

    return () => {
      if (window.heroTimer) clearTimeout(window.heroTimer);
    };
  }, [currentSlide]);

  const handleInteraction = () => {
    interactionRef.current = true;
    resetTimer(30000); // 30 seconds pause on interaction
  };

  // Reset expanded state on slide change
  useEffect(() => {
    setIsExpanded(false);
  }, [currentSlide]);

  const toggleExpand = (e) => {
    e.stopPropagation();
    handleInteraction();
    setIsExpanded(!isExpanded);
  };

  const content = heroData[currentSlide];

  return (
    <div
      className="relative min-h-[100dvh] h-auto w-full overflow-x-hidden flex flex-col justify-between bg-[#050505] transition-colors duration-200"
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >

      {/* Mobile Logo Navigation (Only visible on small screens) */}
      <nav className="flex md:hidden absolute top-0 w-full z-50 bg-transparent py-6 px-6 items-center justify-between">
        <Link to="/" className="text-xl font-display font-black tracking-tighter italic uppercase flex items-center group">
          <span className="text-white relative">
            Street
          </span>
          <span className="text-[#ef4444] ml-1 relative">
            Machine
          </span>
        </Link>
      </nav>

      {/* Embedded Desktop Navigation (Only inside Hero) */}
      <nav className="hidden md:flex absolute top-0 w-full z-50 bg-transparent py-8 px-10 items-center justify-between">
        <Link to="/" className="text-xl lg:text-2xl font-display font-black tracking-tighter italic uppercase flex items-center group">
          <span className="text-white relative">
            Street
            <span className="absolute -inset-2 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </span>
          <span className="text-[#ef4444] ml-1 relative">
            Machine
            <span className="absolute -inset-2 bg-[#ef4444]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-10 lg:gap-14">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-[11px] font-display font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-white transition-colors relative group py-2"
            >
              {item.name}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#ef4444] group-hover:w-full transition-all duration-200 ease-out" />
            </Link>
          ))}
        </div>

        {/* Right Section - Removed as per minimalist design requests, auth is available in the global floating menu */}
        <div className="flex items-center gap-4 lg:gap-6">
        </div>
      </nav>

      {/* Background Image / Gradient */}
      <AnimatePresence>
        <motion.div
          key={content.id + '-bg-overlay'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <motion.img
            src={content.image}
            alt={`Background - ${content.name.first} ${content.name.last}`}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 0.5 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 15, ease: 'linear' }}
            className={`w-full h-full object-cover ${content.bgPosition} absolute inset-0`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vertical Text */}
      <div className="absolute top-32 left-8 md:left-12 z-20 hidden 2xl:block">
        <div className="writing-vertical text-xs font-bold tracking-[0.5em] text-gray-500 uppercase flex gap-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>
          <span className="text-[#ef4444] mb-4">///</span> {content.est}
        </div>
      </div>

      {/* Content Wrapper to center vertically */}
      <div className="flex-grow flex items-center w-full z-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-center pt-24 pb-12 md:pt-28 md:pb-16 h-auto">
          <AnimatePresence mode='wait'>
            <motion.div
              key={content.id + '-text'}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25, staggerChildren: 0.05, delayChildren: 0.1, ease: 'easeOut' }}
            >
              <div className="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                <div className="h-[2px] w-6 md:w-16 bg-[#ef4444]"></div>
                <span className="text-[#ef4444] font-bold tracking-[0.2em] uppercase text-[8px] md:text-xs lg:text-sm leading-tight">{content.prefix}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-3 md:mb-6 font-display italic text-white transition-all duration-200">
                <span className="block">{content.name.first}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{content.name.last}</span>
              </h1>

              <p
                className="text-gray-400 text-[11px] sm:text-xs md:text-base lg:text-lg mb-4 md:mb-8 max-w-lg font-medium leading-relaxed border-l-2 border-white/10 pl-3 md:pl-6"
                dangerouslySetInnerHTML={{ __html: content.description }}
              ></p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-10">
                {content.stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 p-2 md:p-3 backdrop-blur-sm text-center md:text-left flex flex-col justify-center min-w-0">
                    <div className="text-[#ef4444] font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-display leading-none mb-1 truncate">{stat.value}</div>
                    <div className="text-gray-500 text-[8px] sm:text-[9px] md:text-[8px] lg:text-[9px] uppercase tracking-widest font-bold leading-none">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-4">
                {content.tags.map((tag, index) => (
                  <div key={index} className={`px-3 py-1 md:px-6 md:py-3 ${index === 0 ? 'bg-[#ef4444]' : 'border border-white/20'} text-white font-bold uppercase tracking-widest text-[8px] md:text-xs`}>
                    {tag}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {content.cta && (
                <div className="mt-8 md:mt-10">
                  <Link to={content.cta.link}>
                    <Button variant="primary" className="px-8 py-3 text-xs md:text-sm">
                      {content.cta.text}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Slide Controls */}
              <div className="flex items-center gap-3 mt-6 md:mt-12">
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); handleInteraction(); }}
                  className="p-2 border border-white/10 hover:bg-[#ef4444] hover:border-[#ef4444] transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white" />
                </button>
                <div className="flex gap-1.5 md:gap-2 overflow-hidden">
                  {heroData.map((_, idx) => (
                    <div key={idx} className={`h-1 transition-all duration-200 flex-shrink-0 ${idx === currentSlide ? 'bg-[#ef4444] w-6 md:w-12' : 'bg-white/10 w-4 md:w-8'}`}></div>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); handleInteraction(); }}
                  className="p-2 border border-white/10 hover:bg-[#ef4444] hover:border-[#ef4444] transition-colors group"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Image Section */}
          <AnimatePresence mode='wait'>

            <motion.div
              layout
              key={content.id + '-img'}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="relative h-[220px] sm:h-[280px] md:h-[500px] lg:h-[700px] w-full mt-2 md:mt-0 flex items-end justify-center md:justify-end cursor-pointer group"
              onClick={toggleExpand}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none"></div>

              <motion.img
                src={content.image}
                alt={`${content.name.first} ${content.name.last}`}
                animate={{
                  scale: isExpanded ? 1.1 : 1,
                  zIndex: isExpanded ? 30 : 20,
                  filter: isExpanded ? 'grayscale(0%)' : 'grayscale(100%)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-auto h-full max-w-full object-contain object-bottom grayscale group-hover:grayscale-0 transition-all duration-200 ease-out masking-image-b relative"
              />

              {/* Context Floating Card */}
              <motion.div
                animate={{
                  scale: isExpanded ? 0.9 : 1,
                  opacity: isExpanded ? 0 : 1,
                  y: isExpanded ? 50 : 0,
                  zIndex: isExpanded ? 10 : 25
                }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 lg:right-0 bg-[#050505]/90 backdrop-blur-md border border-white/10 p-2.5 md:p-4 w-[160px] sm:w-[200px] md:w-[220px] lg:w-full lg:max-w-xs shadow-lg"
              >
                <h3 className="text-white font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1.5 md:mb-2 text-center md:text-left">Did You Know?</h3>
                <p
                  className="text-gray-400 text-[10px] md:text-xs leading-relaxed text-center md:text-left"
                  dangerouslySetInnerHTML={{ __html: content.didYouKnow }}
                ></p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Scroll Indicator - adjust position or hide if conflicts */}
      <div className="absolute bottom-60 md:bottom-72 left-12 z-20 hidden 2xl:flex flex-col items-center gap-4 animate-bounce">
        <span className="writing-vertical text-[10px] tracking-widest uppercase text-gray-500" style={{ writingMode: 'vertical-rl' }}>Scroll Down</span>
        <div className="h-16 w-[1px] bg-[#ef4444]"></div>
      </div>

      {/* Logo Marquee at Bottom - Relative flow now */}
      <div className="w-full z-30 flex-shrink-0">
        <LogoMarquee />
      </div>
    </div>
  );
};

export default Hero;
