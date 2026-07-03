import { useState, ChangeEvent, DragEvent } from "react";
import { motion } from "motion/react";
import { UserProfile, Folder, Note } from "../types";
import { 
  User, AlignLeft, Cpu, Key, CheckCircle, AlertCircle, RefreshCw, 
  Camera, Database, DownloadCloud, UploadCloud, Sparkles, Check
} from "lucide-react";

interface ProfileSettingsProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onSave: () => void;
  aiUsageCount: number;
  aiUsageResetTime: string | null;
  // New props for backup, restore, and fireworks integration
  folders: Folder[];
  notes: Note[];
  onImportData: (folders: Folder[], notes: Note[]) => void;
  onTriggerFireworks: () => void;
  onShowNotification: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export default function ProfileSettings({ 
  profile, 
  onChange, 
  onSave, 
  aiUsageCount, 
  aiUsageResetTime,
  folders,
  notes,
  onImportData,
  onTriggerFireworks,
  onShowNotification
}: ProfileSettingsProps) {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Drag & drop state managers
  const [isDragOverAvatar, setIsDragOverAvatar] = useState(false);
  const [isDragOverBg, setIsDragOverBg] = useState(false);
  const [isDragOverBackup, setIsDragOverBackup] = useState(false);

  // Avatar file handlers
  const processAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      onShowNotification("Please upload an image file for your profile photo.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ ...profile, avatarUrl: reader.result as string });
      onShowNotification("Profile picture updated!", "success");
      onTriggerFireworks();
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAvatarFile(file);
  };

  const handleAvatarDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverAvatar(true);
  };

  const handleAvatarDragLeave = () => {
    setIsDragOverAvatar(false);
  };

  const handleAvatarDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAvatarFile(file);
  };

  // Background cover file handlers
  const processBgFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      onShowNotification("Please upload an image file for your cover banner.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ ...profile, backgroundUrl: reader.result as string });
      onShowNotification("Cover background updated!", "success");
      onTriggerFireworks();
    };
    reader.readAsDataURL(file);
  };

  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processBgFile(file);
  };

  const handleBgDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverBg(true);
  };

  const handleBgDragLeave = () => {
    setIsDragOverBg(false);
  };

  const handleBgDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverBg(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processBgFile(file);
  };

  // Connectivity checker
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

  // Backup downloader
  const handleBackupData = () => {
    try {
      const backupObj = {
        app: "Scribe Creative Sanctuary",
        exportedAt: new Date().toISOString(),
        folders,
        notes
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `scribe_sanctuary_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onShowNotification("Sanctuary backup created successfully!", "success");
      onTriggerFireworks();
    } catch (err: any) {
      onShowNotification("Unable to generate backup file.", "error");
    }
  };

  // Restore validation and importer
  const processRestoreFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Validation check
        if (!parsed || typeof parsed !== "object") {
          onShowNotification("Invalid backup file format.", "error");
          return;
        }

        const importedFolders = Array.isArray(parsed.folders) ? parsed.folders : [];
        const importedNotes = Array.isArray(parsed.notes) ? parsed.notes : [];

        if (importedFolders.length === 0 && importedNotes.length === 0) {
          onShowNotification("Backup file contains no Scribe folders or notes.", "warning");
          return;
        }

        onImportData(importedFolders, importedNotes);
        onTriggerFireworks();
      } catch (err) {
        onShowNotification("Failed to parse backup. Ensure it is a valid JSON file.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processRestoreFile(file);
  };

  const handleBackupDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverBackup(true);
  };

  const handleBackupDragLeave = () => {
    setIsDragOverBackup(false);
  };

  const handleBackupDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOverBackup(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processRestoreFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-[#141413] dark:text-[#ECEAE4] mb-2">Profile & Sanctuary Settings</h1>
        <p className="text-sm text-[#141413]/60 dark:text-[#ECEAE4]/60 leading-relaxed">
          Configure your writing profile, personalize your sanctuary's visual identity, and preserve your creative work.
        </p>
      </div>

      {/* Visual Identity Social Media Card */}
      <div className="relative mb-8 rounded-xl overflow-hidden border border-[#E0D4C1] dark:border-[#33322E] bg-[#EEEDE9] dark:bg-[#252421] transition-all duration-300 shadow-sm">
        {/* Banner cover with drag-and-drop */}
        <div 
          onDragOver={handleBgDragOver}
          onDragLeave={handleBgDragLeave}
          onDrop={handleBgDrop}
          className={`h-40 w-full relative overflow-hidden flex items-center justify-center transition-all ${
            isDragOverBg 
              ? "bg-[#D97757]/20 border-2 border-dashed border-[#D97757]" 
              : "bg-gradient-to-r from-[#D97757]/10 to-[#E0D4C1]/20"
          }`}
        >
          {profile.backgroundUrl ? (
            <img 
              src={profile.backgroundUrl} 
              alt="Sanctuary Cover" 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#141413]/30 dark:text-[#ECEAE4]/30 font-serif italic text-sm">
              <span>Drag & drop cover banner image here...</span>
            </div>
          )}

          {isDragOverBg && (
            <div className="absolute inset-0 bg-[#D97757]/15 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-[#D97757] font-semibold">
              Drop image to set cover
            </div>
          )}

          {/* Cover upload anchor */}
          <label className="absolute right-3 bottom-3 p-1.5 bg-[#141413]/75 hover:bg-[#141413]/90 text-[#EEEDE9] rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all border border-[#EEEDE9]/10 shadow-lg">
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Cover</span>
            <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
          </label>
        </div>

        {/* Profile Avatar overlapping cover */}
        <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="absolute -top-12 left-6">
            <div 
              onDragOver={handleAvatarDragOver}
              onDragLeave={handleAvatarDragLeave}
              onDrop={handleAvatarDrop}
              className={`relative group rounded-full overflow-hidden border-4 border-[#EEEDE9] dark:border-[#252421] shadow-md transition-all ${
                isDragOverAvatar ? "ring-4 ring-[#D97757]/50" : ""
              }`}
            >
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt="Sanctuary Portrait" 
                  className="w-24 h-24 object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 bg-[#E0D4C1] dark:bg-[#1C1C1A] text-[#D97757] flex items-center justify-center text-3xl font-serif font-bold">
                  {profile.name ? profile.name[0].toUpperCase() : "S"}
                </div>
              )}

              {/* Mask overlay for uploads and drag state */}
              <label className="absolute inset-0 bg-[#141413]/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-mono gap-1 select-none">
                <Camera className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>

              {isDragOverAvatar && (
                <div className="absolute inset-0 bg-[#D97757]/80 rounded-full flex items-center justify-center text-[10px] font-mono text-white">
                  Drop Here
                </div>
              )}
            </div>
          </div>

          <div className="sm:pl-28">
            <h2 className="text-xl font-serif font-bold text-[#141413] dark:text-[#ECEAE4] flex items-center gap-1.5">
              {profile.name || "Scribe Quill"}
            </h2>
            <p className="text-xs text-[#141413]/60 dark:text-[#ECEAE4]/60 italic font-sans max-w-sm mt-0.5">
              {profile.bio || "drafting reflections on memory, beauty, and silence."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] p-6 rounded-xl shadow-sm transition-colors duration-300">
        {/* User Profile Info Fields */}
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
        <div className="pb-6 border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80">
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

                  {/* Elegant progress bar */}
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

        {/* Sanctuary Data Preservation: Backup & Restore */}
        <div>
          <h2 className="text-base font-serif font-medium text-[#141413] dark:text-[#ECEAE4] mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#D97757]" /> Data Preservation & Recovery
          </h2>
          <p className="text-xs text-[#141413]/60 dark:text-[#ECEAE4]/60 mb-4 leading-relaxed">
            Protect your literary sanctuary. Download copies of your drafts and folder structures, or drop a previous backup file to restore them instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup Box */}
            <div className="border border-[#E0D4C1] dark:border-[#33322E] bg-[#E0D4C1]/20 dark:bg-[#1C1C1A]/40 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#D97757] mb-1 font-semibold flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4" /> Export Sanctuary
                </h3>
                <p className="text-[11px] text-[#141413]/55 dark:text-[#ECEAE4]/55 leading-relaxed">
                  Creates an offline, self-contained backup file (`.json`) containing all your folders and notes. Perfect for offline archiving.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#141413]/40 dark:text-[#ECEAE4]/40 bg-[#E0D4C1]/30 dark:bg-[#141413]/30 p-2 rounded">
                  Contains: {folders.length} folders, {notes.length} drafts
                </div>
              </div>
              <button
                id="btn-backup-data"
                onClick={handleBackupData}
                className="mt-4 w-full py-2 bg-[#D97757] hover:bg-[#c46546] text-white rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <DownloadCloud className="w-4 h-4" /> Create Cozy Backup
              </button>
            </div>

            {/* Restore Box */}
            <div 
              onDragOver={handleBackupDragOver}
              onDragLeave={handleBackupDragLeave}
              onDrop={handleBackupDrop}
              className={`border p-4 rounded-xl flex flex-col justify-between transition-all ${
                isDragOverBackup 
                  ? "border-[#D97757] bg-[#D97757]/10" 
                  : "border-[#E0D4C1] dark:border-[#33322E] bg-[#E0D4C1]/20 dark:bg-[#1C1C1A]/40"
              }`}
            >
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#D97757] mb-1 font-semibold flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" /> Import Recovery
                </h3>
                <p className="text-[11px] text-[#141413]/55 dark:text-[#ECEAE4]/55 leading-relaxed mb-3">
                  Upload or drop your Scribe backup file to completely restore your settings, folders, and notebooks.
                </p>
              </div>

              {/* Drag and drop zone with file picker */}
              <label className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                isDragOverBackup 
                  ? "border-[#D97757] bg-[#D97757]/5 text-[#D97757]" 
                  : "border-[#E0D4C1]/60 dark:border-[#33322E]/80 hover:border-[#D97757]/50 text-[#141413]/60 dark:text-[#ECEAE4]/60"
              }`}>
                <UploadCloud className="w-5 h-5 text-[#D97757]" />
                <span className="text-[10px] font-mono">
                  {isDragOverBackup ? "Drop to Import!" : "Click or Drop JSON Backup"}
                </span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleRestoreChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
