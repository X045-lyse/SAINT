
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Ghost } from 'lucide-react';
import { LoveLetterData } from '../types';
import Envelope from '../components/Envelope';

interface ReceiveViewProps {
  data: LoveLetterData;
}

const NO_MESSAGES = [
  "Tu es sûr(e) ? 😏",
  "Réfléchis encore ❤️",
  "Allez dis oui 🥺",
  "Mon cœur ne tiendra pas 💔",
  "Vraiment ? 😢",
  "Oups, le bouton bouge !",
  "Impossible de dire non maintenant ✨",
  "C'est ton dernier mot ?",
  "Regarde comme le bouton OUI est beau !",
  "Dis ouiiiii s'il te plaît 🙏"
];

const ReceiveView: React.FC<ReceiveViewProps> = ({ data }) => {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);

  const noBtnRef = useRef<HTMLButtonElement>(null);

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    const newX = (Math.random() - 0.5) * 300;
    const newY = (Math.random() - 0.5) * 300;
    setNoButtonPos({ x: newX, y: newY });
    
    // Sound effect (optional if supported)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleYesClick = () => {
    setAccepted(true);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E63946', '#FF4D6D', '#FFD1DC', '#D4AF37']
    });

    // Start typewriter after transition
    setTimeout(() => {
      setEnvelopeOpen(true);
    }, 1000);
  };

  useEffect(() => {
    if (envelopeOpen && typingIndex < data.message.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + data.message[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [envelopeOpen, typingIndex, data.message]);

  const yesScale = 1 + (noCount * 0.2);
  const noScale = Math.max(0.1, 1 - (noCount * 0.1));
  const showNo = noCount < 10;

  return (
    <div className="w-full text-center">
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div 
            key="ask"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-romantic text-[#E63946] leading-tight">
                {data.recipient}, <br />
                Veux-tu être mon/ma Valentin(e) ? ❤️
              </h1>
              {noCount > 0 && (
                <motion.p 
                  key={noCount}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl text-gray-500 font-semibold italic"
                >
                  {NO_MESSAGES[Math.min(noCount - 1, NO_MESSAGES.length - 1)]}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[400px]">
              <motion.button
                style={{ scale: yesScale }}
                animate={noCount >= 10 ? { scale: [yesScale, yesScale * 1.1, yesScale] } : {}}
                transition={noCount >= 10 ? { duration: 1, repeat: Infinity } : {}}
                onClick={handleYesClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-full shadow-2xl transition-colors text-3xl flex items-center gap-3 z-50"
              >
                OUI 💚
              </motion.button>

              {showNo && (
                <motion.button
                  ref={noBtnRef}
                  animate={{ x: noButtonPos.x, y: noButtonPos.y, scale: noScale }}
                  onClick={handleNoClick}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 px-8 rounded-full shadow-lg border border-gray-200 text-xl z-40"
                >
                  NON ❌
                </motion.button>
              )}
            </div>

            {noCount > 0 && (
              <p className="text-gray-400 text-sm">
                Nombre d'essais pour dire non : <span className="font-bold text-[#FF4D6D]">{noCount}</span> 😅
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="mb-8"
            >
               <h2 className="text-4xl font-romantic text-[#E63946] mb-2">Youpiii ! 🎉</h2>
               <p className="text-gray-600">Regarde ce que j'ai pour toi...</p>
            </motion.div>

            <Envelope isOpen={envelopeOpen}>
              <div className="flex flex-col h-full text-left">
                <p className="text-lg font-romantic text-[#E63946] mb-4 text-2xl">Ma chère {data.recipient},</p>
                
                <div className="flex-grow text-gray-700 font-medium whitespace-pre-wrap typewriter">
                  {displayText}
                </div>

                <div className="mt-6 pt-4 border-t border-pink-100 text-right">
                  <p className="font-romantic text-[#E63946] text-3xl">
                    Pour toujours, <br />
                    {data.sender} ❤️
                  </p>
                </div>
              </div>
            </Envelope>

            {envelopeOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={() => window.location.hash = ''}
                className="mt-24 text-[#FF4D6D] font-semibold hover:underline"
              >
                Créer ma propre lettre
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceiveView;
