import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, Unlock, Sparkles, Check } from "lucide-react";
import { TranslationDictionary } from "../translations";

interface CryptoModalProps {
  isOpen: boolean;
  mode: "encrypt" | "decrypt";
  t: TranslationDictionary;
  byteCount: number;
  onFinished: () => void;
}

export default function CryptoModal({ isOpen, mode, t, byteCount, onFinished }: CryptoModalProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setProgress(0);
      return;
    }

    // Progress simulation with nice stages
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = 4 + Math.random() * 8;
        return Math.min(100, prev + increment);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (progress < 35) {
      setStep(1);
    } else if (progress < 75) {
      setStep(2);
    } else if (progress < 100) {
      setStep(3);
    } else {
      setStep(4);
      // Auto close/resolve after completion
      const delay = setTimeout(() => {
        onFinished();
      }, 1200);
      return () => clearTimeout(delay);
    }
  }, [progress, onFinished]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md overflow-hidden bg-[#EEEDE9] dark:bg-[#1E1E1C] border border-[#E0D4C1] dark:border-[#33322E] rounded-2xl shadow-2xl p-6 transition-colors duration-300"
        >
          {/* Top colored shimmer indicator */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D97757] via-[#F3C086] to-[#8F9E8B]" />

          <div className="flex flex-col items-center text-center mt-3">
            {/* Animated locks/shields */}
            <div className="relative mb-5 flex items-center justify-center">
              <motion.div
                animate={step < 4 ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.15, 1] }}
                transition={{ repeat: step < 4 ? Infinity : 0, duration: 1.5 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  step === 4 
                    ? "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30" 
                    : "bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20"
                }`}
              >
                {step === 4 ? (
                  <Check className="w-8 h-8" />
                ) : mode === "encrypt" ? (
                  <Lock className="w-7 h-7" />
                ) : (
                  <Unlock className="w-7 h-7" />
                )}
              </motion.div>

              {/* Floating particles/sparkles */}
              <AnimatePresence>
                {step < 4 && (
                  <>
                    <motion.div
                      animate={{ y: [-15, -45], x: [-10, -30], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }}
                      className="absolute text-[#D97757]"
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-15, -40], x: [10, 25], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
                      className="absolute text-[#F3C086]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <h3 className="text-lg font-serif font-bold text-[#141413] dark:text-[#ECEAE4]">
              {mode === "encrypt" ? t.encryptionTitle : t.decryptionTitle}
            </h3>
            
            <p className="text-xs text-[#141413]/60 dark:text-[#ECEAE4]/60 max-w-xs mt-1 leading-relaxed">
              {mode === "encrypt" ? t.encryptionProcessing : t.decryptionProcessing}
            </p>

            {/* Simulated steps */}
            <div className="w-full mt-6 space-y-2 text-left bg-[#E0D4C1]/20 dark:bg-[#141413]/30 p-4 rounded-xl border border-[#E0D4C1]/40 dark:border-[#33322E]/50 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${step >= 1 ? "bg-green-500" : "bg-[#141413]/30 dark:bg-[#ECEAE4]/30 animate-pulse"}`} />
                <span className={step >= 1 ? "text-[#141413] dark:text-[#ECEAE4]" : "text-[#141413]/40 dark:text-[#ECEAE4]/40"}>
                  {mode === "encrypt" ? t.securingData : t.restoringSanctuary}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${step >= 2 ? "bg-green-500" : "bg-[#141413]/15 dark:bg-[#ECEAE4]/15"}`} />
                <span className={step >= 2 ? "text-[#141413] dark:text-[#ECEAE4]" : "text-[#141413]/40 dark:text-[#ECEAE4]/40"}>
                  {mode === "encrypt" 
                    ? t.bytesSecured.replace("{bytes}", byteCount.toString()) 
                    : t.integrityChecked}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${step >= 4 ? "bg-green-500" : "bg-[#141413]/15 dark:bg-[#ECEAE4]/15"}`} />
                <span className={step >= 4 ? "text-green-600 dark:text-green-400 font-bold" : "text-[#141413]/40 dark:text-[#ECEAE4]/40"}>
                  {t.successComplete}
                </span>
              </div>
            </div>

            {/* Circular or Line Progress bar */}
            <div className="w-full mt-6">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#141413]/60 dark:text-[#ECEAE4]/60 mb-1.5">
                <span>{step === 4 ? "COMPLETE" : "PROCESSING..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-[#E0D4C1]/40 dark:bg-[#33322E] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#D97757] to-[#F3C086]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
