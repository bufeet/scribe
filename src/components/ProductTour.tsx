import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderPlus, Trash2, RotateCcw, Sparkles, ArrowRight, X, Disc, ShieldCheck } from "lucide-react";

interface ProductTourProps {
  onClose: () => void;
  onStepChange?: (step: number | null) => void;
}

export default function ProductTour({ onClose, onStepChange }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Vessels for Your Thoughts",
      subtitle: "Notes & Standalones",
      description: "Create folders to organize your notes, or write free-floating standalone notes. Keep your focus pure and simple.",
      icon: <FolderPlus className="w-12 h-12 text-[#D97757]" />,
      tip: "💡 Tip: Click 'New Folder' in the sidebar or just write a 'Standalone Note' directly.",
      bgColor: "bg-[#EEEDE9]"
    },
    {
      title: "The Art of Letting Go",
      subtitle: "Subtle Deletions",
      description: "Keep your workspace clean and cozy. Delete single notes or entire folders without hesitation whenever you need a clean slate.",
      icon: <Trash2 className="w-10 h-10 text-[#D97757]" />,
      tip: "💡 Tip: Deleting a folder automatically sends all of its nested notes to the trash.",
      bgColor: "bg-[#EEEDE9]"
    },
    {
      title: "Memory & Regeneration",
      subtitle: "The Chronicles & Trash",
      description: "The History logs keep a record of your creations. The Trash Bin lets you restore accidentally deleted thoughts or clear them permanently.",
      icon: <RotateCcw className="w-10 h-10 text-[#D97757]" />,
      tip: "💡 Tip: Items in the trash are shown with days remaining, simulating a 30-day auto-purge.",
      bgColor: "bg-[#EEEDE9]"
    },
    {
      title: "The Soundtrack of Peace",
      subtitle: "Scribe Gramophone",
      description: "Enhance your focus with custom audio atmosphere. Import local audio libraries (.mp3, .wav, .flac) or listen to curated pre-loaded writing tracks.",
      icon: <Disc className="w-10 h-10 text-[#D97757]" />,
      tip: "💡 Tip: Fast-forward, rewind, seek through songs, and let the retro record platter continue spinning even if you collapse the sidebar.",
      bgColor: "bg-[#EEEDE9]"
    },
    {
      title: "Sovereign Limits",
      subtitle: "Sanctuary Settings",
      description: "To prevent excessive token usage while maintaining zero server logging, Scribe implements a default creative limit (e.g., 10 requests). After reaching the limit, you must wait 1 hour for a reset, or input your own Google Gemini API Key in the settings to enjoy unlimited local prose generation.",
      icon: <ShieldCheck className="w-10 h-10 text-[#D97757]" />,
      tip: "💡 Tip: Go to Sanctuary Settings to monitor your active usage counts and input your secure credentials.",
      bgColor: "bg-[#EEEDE9]"
    }
  ];

  // Notify parent of step change on mount or change
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
    return () => {
      if (onStepChange) onStepChange(null);
    };
  }, [currentStep, onStepChange]);

  const current = steps[currentStep];

  // Render first step (Step 0) as a large, centered card
  if (currentStep === 0) {
    return (
      <div className="fixed inset-0 bg-[#141413]/70 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-lg w-full bg-[#EEEDE9] border border-[#E0D4C1] rounded-2xl shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center glow-terracotta"
        >
          {/* Close Button top-right */}
          <button 
            id="btn-close-tour"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#E0D4C1] text-[#141413]/60 hover:text-[#141413] transition-all cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step Indicator */}
          <div className="text-xs font-mono tracking-widest text-[#D97757] uppercase mb-2">
            Step {currentStep + 1} of {steps.length}
          </div>

          {/* Dynamic Icon */}
          <div className="mb-6 bg-[#E0D4C1]/30 p-5 rounded-full relative">
            <motion.div
              key={currentStep}
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {current.icon}
            </motion.div>
            <div className="absolute -bottom-1 -right-1 bg-[#D97757] text-white p-1 rounded-full">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Step Content */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-serif text-[#141413] font-semibold mb-1">
              {current.title}
            </h2>
            <p className="text-xs uppercase tracking-wide font-mono text-[#141413]/55 mb-4">
              {current.subtitle}
            </p>
            <p className="text-[#141413]/80 leading-relaxed text-sm mb-6 max-w-sm">
              {current.description}
            </p>
            <div className="bg-[#E0D4C1]/25 text-xs text-[#141413]/70 p-3 rounded-lg border border-[#E0D4C1]/40 mb-8 max-w-sm font-sans italic text-left">
              {current.tip}
            </div>
          </div>

          {/* Navigation & Progress bar */}
          <div className="w-full flex items-center justify-between mt-auto">
            {/* Bullet indicators */}
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? "w-6 bg-[#D97757]" : "w-1.5 bg-[#E0D4C1]"
                  }`}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                id="btn-tour-next"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 text-xs font-medium rounded-lg bg-[#D97757] text-white hover:bg-[#c46546] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Steps > 0 (subsequent cards): The central card disappears and the screen dims slightly,
  // highlighting only the specific feature with a floating tooltip pointing to it.
  let tooltipTop = "top-[60px] md:top-[120px]";
  if (currentStep === 1) {
    tooltipTop = "top-[160px] md:top-[280px]";
  } else if (currentStep === 3) {
    tooltipTop = "bottom-[130px]";
  } else if (currentStep === 4) {
    tooltipTop = "bottom-[20px]";
  }

  return (
    <div className="fixed inset-0 bg-[#141413]/35 backdrop-blur-[1px] z-40 font-sans">
      
      {/* Spotlight highlight visual shield (overlay) that absorbs clicks everywhere else but keeps the user fully focused */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-[336px] ${tooltipTop} w-80 sm:w-88 bg-[#EEEDE9] border border-[#E0D4C1] rounded-2xl shadow-2xl p-6 flex flex-col z-50 text-left glow-terracotta`}
        >
          {/* Accent pointer arrow on the left border pointing to the Sidebar highlight */}
          <div className="absolute -left-2 top-8 w-4 h-4 bg-[#EEEDE9] rotate-45 border-l border-b border-[#E0D4C1]" />

          {/* Close Button top-right */}
          <button 
            id="btn-close-tour"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#E0D4C1] text-[#141413]/60 hover:text-[#141413] transition-all cursor-pointer"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step Indicator */}
          <div className="text-[10px] font-mono tracking-widest text-[#D97757] uppercase mb-1">
            Step {currentStep + 1} of {steps.length}
          </div>

          <div className="flex gap-3.5 items-start mb-3">
            <div className="bg-[#E0D4C1]/40 p-2.5 rounded-xl shrink-0 text-[#D97757]">
              {current.icon}
            </div>
            <div>
              <h3 className="text-lg font-serif text-[#141413] font-bold">
                {current.title}
              </h3>
              <p className="text-[10px] uppercase tracking-wider font-mono text-[#141413]/55">
                {current.subtitle}
              </p>
            </div>
          </div>

          <p className="text-[#141413]/80 leading-relaxed text-xs mb-4">
            {current.description}
          </p>

          <div className="bg-[#E0D4C1]/20 text-[11px] text-[#141413]/70 p-3 rounded-lg border border-[#E0D4C1]/30 mb-5 font-sans italic text-left">
            {current.tip}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E0D4C1]/40">
            {/* Dots */}
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep ? "w-4 bg-[#D97757]" : "w-1.5 bg-[#E0D4C1]"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-1.5">
              <button
                id="btn-tour-prev"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E0D4C1] text-[#141413]/70 hover:bg-[#E0D4C1] hover:text-[#141413] transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                id="btn-tour-next"
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    onClose();
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#D97757] text-white hover:bg-[#c46546] shadow-sm flex items-center gap-1 transition-all cursor-pointer font-mono"
              >
                {currentStep === steps.length - 1 ? (
                  "Begin"
                ) : (
                  <>
                    Next <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
