import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Feather, BookOpen, Sparkles, ShieldCheck, ArrowRight, 
  Lock, Scale, FileText, EyeOff, Heart, Compass, ChevronRight, X, Sparkle, Disc,
  Linkedin
} from "lucide-react";

const joaoAvatar = "/src/assets/images/avatar.jpg";

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
            onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("ai-mechanics")?.scrollIntoView({ behavior: "smooth" }), 100); }} 
            className="hover:text-[#D97757] transition-colors cursor-pointer"
          >
            SPECIFICATIONS
          </button>
          <button 
            onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" }), 100); }} 
            className="hover:text-[#D97757] transition-colors cursor-pointer"
          >
            OUR ETHOS
          </button>
          <button 
            onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" }), 100); }} 
            className="hover:text-[#D97757] transition-colors cursor-pointer"
          >
            ABOUT
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
                    <span className="text-[10px] font-mono tracking-wider font-semibold text-[#D97757] uppercase">A quiet place for deliberate writing</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-[#141413] leading-[1.08]">
                    Where raw thought becomes <span className="font-serif italic text-[#D97757]">literature.</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-[#141413]/70 font-sans leading-relaxed max-w-xl">
                    Scribe is a local-first digital sanctuary designed for novelists, journalers, and poets. It combines the tactile focus of physical stationery with a restrained, literary sounding board that only speaks when summoned.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={onLaunchApp}
                      className="px-8 py-4 bg-[#D97757] hover:bg-[#c46546] text-white font-serif font-medium rounded-xl text-base shadow-lg shadow-[#D97757]/20 hover:shadow-xl transition-all flex items-center justify-center gap-3.5 cursor-pointer group"
                    >
                      Begin Writing
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => document.getElementById("ai-mechanics")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-6 py-4 bg-transparent hover:bg-[#141413]/5 border border-[#E0D4C1] text-[#141413] font-mono text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      VIEW SPECIFICATIONS
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#E0D4C1]/60 text-xs text-[#141413]/70 font-sans leading-relaxed">
                    <div>
                      <span className="font-serif font-bold text-[#141413] block mb-1 text-sm">0% Data Retention</span>
                      No remote databases, analytics packages, or telemetry logs are included. What you write never leaves your local machine.
                    </div>
                    <div>
                      <span className="font-serif font-bold text-[#141413] block mb-1 text-sm">100% Content Sovereignty</span>
                      Your documents are stored in plaintext format directly in your browser sandbox, fully exportable in one click.
                    </div>
                    <div>
                      <span className="font-serif font-bold text-[#141413] block mb-1 text-sm">Tactile Environment</span>
                      Customizable paper textures, elegant typography, and a physical gramophone player designed to house your local music archives.
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

              {/* Section 1: Restrained, Invoked Intelligence */}
              <section id="ai-mechanics" className="flex flex-col gap-10 pt-16 border-t border-[#E0D4C1]/60">
                <div className="max-w-2xl">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block mb-2">Restrained Intelligence</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">An invoked sounding board, not an ambient co-author.</h2>
                  <p className="text-sm text-[#141413]/60 mt-3 leading-relaxed">
                    Scribe rejects the model of the intrusive writing assistant. We believe artificial intelligence is most honorable when it waits silently, acting as a resonant chamber that mirrors and extends your own thoughts only when explicitly summoned.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-[#FAF9F6]/60 border border-[#E0D4C1]/60 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Invoked, never ambient</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Scribe does not run background analysis, offer autocomplete text, or watch you write. The intelligence remains completely inert until you explicitly type the <span className="font-mono text-[#D97757]">@idea</span> or <span className="font-mono text-[#D97757]">@fix</span> commands.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-[#FAF9F6]/60 border border-[#E0D4C1]/60 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Your own secure key</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      No middleman servers proxy your requests or harvest your data. Scribe uses your personal Google Gemini API key, stored safely in your local browser sandbox and sent directly to Google's developer endpoints.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-[#FAF9F6]/60 border border-[#E0D4C1]/60 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Context-aware continuity</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Typing <span className="font-mono text-[#D97757]">@idea</span> prompts Scribe to read only the preceding paragraph. It analyzes the cadence, themes, and imagery of your current draft to offer deliberate structural trails, helping you step past blocks.
                    </p>
                  </div>

                  {/* Feature 4 */}
                  <div className="bg-[#FAF9F6]/60 border border-[#E0D4C1]/60 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757]">
                      <Feather className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-[#141413]">Voice preservation</h3>
                    <p className="text-xs text-[#141413]/70 leading-relaxed font-sans">
                      Typing <span className="font-mono text-[#D97757]">@fix</span> cleans spelling, punctuation, and awkward phrasing. Unlike corporate checkers, Scribe is configured to preserve your unique stylistic tone rather than homogenizing your prose.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2: Local-First Storage */}
              <section id="local-storage" className="flex flex-col gap-10 pt-16 border-t border-[#E0D4C1]/60">
                <div className="max-w-2xl">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block mb-2">Technical Sovereignty</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight">Local-first, by architectural principle.</h2>
                  <p className="text-sm text-[#141413]/60 mt-3 leading-relaxed">
                    Scribe treats your drafts with absolute sanctity. By implementing a strict local-first technical stack, your writing is permanently isolated from remote observers, server failures, and network connections.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Local 1 */}
                  <div className="border border-[#E0D4C1] p-6 rounded-2xl bg-[#FAF9F6]/40">
                    <h4 className="font-serif font-bold text-base text-[#141413] mb-2">No accounts or servers</h4>
                    <p className="text-xs text-[#141413]/70 leading-relaxed">
                      Scribe has no user registration, email logins, or subscription profiles. There is no remote central server to store your documents, and no account to be compromised. You launch the editor and write immediately.
                    </p>
                  </div>

                  {/* Local 2 */}
                  <div className="border border-[#E0D4C1] p-6 rounded-2xl bg-[#FAF9F6]/40">
                    <h4 className="font-serif font-bold text-base text-[#141413] mb-2">Browser sandbox storage</h4>
                    <p className="text-xs text-[#141413]/70 leading-relaxed">
                      Every document, nested folder, configuration setting, and historical log is written directly to your browser's persistent LocalStorage container. Your creative archives remain physically resting on your device.
                    </p>
                  </div>

                  {/* Local 3 */}
                  <div className="border border-[#E0D4C1] p-6 rounded-2xl bg-[#FAF9F6]/40">
                    <h4 className="font-serif font-bold text-base text-[#141413] mb-2">Complete offline immunity</h4>
                    <p className="text-xs text-[#141413]/70 leading-relaxed">
                      Because the entire software runs on your device, Scribe is fully operational in mountain cabins, trains, and planes. You do not need a network connection to organize your folders, write drafts, or audit edits.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: The Sanctuary (What is removed) */}
              <section id="philosophy" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#141413] text-[#EEEDE9] rounded-3xl p-8 md:p-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D97757]/10 to-transparent pointer-events-none" />
                
                <div className="flex flex-col gap-6 relative z-10">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block">Our Philosophy</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight leading-tight">
                    A sanctuary built on absolute restraint.
                  </h2>
                  <p className="text-sm text-[#EEEDE9]/70 leading-relaxed font-sans">
                    Physical paper offers a clarity that modern document processors have destroyed. Scribe was built to restore that boundaries. We did not build a productivity suite, we built a digital room designed to isolate you from the internet.
                  </p>
                  <p className="text-sm text-[#EEEDE9]/70 leading-relaxed font-sans">
                    By deliberately excluding the features that modern enterprise platforms use to keep you online, Scribe creates a rare clearing where you can simply sit and face your own mind.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onLaunchApp}
                      className="px-5 py-3 bg-[#D97757] hover:bg-[#c46546] text-white font-mono text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                    >
                      ENTER THE SANCTUARY
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 border-l border-[#EEEDE9]/10 pl-6 md:pl-10 relative z-10 py-4 text-xs text-[#EEEDE9]/70">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#EEEDE9] mb-1">No collaboration overhead</h4>
                      <p className="leading-relaxed">
                        No active typing cursors, presence indicators, or shared document links. Your creative room is strictly yours alone.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#EEEDE9] mb-1">No telemetry or analytics</h4>
                      <p className="leading-relaxed">
                        Zero tracker scripts, cookie consents, or behavior metrics. Scribe does not inspect where you write, how fast you write, or how long you stay.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#EEEDE9] mb-1">Zero gamified pressure</h4>
                      <p className="leading-relaxed">
                        No forced daily streaks, progress badges, word goals, or synthetic notification bells. You write when your thoughts require it.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded bg-[#EEEDE9]/10 flex items-center justify-center text-[#D97757] shrink-0">
                      <Disc className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#EEEDE9] mb-1">Sensory stationary craft</h4>
                      <p className="leading-relaxed">
                        A warm off-white palette to reduce eye fatigue, paired with a tactile vinyl gramophone deck to load and listen to your personal audio tracks.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section (Why Scribe stays quiet) */}
              <section id="about-us" className="pt-16 border-t border-[#E0D4C1]/60 flex flex-col md:flex-row gap-12 items-start">
                <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
                  <div className="border border-[#E0D4C1] p-2 bg-[#FAF9F6] rounded-2xl shadow-sm rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
                    <img 
                      src={joaoAvatar} 
                      alt="João Leite, creator of Scribe" 
                      className="w-full h-auto object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center md:text-left flex flex-col gap-2 items-center md:items-start">
                    <div>
                      <span className="font-serif font-bold text-sm text-[#141413] block">João Leite</span>
                      <span className="text-[10px] font-mono text-[#141413]/50 uppercase tracking-wider block">Creator of Scribe</span>
                    </div>
                    <a 
                      href="https://linkedin.com/in/joalx" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141413] hover:bg-[#D97757] text-[#EEEDE9] hover:text-white font-mono text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer w-fit"
                    >
                      <Linkedin className="w-3 h-3 text-[#D97757]" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                <div className="flex-grow flex flex-col gap-6 max-w-2xl text-[#141413]/80">
                  <span className="text-xs font-mono text-[#D97757] tracking-widest uppercase block">Why Scribe stays quiet</span>
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#141413] tracking-tight leading-snug">
                    "I want AI that expands what you can do, not AI that quietly becomes the thing you're actually using."
                  </h3>
                  
                  <div className="font-sans text-xs md:text-sm leading-relaxed flex flex-col gap-5 text-justify">
                    <p>
                      Most nights, after everyone else has logged off, I open Scribe and write for a while. Sometimes it's for Scribe. Sometimes it's just for me. There's a record spinning in the sidebar and nothing else asking for my attention, and for a few minutes that's the whole world. I built it to feel like that. Most days, it does.
                    </p>
                    <p>
                      Almost everyone I respect in this industry is building around AI right now, making it the reason their product exists at all. A lot of them are winning, and I don't think that's the wrong choice for them. It would be an easier story to tell about Scribe too. I've felt that pull. I just haven't taken it.
                    </p>
                    <p>
                      Here's where I've landed instead. Scribe has two AI commands, <span className="font-mono text-[#D97757] bg-[#D97757]/10 px-1.5 py-0.5 rounded">@idea</span> and <span className="font-mono text-[#D97757] bg-[#D97757]/10 px-1.5 py-0.5 rounded">@fix</span>. You only hear from them if you type the @ yourself, with your own key, on your own terms. Everything else about the product, the local storage, the quiet interface, the record player, exists so that AI never has to be the reason you opened it. That's not a limitation I haven't gotten around to fixing. It's the actual point. The day removing AI from Scribe would break the product is the day I've built something else.
                    </p>
                    <p>
                      There's a real difference between AI that expands what you can do and AI that quietly becomes the thing you're actually using. I want the first. I've stopped needing that choice to make me right and everyone building the second thing wrong. It just makes us different.
                    </p>
                    <p>
                      I don't have a clean answer for the weeks growth is slow enough to make me wonder if I'm reading the room correctly. What I have instead is that I use this thing every day, and it gives me something I haven't found anywhere else. Some weeks that has to be enough, because it's what's true.
                    </p>
                    <p>
                      Scribe isn't for everyone. It's for writers, bloggers, and anyone who thinks best with a keyboard in front of them and no feed pulling at the corner of their eye. If it reaches the right few thousand people instead of the wrong few million, that's not a compromise. That's the goal.
                    </p>
                  </div>
                </div>
              </section>

              {/* Call to Action banner */}
              <section className="text-center py-12 flex flex-col items-center gap-6 max-w-2xl mx-auto">
                <span className="w-10 h-px bg-[#E0D4C1] block" />
                <h2 className="text-3xl font-serif font-semibold tracking-tight text-[#141413]">
                  Ready to write in isolation?
                </h2>
                <p className="text-sm text-[#141413]/60 leading-relaxed font-sans">
                  Scribe is available for immediate use inside your browser sandbox. No setup, no remote keys, and no central profiles required.
                </p>
                <button
                  onClick={onLaunchApp}
                  className="px-8 py-4 bg-[#141413] hover:bg-[#D97757] text-[#EEEDE9] hover:text-[#EEEDE9] font-serif font-medium rounded-xl text-base shadow-lg transition-all flex items-center gap-3 cursor-pointer"
                >
                  Enter Scribe Sanctuary
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
            <div className="w-8 h-8 rounded-lg bg-[#D97757] flex items-center justify-center text-white">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-[#EEEDE9] font-medium tracking-wide block">Scribe Sanctuary</span>
              <span className="text-[9px] font-mono tracking-wider block uppercase">CREATIVE SANCTUARY</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-mono text-[10px]">
            <button onClick={() => setActiveTab("landing")} className="hover:text-white transition-colors cursor-pointer">HOME</button>
            <button onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("ai-mechanics")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-white transition-colors cursor-pointer">SPECIFICATIONS</button>
            <button onClick={() => { setActiveTab("landing"); setTimeout(() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="hover:text-white transition-colors cursor-pointer">ABOUT</button>
            <button onClick={() => setActiveTab("terms")} className="hover:text-white transition-colors cursor-pointer">TERMS OF USE</button>
            <button onClick={() => setActiveTab("privacy")} className="hover:text-white transition-colors cursor-pointer">PRIVACY GUARANTEE</button>
          </div>

          <div className="text-[10px] font-mono text-center md:text-right flex flex-col gap-1 items-center md:items-end">
            <div>&copy; 2026 Scribe. Built for absolute author sovereignty.</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
