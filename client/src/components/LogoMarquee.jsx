import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import all local logos
import LogoBmwM from '../assets/car-logos/BMW-m.png';
import LogoBugatti from '../assets/car-logos/Bugatti.png';
import LogoFiat from '../assets/car-logos/Fiat.png';
import LogoGmc from '../assets/car-logos/GMC.png';
import LogoGtr from '../assets/car-logos/GT-R.png';
import LogoKia from '../assets/car-logos/Kia.png';
import LogoLamborghini from '../assets/car-logos/Lamborghini.png';
import LogoLandRover from '../assets/car-logos/Land-Rover.png';
import LogoLexus from '../assets/car-logos/Lexus.png';
import LogoMg from '../assets/car-logos/MG.png';
import LogoMercedes from '../assets/car-logos/Mercedes-Benz.png';
import LogoMini from '../assets/car-logos/Mini.png';
import LogoMustang from '../assets/car-logos/Mustang.png';
import LogoRollsRoyce from '../assets/car-logos/Rolls-Royce.png';
import LogoSkoda from '../assets/car-logos/Skoda.png';
import LogoViper from '../assets/car-logos/Viper.png';
import LogoVw from '../assets/car-logos/Volkswagen.png';
import LogoLykan from '../assets/car-logos/W-Motors-Lykan.png';
import LogoAudi from '../assets/car-logos/audi.png';
import LogoBentley from '../assets/car-logos/bentley.png';
import LogoBmw from '../assets/car-logos/bmw.png';
import LogoCadillac from '../assets/car-logos/cadillac.png';
import LogoFerrari from '../assets/car-logos/ferrari.png';
import LogoFord from '../assets/car-logos/ford.png';
import LogoHonda from '../assets/car-logos/honda.png';
import LogoJaguar from '../assets/car-logos/jaguar.png';
import LogoToyota from '../assets/car-logos/toyota.png';

const localLogos = [
    { name: 'BMW M', src: LogoBmwM },
    { name: 'Bugatti', src: LogoBugatti },
    { name: 'Fiat', src: LogoFiat },
    { name: 'GMC', src: LogoGmc },
    { name: 'GT-R', src: LogoGtr },
    { name: 'Kia', src: LogoKia },
    { name: 'Lamborghini', src: LogoLamborghini },
    { name: 'Land Rover', src: LogoLandRover },
    { name: 'Lexus', src: LogoLexus },
    { name: 'MG', src: LogoMg },
    { name: 'Mercedes-Benz', src: LogoMercedes },
    { name: 'Mini', src: LogoMini },
    { name: 'Mustang', src: LogoMustang },
    { name: 'Rolls Royce', src: LogoRollsRoyce },
    { name: 'Skoda', src: LogoSkoda },
    { name: 'Viper', src: LogoViper },
    { name: 'Volkswagen', src: LogoVw },
    { name: 'W Motors', src: LogoLykan },
    { name: 'Audi', src: LogoAudi },
    { name: 'Bentley', src: LogoBentley },
    { name: 'BMW', src: LogoBmw },
    { name: 'Cadillac', src: LogoCadillac },
    { name: 'Ferrari', src: LogoFerrari },
    { name: 'Ford', src: LogoFord },
    { name: 'Honda', src: LogoHonda },
    { name: 'Jaguar', src: LogoJaguar },
    { name: 'Toyota', src: LogoToyota },
];

// Fisher-Yates shuffle — new random order on every render
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const LogoMarquee = () => {
    const [logos, setLogos] = useState([]);
    const [paused, setPaused] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setLogos(shuffle(localLogos));
    }, []);

    const handleLogoClick = (name) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setPaused(true);
        setSelectedLogo(name);

        timeoutRef.current = setTimeout(() => {
            setPaused(false);
            setSelectedLogo(null);
        }, 750);
    };

    if (logos.length === 0) {
        return (
            <div className="w-full bg-[#050505] border-t border-white/10 border-b border-black/50 py-8 sm:py-10 md:py-12 overflow-hidden relative z-30 group min-h-[140px]">
                <div className="flex w-full items-center justify-center animate-pulse gap-8 md:gap-14 overflow-hidden opacity-50">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-24 h-14 sm:w-28 sm:h-18 md:w-32 md:h-20 bg-white/5 rounded-md flex-shrink-0"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#050505] border-t border-white/10 border-b border-black/50 py-8 sm:py-10 md:py-12 overflow-hidden relative z-30 group">
            <div
                className="flex w-max marquee-track items-center"
                style={{
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            >
                {/* Triple duplication to ensure smooth loop on wide screens */}
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <div
                        key={index}
                        className={`group relative w-24 h-14 sm:w-28 sm:h-18 md:w-32 md:h-20 flex items-center justify-center mx-4 sm:mx-8 md:mx-14 cursor-pointer transition-all duration-200 ease-out ${selectedLogo === logo.name ? 'opacity-100 scale-125 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
                        onClick={() => handleLogoClick(logo.name)}
                    >
                        {logo.src ? (
                            <img
                                src={logo.src}
                                alt={logo.name}
                                className="w-full h-full object-contain select-none pointer-events-none grayscale brightness-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-200"
                            />
                        ) : (
                            <span className="text-white/50 font-bold text-xs sm:text-base md:text-lg tracking-widest uppercase">{logo.name}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Gradients - matching dark background */}
            <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-40 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-40 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none"></div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .marquee-track {
                    animation: marquee 50s linear infinite;
                    will-change: transform;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
             `}</style>
        </div>
    );
};

export default LogoMarquee;
