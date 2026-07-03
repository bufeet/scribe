import { useState } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { User, AlignLeft, Cpu, Key, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ProfileSettingsProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onSave: () => void;
  aiUsageCount: number;
  aiUsageResetTime: string | null;
}

export default function ProfileSettings({ profile, onChange, onSave, aiUsageCount, aiUsageResetTime }: ProfileSettingsProps) {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnectivity = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: profile.aiModel,
          apiKey: profile.apiKey,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.message || "Connection failed. Please check your credentials." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Failed to make connectivity check." });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-[#141413] dark:text-[#ECEAE4] mb-2">Profile & Sanctuary Settings</h1>
        <p className="text-sm text-[#141413]/60 dark:text-[#ECEAE4]/60 leading-relaxed">
          Configure your writing profile and connect your creative sounding board. We default to Gemini (which works instantly out-of-the-box), but you can connect other models to suit your style.
        </p>
      </div>

      <div className="space-y-6 bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] p-6 rounded-xl shadow-sm transition-colors duration-300">
        {/* User Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80">
          <div>
            <label className="block text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D97757]" /> Pen Name / Identity
            </label>
            <input
              id="settings-name"
              type="text"
              value={profile.name}
              onChange={(e) => onChange({ ...profile, name: e.target.value })}
              placeholder="e.g. Samuel Coleridge"
              className="w-full bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#ECEAE4] focus:outline-none focus:border-[#D97757] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-[#D97757]" /> Creator Bio
            </label>
            <input
              id="settings-bio"
              type="text"
              value={profile.bio}
              onChange={(e) => onChange({ ...profile, bio: e.target.value })}
              placeholder="A soul exploring the limits of prose..."
              className="w-full bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#ECEAE4] focus:outline-none focus:border-[#D97757] transition-colors"
            />
          </div>
        </div>

        {/* AI Sounding Board Config */}
        <div>
          <h2 className="text-base font-serif font-medium text-[#141413] dark:text-[#ECEAE4] mb-4">Sounding Board Engine</h2>
          <div className="space-y-4">
            {/* Select Model */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#D97757]" /> Selected Brain
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["gemini", "claude", "openai"] as const).map((m) => (
                  <button
                    key={m}
                    id={`btn-model-${m}`}
                    type="button"
                    onClick={() => onChange({ ...profile, aiModel: m })}
                    className={`px-4 py-2.5 rounded-lg border text-xs font-medium uppercase tracking-wider transition-all duration-200 text-center cursor-pointer ${
                      profile.aiModel === m
                        ? "bg-[#D97757] text-white border-[#D97757] shadow-sm"
                        : "bg-[#EEEDE9] dark:bg-[#1E1E1C] border-[#E0D4C1] dark:border-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:bg-[#E0D4C1]/40 dark:hover:bg-[#33322E]/40"
                    }`}
                  >
                    {m === "gemini" ? "Gemini (Default)" : m === "claude" ? "Claude" : "OpenAI"}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom API Key */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#D97757]" /> Custom API Key (Optional for Gemini)
                </label>
                {profile.aiModel === "gemini" && (
                  <span className="text-[10px] font-mono text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded">
                    Active System Key Found
                  </span>
                )}
              </div>
              <input
                id="settings-apikey"
                type="password"
                value={profile.apiKey}
                onChange={(e) => onChange({ ...profile, apiKey: e.target.value })}
                placeholder={
                  profile.aiModel === "gemini"
                    ? "Leave blank to use the secure server-provided default..."
                    : `Enter your ${profile.aiModel === "claude" ? "Anthropic Claude" : "OpenAI"} API Key...`
                }
                className="w-full bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-3 py-2 text-sm font-mono text-[#141413] dark:text-[#ECEAE4] focus:outline-none focus:border-[#D97757] transition-colors"
              />
            </div>

            {/* AI Hourly Usage Limit Section */}
            <div className="pt-4 border-t border-[#E0D4C1]/60 dark:border-[#33322E]/80">
              <h3 className="text-sm font-serif font-medium text-[#141413] dark:text-[#ECEAE4] mb-3">AI Sounding Board Rates & Limit</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase mb-2 flex items-center gap-1.5">
                    AI Hourly Usage Limit
                  </label>
                  <input
                    id="settings-ai-limit"
                    type="number"
                    min="1"
                    max="100"
                    value={profile.aiUsageLimit ?? 10}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onChange({ ...profile, aiUsageLimit: isNaN(val) ? 10 : val });
                    }}
                    className="w-full bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#ECEAE4] focus:outline-none focus:border-[#D97757] transition-colors"
                  />
                  <p className="text-[10px] text-[#141413]/50 dark:text-[#ECEAE4]/50 mt-1 font-mono">
                    The sounding board is restricted to this many queries per hour to maintain writing rhythm.
                  </p>
                </div>

                <div className="bg-[#E0D4C1]/30 dark:bg-[#1C1C1A]/50 p-3 rounded-lg border border-[#E0D4C1]/50 dark:border-[#33322E] flex flex-col justify-between">
                  <span className="text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase mb-1">
                    Current Usage Rate
                  </span>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-lg font-serif font-bold text-[#141413] dark:text-[#ECEAE4]">
                      {aiUsageCount} / {profile.aiUsageLimit ?? 10}
                    </span>
                    <span className="text-[10px] font-mono text-[#D97757]">
                      {aiUsageResetTime ? (() => {
                        const mins = Math.ceil((new Date(aiUsageResetTime).getTime() - Date.now()) / 60000);
                        return mins > 0 ? `Resets in ~${mins}m` : "Ready to reset";
                      })() : "No active cycle"}
                    </span>
                  </div>

                  {/* Elegant micro progress bar */}
                  <div className="w-full h-1.5 bg-[#E0D4C1]/50 dark:bg-[#33322E] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D97757] transition-all duration-300"
                      style={{ width: `${Math.min(100, (aiUsageCount / (profile.aiUsageLimit ?? 10)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Verification actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 items-stretch sm:items-center">
              <button
                id="btn-verify-connection"
                type="button"
                onClick={testConnectivity}
                disabled={testingConnection}
                className="px-4 py-2 rounded-lg border border-[#D97757] text-[#D97757] hover:bg-[#D97757] hover:text-white transition-all text-xs font-mono flex items-center justify-center gap-1.5 disabled:opacity-55 cursor-pointer"
              >
                {testingConnection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Connection...
                  </>
                ) : (
                  "Verify Model Connection"
                )}
              </button>

              <button
                id="btn-save-profile"
                type="button"
                onClick={onSave}
                className="px-5 py-2 rounded-lg bg-[#D97757] text-white hover:bg-[#c46546] transition-all text-xs font-mono shadow-md flex items-center justify-center cursor-pointer"
              >
                Save Preferences
              </button>
            </div>

            {/* Test results indicator */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                  testResult.success
                    ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300"
                    : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{testResult.success ? "Connection Success" : "Connection Error"}</div>
                  <div className="opacity-90">{testResult.message}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
