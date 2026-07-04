import { motion, AnimatePresence } from "motion/react";

interface LanguageSweepProps {
  isTriggered: boolean;
  onFinished: () => void;
}

export default function LanguageSweep({ isTriggered, onFinished }: LanguageSweepProps) {
  return (
    <AnimatePresence>
      {isTriggered && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          exit={{ opacity: 0 }}
          transition={{
            y: { duration: 0.95, ease: [0.43, 0.13, 0.23, 0.96] },
            opacity: { duration: 0.25 }
          }}
          onAnimationComplete={onFinished}
          className="fixed inset-0 z-[10000] pointer-events-none bg-gradient-to-b from-transparent via-[#D97757]/15 to-transparent h-[200vh] w-full"
          style={{
            backdropFilter: "brightness(1.05) contrast(1.02)",
            WebkitBackdropFilter: "brightness(1.05) contrast(1.02)"
          }}
        >
          {/* Central cozy sweeping line */}
          <div className="absolute top-1/2 left-0 w-full h-24 bg-gradient-to-r from-transparent via-[#F3C086]/35 to-transparent blur-md transform -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EEEDE9]/60 to-transparent transform -translate-y-1/2 shadow-[0_0_15px_rgba(238,237,233,0.5)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
