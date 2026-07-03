import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Feather, BookOpen, Sparkles, ShieldCheck, ArrowRight, 
  Lock, Scale, FileText, EyeOff, Heart, Compass, ChevronRight, X, Sparkle, Disc 
} from "lucide-react";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<"landing" | "terms" | "privacy">("landing");
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [typingStep, setTypingStep] = useState(0);

  // Auto-typing simulation to showcase Scribe's tag trigger
  useEffect(() => {
    if (activeTab !== "landing") return;
    
    const phrases = [
      "The solitary tower overlooked the misty cliffs. ",
      "@idea",
      " Inside, a single candle flickered against the ancient stone wall, casting shadows that seemed to write their own stories of forgotten kingdoms."
    ];

    let currentPhraseIndex = typingStep % phrases.length;
    let currentText = currentPhraseIndex === 0 ? "" : phrases.slice(0, currentPhraseIndex).join("");
    let targetText = phrases[currentPhraseIndex];
    let charIndex = 0;
    let timer: NodeJS.Timeout;

    if (currentPhraseIndex === 1) {
      // Pause on tag trigger for dramatic effect
      timer = setTimeout(() => {
        setTypedText(currentText + "@idea");
        setTimeout(() => {
          setTypingStep(prev => prev + 1);
        }, 1200);
      }, 500);
    } else {
      const type = () => {
        if (charIndex < targetText.length) {
          currentText += targetText[charIndex];
          setTypedText(currentText);
          charIndex++;
          timer = setTimeout(type, currentPhraseIndex === 2 ? 25 : 50);
        } else {
          // Finished typing this segment
          timer = setTimeout(() => {
            if (currentPhraseIndex === 2) {
              // Wait before restarting loop
              setTimeout(() => {
                setTypedText("");
                setTypingStep(0);
              }, 4000);
            } else {
              setTypingStep(prev => prev + 1);
            }
          }, 1500);
        }
      };
      timer = setTimeout(type, 200);
    }

    return () => clearTimeout(timer);
  }, [typingStep, activeTab]);

  return (
    <div className="min-h-screen bg-[#EEEDE9] text-[#141413] font-sans antialiased selection:bg-[#D97757]/20 selection:text-[#D97757] relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Dynamic Ambient Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D97757]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#D97757]/3 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Persistent Elegant Header */}
      <header className="sticky top-0 z-50 bg-[#EEEDE9]/80 backdrop-blur-md border-b border-[#E0D4C1]/60 px-6 py-4 flex items-center justify-between transition-colors">
        <div 
          onClick={() => setActiveTab("landing")} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#141413] flex items-center justify-center text-[#EEEDE9] group-hover:bg-[#D97757] transition-all duration-300 shadow-sm">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg tracking-tight block">Scribe</span>
            <span className="text-[9px] font-mono tracking-widest text-[#141413]/40 uppercase block">Creative Sanctuary</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wide text-[#141413]/70">
          <button 
            onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }), 100); }} 
            className="hover:text-[#D97757] transition-colors cursor-pointer"
          >
            FEATURES
          </button>
          <button 
            onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" }), 100); }} 
            className="hover:text-[#D97757] transition-colors cursor-pointer"
          >
            OUR ETHOS
          </button>
          <button 
            onClick={() => setActiveTab("terms")} 
            className={`hover:text-[#D97757] transition-colors cursor-pointer ${activeTab === "terms" ? "text-[#D97757] font-semibold" : ""}`}
          >
            TERMS
          </button>
          <button 
            onClick={() => setActiveTab("privacy")} 
            className={`hover:text-[#D97757] transition-colors cursor-pointer ${activeTab === "privacy" ? "text-[#D97757] font-semibold" : ""}`}
          >
            PRIVACY & DATA
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchApp}
            className="px-4 py-2 bg-[#141413] hover:bg-[#D97757] text-[#EEEDE9] hover:text-[#EEEDE9] font-mono text-[11px] font-medium tracking-wider rounded-lg transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
          >
            LAUNCH APP
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* LANDING TAB */}
          {activeTab === "landing" && (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-12 md:py-24 max-w-6xl mx-auto flex flex-col gap-24"
            >
              
              {/* Hero Section */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D97757]/10 rounded-full border border-[#D97757]/20 w-fit">
                    <Sparkles className="w-3 h-3 text-[#D97757]" />
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-[#D97757] uppercase">A new standard for creative focus</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-[#141413] leading-[1.08]">
                    Where raw thought becomes <span className="font-serif italic text-[#D97757]">literature.</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-[#141413]/70 font-sans leading-relaxed max-w-xl">
                    Scribe is an elegant digital sanctuary designed to combine the quiet focus of physical stationery with an intelligent, literary sounding board. Free from distraction, crafted for absolute data privacy.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={onLaunchApp}
                      className="px-8 py-4 bg-[#D97757] hover:bg-[#c46546] text-white font-serif font-medium rounded-xl text-base shadow-lg shadow-[#D97757]/20 hover:shadow-xl transition-all flex items-center justify-center gap-3.5 cursor-pointer group"
                    >
                      Try Scribe Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-6 py-4 bg-transparent hover:bg-[#141413]/5 border border-[#E0D4C1] text-[#141413] font-mono text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      EXPLORE FEATURES
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E0D4C1]/60 font-mono text-[10px] text-[#141413]/50">
                    <div>
                      <span className="font-serif font-bold text-lg text-[#141413] block mb-1">0%</span>
                      DATA RETENTION
                    </div>
                    <div>
                      <span className="font-serif font-bold text-lg text-[#141413] block mb-1">100%</span>
                      CONTENT OWNERSHIP
                    </div>
                    <div>
                      <span className="font-serif font-bold text-lg text-[#141413] block mb-1">Cozy</span>
                      WRITING ATMOSPHERE
                    </div>
                  </div>
                </div>

                {/* Animated Interactive Text Box Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D97757]/10 to-transparent rounded-3xl blur-2xl -z-10" />
                  
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[#FAF9F6] border border-[#E0D4C1] rounded-2xl shadow-xl overflow-hidden flex flex-col h-80 relative"
                  >
                    {/* Window Controls */}
                    <div className="bg-[#EEEDE9] px-4 py-2.5 border-b border-[#E0D4C1]/60 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E0D4C1]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E0D4C1]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E0D4C1]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#141413]/40 tracking-wider">creative_draft.txt</span>
                      <Sparkle className="w-3.5 h-3.5 text-[#D97757]/60 animate-pulse" />
                    </div>

                    {/* Paper Content Area */}
                    <div className="p-6 flex-grow font-serif text-sm text-[#141413]/80 leading-relaxed overflow-y-auto">
                      <p className="whitespace-pre-wrap relative">
                        {typedText}
                        <span className="inline-block w-1.5 h-4 bg-[#D97757] ml-0.5 animate-pulse shrink-0 vertical-align-middle" />
                      </p>
                    </div>

                    {/* Interactive Showcase Indicator */}
                    <div className="absolute bottom-3 right-3 bg-[#141413] text-[#EEEDE9] rounded-lg px-2.5 py-1 text-[9px] font-mono tracking-wider flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      <span>Sounding board active</span>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Core Features Grid */}
              <section id="features" className="flex flex-col gap-12 pt-12 border-t border-[#E0D4C1]/60">
                <div className="max-w-2xl">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block mb-2">Pristine Architecture</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">Crafted for the modern wordsmith.</h2>
                  <p className="text-sm text-[#141413]/60 mt-3 leading-relaxed">
                    Scribe replaces busy sidebars, chaotic alerts, and distracting metrics with a thoughtful, cozy interface that supports and elevates your writing flow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-[#FAF9F6]/60 hover:bg-[#FAF9F6] border border-[#E0D4C1]/60 hover:border-[#E0D4C1] p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Literary Sounding Board</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Our delicate AI companion expands your writing gracefully. Simply drop <span className="font-mono text-[#D97757]">@idea</span> in your text to let Scribe analyze preceding context and continue your trail of thought.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-[#FAF9F6]/60 hover:bg-[#FAF9F6] border border-[#E0D4C1]/60 hover:border-[#E0D4C1] p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Feather className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Refinement</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Preserve your authorial identity. Using <span className="font-mono text-[#D97757]">@fix</span> cleans grammatical mistakes, spelling, or awkward phrasing while maintaining your unique cozy voice and structures.
                    </p>
                  </div>

                  {/* Feature 3 (Gramophone) */}
                  <div className="bg-[#FAF9F6]/60 hover:bg-[#FAF9F6] border border-[#E0D4C1]/60 hover:border-[#E0D4C1] p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757] group-hover:rotate-12 transition-all duration-300">
                      <Disc className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Scribe Gramophone</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Write accompanied by serene melodies. Import local audio libraries (<span className="font-mono text-[#D97757]">.mp3, .wav, .flac</span>) and control playback via an elegant spinning vinyl deck.
                    </p>
                    <div className="absolute -bottom-6 -right-6 w-14 h-14 rounded-full bg-[#141413]/5 border border-[#141413]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="w-8 h-8 rounded-full border border-[#141413]/10 flex items-center justify-center animate-spin">
                        <div className="w-3 h-3 rounded-full bg-[#D97757]/20" />
                      </div>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-[#FAF9F6]/60 hover:bg-[#FAF9F6] border border-[#E0D4C1]/60 hover:border-[#E0D4C1] p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Total Sovereignty</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Zero server storage. Zero analytical profiles. Your words live safely inside your browser's secure sandbox. Scribe is built entirely on localized offline-first values.
                    </p>
                  </div>
                </div>
              </section>

              {/* Ethical AI and Ethos Section */}
              <section id="vision" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#141413] text-[#EEEDE9] rounded-3xl p-8 md:p-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D97757]/10 to-transparent pointer-events-none" />
                
                <div className="flex flex-col gap-6 relative z-10">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block">Our Philosophy</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight leading-tight">
                    AI should amplify human expression—never substitute it.
                  </h2>
                  <p className="text-sm text-[#EEEDE9]/70 leading-relaxed font-sans">
                    Scribe is our digital ode to the physical writing desk. We designed Scribe with the core belief that tools should invite magic back into typing.
                  </p>
                  <p className="text-sm text-[#EEEDE9]/70 leading-relaxed font-sans">
                    Instead of massive chat generators that flood screens with AI-generated text, Scribe listens quietly, waiting to act as a resonant chamber that mirrors and extends your own brilliance when blocks happen.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onLaunchApp}
                      className="px-5 py-3 bg-[#D97757] hover:bg-[#c46546] text-white font-mono text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      EXPERIENCE THE DIFFERENCE
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 border-l border-[#EEEDE9]/10 pl-6 md:pl-10 relative z-10 py-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-base mb-1">Strict Sandbox Secrecy</h4>
                      <p className="text-xs text-[#EEEDE9]/60 leading-relaxed">
                        No persistent tracking database is created. Everything is processed directly with secure, zero-data-retention prompts.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-base mb-1">Cozy Aesthetic Flow</h4>
                      <p className="text-xs text-[#EEEDE9]/60 leading-relaxed">
                        Soft pastel, warm off-white and charcoal elements craft an atmosphere where the brain naturally winds down to create.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-base mb-1">Your Key, Your Sanctuary</h4>
                      <p className="text-xs text-[#EEEDE9]/60 leading-relaxed">
                        Integrates directly with your local Google Gemini credentials. Complete control over your operational parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Call to Action banner */}
              <section className="text-center py-12 flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <span className="w-10 h-px bg-[#E0D4C1] block" />
                <h2 className="text-3xl font-serif font-semibold tracking-tight text-[#141413]">
                  Ready to transcend the white sheet?
                </h2>
                <p className="text-sm text-[#141413]/60 leading-relaxed font-sans">
                  Join hundreds of writers, essayists, and dreamers who have rediscovered the joy of quiet, secure digital composition with Scribe.
                </p>
                <button
                  onClick={onLaunchApp}
                  className="px-8 py-4 bg-[#141413] hover:bg-[#D97757] text-[#EEEDE9] hover:text-[#EEEDE9] font-serif font-medium rounded-xl text-base shadow-lg transition-all flex items-center gap-3 cursor-pointer"
                >
                  Enter the Writing Sanctuary
                  <ArrowRight className="w-5 h-5" />
                </button>
              </section>

            </motion.div>
          )}

          {/* TERMS OF USE TAB */}
          {activeTab === "terms" && (
            <motion.div
              key="terms-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-12 max-w-3xl mx-auto flex flex-col gap-8"
            >
              <div className="flex items-center gap-3 border-b border-[#E0D4C1] pb-6">
                <div className="w-10 h-10 rounded-xl bg-[#141413] flex items-center justify-center text-[#EEEDE9]">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#141413]">Terms of Use</h1>
                  <p className="text-xs font-mono text-[#141413]/50">Effective as of July 2, 2026</p>
                </div>
              </div>

              <div className="prose prose-stone font-sans text-xs leading-relaxed text-[#141413]/80 flex flex-col gap-6">
                <p className="text-sm font-medium text-[#141413]">
                  Welcome to Scribe. By launching, accessing, or using Scribe (hereafter "the Service" or "Sanctuary"), you agree to abide by these clear, humble Terms of Use.
                </p>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">1. Absolute Creative Ownership</h3>
                  <p>
                    Everything you type, draft, compose, delete, or refine within Scribe belongs 100% to you. We lay no claim of copyright, trademark, or ownership over any user content created using our writing features. You bear full responsibility for the stories you output and the contexts you construct.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">2. Direct API Integration & Keys</h3>
                  <p>
                    Scribe operates as a client-side interface that integrates with third-party Artificial Intelligence models (such as Google's Gemini models). To activate the Sounding Board or Refinement features (@idea and @fix), you must supply your own valid API key. By importing your API key, you represent that you comply with that provider's service policies.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">3. Fair Rate Limits</h3>
                  <p>
                    To ensure smooth operation and prevent accidental excessive billing of credentials, Scribe includes local hourly rate limit indicators configurable on the settings page. You agree not to bypass, reverse engineer, or intentionally dismantle these metrics.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">4. Humble Disclaimer</h3>
                  <p>
                    Scribe is provided on an "as-is" and "as-available" basis, without warranty of any kind. As an offline-first workspace, you understand that your files are stored locally. If you clear your browser's application cache, history, or cookies, your saved folders and notes will be permanently destroyed unless manually exported.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">5. Respectful Creation</h3>
                  <p>
                    You agree not to use Scribe's literary companion to formulate threats, launch targeted harassment campaigns, or generate malicious code designed to harm web networks. We trust you to use this tool to write with honor and elegance.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E0D4C1]/60 flex justify-between items-center">
                <button 
                  onClick={() => setActiveTab("landing")}
                  className="text-xs font-mono text-[#D97757] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Return Home
                </button>
                <button 
                  onClick={onLaunchApp}
                  className="px-4 py-2 bg-[#141413] text-[#EEEDE9] text-xs font-mono tracking-wider rounded-lg hover:bg-[#D97757] transition-all cursor-pointer"
                >
                  Launch Scribe
                </button>
              </div>
            </motion.div>
          )}

          {/* PRIVACY POLICY TAB */}
          {activeTab === "privacy" && (
            <motion.div
              key="privacy-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-12 max-w-3xl mx-auto flex flex-col gap-8"
            >
              <div className="flex items-center gap-3 border-b border-[#E0D4C1] pb-6">
                <div className="w-10 h-10 rounded-xl bg-[#141413] flex items-center justify-center text-[#EEEDE9]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#141413]">Privacy & Data Policy</h1>
                  <p className="text-xs font-mono text-[#141413]/50">The Scribe Sandbox Privacy Guarantee</p>
                </div>
              </div>

              <div className="prose prose-stone font-sans text-xs leading-relaxed text-[#141413]/80 flex flex-col gap-6">
                <div className="bg-[#D97757]/5 border border-[#D97757]/15 rounded-xl p-4 flex gap-3">
                  <Lock className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#141413]/70 leading-relaxed font-sans m-0">
                    <strong>Our Core Promise:</strong> Scribe does not sell, read, lease, profile, or retain your written notes. Everything you write is yours alone and is sandboxed completely inside your browser.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">1. Localized Storage Paradigm</h3>
                  <p>
                    All folders, drafts, notes, and change histories are saved inside standard web LocalStorage. We do not transmit your documents to our servers, nor do we host cloud records of your journals. Scribe operates entirely as a local workspace.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">2. Third-Party AI Integrations</h3>
                  <p>
                    To operate the inline sounding board tags (<span className="font-mono text-[#D97757]">@idea</span> and <span className="font-mono text-[#D97757]">@fix</span>), Scribe passes the relevant paragraph context securely to Google's Gemini models API. These requests are secure, transit-encrypted, and comply with strict corporate enterprise terms: Google does not use inputs passed via API developer endpoints to train public foundation models, ensuring your stories remain your private intellectual property.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">3. No Advertising, Trackers, or Analytics</h3>
                  <p>
                    We reject the corporate attention economy. Scribe has zero cookies, zero analytics packages (like Google Analytics), and zero marketing telemetry. We do not track where you write from, how long you write, or how many words you draft.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">4. Security of API Credentials</h3>
                  <p>
                    Your Gemini or custom API keys are saved exclusively in your browser's local sandbox memory. They are never sent back to any Scribe servers. Your secrets remain strictly within your device context.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-sm text-[#141413] mb-2 uppercase tracking-wide font-mono">5. Managing & Deleting Your Data</h3>
                  <p>
                    Because we do not store your data, you are in total control. To destroy all traces of your writing, simply use the "Empty Trash" function inside the Scribe trash bin, or clear your browser cache for this domain.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E0D4C1]/60 flex justify-between items-center">
                <button 
                  onClick={() => setActiveTab("landing")}
                  className="text-xs font-mono text-[#D97757] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Return Home
                </button>
                <button 
                  onClick={onLaunchApp}
                  className="px-4 py-2 bg-[#141413] text-[#EEEDE9] text-xs font-mono tracking-wider rounded-lg hover:bg-[#D97757] transition-all cursor-pointer"
                >
                  Launch Scribe
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#141413] text-[#EEEDE9]/60 px-6 py-10 text-xs font-sans mt-auto border-t border-[#EEEDE9]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97757] flex items-center justify-center text-white font-serif font-bold">
              S
            </div>
            <div>
              <span className="font-serif text-[#EEEDE9] font-medium tracking-wide block">Scribe Sanctuary</span>
              <span className="text-[9px] font-mono tracking-wider block uppercase">Crafted with tranquility</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-mono text-[10px]">
            <button onClick={() => setActiveTab("landing")} className="hover:text-white transition-colors cursor-pointer">HOME</button>
            <button onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-white transition-colors cursor-pointer">FEATURES</button>
            <button onClick={() => setActiveTab("terms")} className="hover:text-white transition-colors cursor-pointer">TERMS OF USE</button>
            <button onClick={() => setActiveTab("privacy")} className="hover:text-white transition-colors cursor-pointer">PRIVACY GUARANTEE</button>
          </div>

          <div className="text-[10px] font-mono text-center md:text-right flex flex-col gap-1 items-center md:items-end">
            <div>&copy; 2026 Scribe. Built for absolute author sovereignty.</div>
            <div className="text-[#EEEDE9]/40">
              All credits belong to <a href="https://linkedin.com/in/joalx" target="_blank" rel="noopener noreferrer" className="text-[#D97757] hover:underline hover:text-[#c46546] font-semibold">João Leite (@joalx)</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
