
import React from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Envelope: React.FC<EnvelopeProps> = ({ isOpen, children }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/3] flex items-center justify-center">
      {/* Back of envelope */}
      <div className="absolute inset-0 bg-[#FFD1DC] rounded-lg shadow-xl border-2 border-white/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100 to-[#FFD1DC]" />
      </div>

      {/* The Letter */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={isOpen ? { y: -100, opacity: 1, scale: 1.05 } : { y: 0, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        className="absolute w-[90%] bg-white p-8 rounded shadow-lg z-20 min-h-[300px] flex flex-col justify-between border-t-4 border-[#E63946]"
      >
        {children}
      </motion.div>

      {/* Front flap top (Animated) */}
      <motion.div
        initial={{ rotateX: 0 }}
        animate={isOpen ? { rotateX: 160 } : { rotateX: 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: 'top', zIndex: isOpen ? 10 : 30 }}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#FF4D6D] rounded-t-lg clip-flap flex items-center justify-center overflow-hidden border-b-2 border-white/20"
      >
        {!isOpen && <span className="text-white text-4xl transform rotate-[-10deg]">💌</span>}
      </motion.div>
      
      {/* Front bottom flaps */}
      <div className="absolute bottom-0 left-0 w-full h-full z-25 pointer-events-none overflow-hidden rounded-lg">
         <div className="absolute bottom-0 left-0 w-full h-full bg-[#FF4D6D]/10" />
         <svg viewBox="0 0 500 300" className="absolute inset-0 w-full h-full">
            <path d="M0 300 L250 150 L500 300 Z" fill="#FF4D6D" opacity="0.9" />
            <path d="M0 0 L250 150 L0 300 Z" fill="#FF8FA3" opacity="0.7" />
            <path d="M500 0 L250 150 L500 300 Z" fill="#FF8FA3" opacity="0.7" />
         </svg>
      </div>
    </div>
  );
};

export default Envelope;
