import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const UPLIFTING_QUOTES = [
  { text: "Writing is an exploration. You start from nothing and learn as you go.", author: "E.L. Doctorow" },
  { text: "Fill your paper with the breathings of your heart.", author: "William Wordsworth" },
  { text: "To write is to discover the poetry of existence within silent margins.", author: "Scribe Philosophy" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "Close the door. Write with no one looking over your shoulder.", author: "Stephen King" },
  { text: "Find sanctuary in the slow, quiet rhythm of your words.", author: "Scribe Musings" }
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Select a random quote for this load
    setQuoteIndex(Math.floor(Math.random() * UPLIFTING_QUOTES.length));

    // Simulate load time (3.5 seconds total) and then call onComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const currentQuote = UPLIFTING_QUOTES[quoteIndex];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.02,
        filter: "blur(10px)",
        transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] } 
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-fluid-gradient p-6 font-sans"
    >
      <div className="max-w-xl w-full flex flex-col items-center text-center space-y-8">
        
        {/* Animated App Brand Logo & Name */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-[#D97757] text-[#EEEDE9] p-4 rounded-2xl shadow-xl relative glow-terracotta"
          >
            <FeatherLargeIcon />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute -top-1 -right-1 bg-[#EEEDE9] text-[#D97757] p-1 rounded-full border border-[#D97757]/30"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-wide text-[#141413]">
              Scribe
            </h1>
            <p className="text-xs font-mono tracking-widest text-[#D97757] uppercase mt-1">
              Creative Sounding Board
            </p>
          </motion.div>
        </div>

        {/* Elegant divider line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="h-0.5 bg-[#D97757]/30 rounded-full"
        />

        {/* Inspirational Quote display block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="space-y-3 px-4 sm:px-8"
        >
          <p className="text-lg sm:text-xl font-serif italic text-[#141413]/85 leading-relaxed">
            "{currentQuote.text}"
          </p>
          <p className="text-xs font-mono text-[#D97757] tracking-wider uppercase">
            — {currentQuote.author}
          </p>
        </motion.div>

        {/* Subtle loading indicator */}
        <div className="pt-8">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-[10px] font-mono text-[#141413]/40 tracking-wider uppercase mt-3">
            Opening your writing sanctuary
          </p>
        </div>

      </div>
    </motion.div>
  );
}

function FeatherLargeIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="36" 
      height="36" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}
