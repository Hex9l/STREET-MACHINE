import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import SmoothScroll from './components/SmoothScroll';
import Navigation from './components/Navigation';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './pages/Footer';

import Vehicles from './pages/Vehicles';
import VehicleDetails from './pages/VehicleDetails';

import Compare from './pages/Compare';
import AdminDashboard from './pages/AdminDashboard';
import Gallery from './components/Gallery';
import KnowledgeBase from './pages/KnowledgeBase';

import { Toaster } from 'react-hot-toast';

import engineSound from './assets/car-audios/Engine Start.mp3';

const engineAudio = new Audio(engineSound);
engineAudio.preload = 'auto';
let hasPlayed = false;

const playInstantSound = () => {
  if (hasPlayed) return;
  
  engineAudio.currentTime = 0;
  engineAudio.play().then(() => {
    hasPlayed = true;
    // Remove listeners once successfully played
    document.removeEventListener('click', playInstantSound);
  }).catch((err) => {
    // Audio autoplay blocked by browser. This is expected until user interaction.
  });
};

// Fire immediately upon parsing the JavaScript chunk for zero latency
playInstantSound();

// Aggressive fallbacks for instant play as soon as the user touches the window
document.addEventListener('click', playInstantSound);


const AnimatedRoutes = () => {
  const location = useLocation();

  // ✅ Fix: Reset scroll + recalculate Lenis dimensions on EVERY route change,
  // including browser back/forward (POP). This prevents the blank screen bug
  // where Lenis is stuck mid-page when navigating back to a previously visited page.
  useEffect(() => {
    // Disable native scroll restoration to prevent conflicts with Lenis and Framer Motion
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.scrollReset) {
      window.scrollReset();
    } else {
      // Fallback if Lenis hasn't initialized yet
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence 
      mode="wait"
      onExitComplete={() => {
        // Always scroll to top when exit animation finishes (for all nav types)
        if (window.scrollReset) {
          window.scrollReset();
        } else {
          window.scrollTo(0, 0);
        }
      }}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition key="home"><Footer /></PageTransition>} />
        <Route path="/login" element={<PageTransition key="login"><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition key="signup"><Signup /></PageTransition>} />
        <Route path="/cars" element={<PageTransition key="cars"><Vehicles type="car" /></PageTransition>} />
        <Route path="/bikes" element={<PageTransition key="bikes"><Vehicles type="bike" /></PageTransition>} />
        <Route path="/vehicles/:id" element={<PageTransition key={location.pathname}><VehicleDetails /></PageTransition>} />

        <Route path="/compare" element={<PageTransition key="compare"><Compare /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition key="gallery"><Gallery /></PageTransition>} />
        <Route path="/knowledge" element={<PageTransition key="knowledge"><KnowledgeBase /></PageTransition>} />
        <Route path="/admin" element={<PageTransition key="admin"><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SmoothScroll>
        <AuthProvider>
          <CompareProvider>
            <div className="bg-black min-h-screen text-white font-sans selection:bg-[#ef4444]/30">
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #ef4444',
                    borderRadius: '0px',
                    padding: '16px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: 'white',
                    },
                  },
                }}
              />
              <Navigation />
              <AnimatedRoutes />
            </div>
          </CompareProvider>
        </AuthProvider>
      </SmoothScroll>
    </Router>
  );
}

export default App;
