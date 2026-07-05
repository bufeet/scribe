import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Folder, FileText, ChevronRight, Sparkles, AlertTriangle } from "lucide-react";
import { Folder as FolderType, Note as NoteType } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  notes: NoteType[];
  folders: FolderType[];
  onSelectNote: (noteId: string, highlightQuery?: string) => void;
  onSelectView: (view: "editor" | "history" | "trash" | "settings") => void;
  language: "en" | "zh";
}

export default function SearchModal({
  isOpen,
  onClose,
  query,
  notes,
  folders,
  onSelectNote,
  onSelectView,
  language,
}: SearchModalProps) {
  // Perform search matching
  const lowercaseQuery = query.toLowerCase().trim();

  // Active (non-deleted) items
  const activeFolders = folders.filter((f) => f.deletedAt === null);
  const activeNotes = notes.filter((n) => n.deletedAt === null);

  const matchedNotes = lowercaseQuery
    ? activeNotes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(lowercaseQuery)) ||
          (n.content && n.content.toLowerCase().includes(lowercaseQuery))
      )
    : [];

  const matchedFolders = lowercaseQuery
    ? activeFolders.filter((f) => f.name && f.name.toLowerCase().includes(lowercaseQuery))
    : [];

  const totalMatches = matchedNotes.length + matchedFolders.length;
  const isFound = totalMatches > 0;

  // Helper to get folder path/name
  const getFolderLocation = (folderId: string | null) => {
    if (!folderId) return language === "en" ? "Standalone Note" : "独立笔记";
    const folder = folders.find((f) => f.id === folderId);
    return folder ? folder.name : (language === "en" ? "Unknown Folder" : "未知文件夹");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Slightly blurred and darkened backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0c0c0b]/50 dark:bg-[#000000]/70 backdrop-blur-[6px]"
          />

          {/* Card-style Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E0D4C1] dark:border-[#33322E] rounded-3xl shadow-2xl p-6 overflow-hidden z-10 transition-colors duration-300 flex flex-col max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#141413]/40 dark:text-[#ECEAE4]/40 hover:bg-[#EEEDE9] dark:hover:bg-[#252421] hover:text-[#141413] dark:hover:text-[#ECEAE4] transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animation Block: Hoot the Search Owl */}
            <div className="flex flex-col items-center justify-center mb-4 pt-2 shrink-0">
              {isFound ? (
                /* Stage: Found */
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Glowing background halo */}
                  <motion.div
                    className="absolute w-24 h-24 rounded-full bg-amber-400/10 dark:bg-[#D97757]/10"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                  
                  {/* Custom SVG Owl Detective */}
                  <motion.svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    {/* Owl Ears / Horns */}
                    <path d="M25 35 L15 15 L35 25 Z" fill="#D97757" />
                    <path d="M75 35 L85 15 L65 25 Z" fill="#D97757" />

                    {/* Owl Body */}
                    <rect x="25" y="25" width="50" height="55" rx="25" fill="#E0D4C1" stroke="#D97757" strokeWidth="3" />
                    {/* Inner Tummy */}
                    <path d="M35 55 Q50 45 65 55 Q50 75 35 55 Z" fill="#FAF9F5" stroke="#D97757" strokeWidth="2" />

                    {/* Detective Deerstalker Hat */}
                    <path d="M30 25 C30 10, 70 10, 70 25 Z" fill="#A78BFA" stroke="#D97757" strokeWidth="2" />
                    <path d="M25 24 L75 24" stroke="#D97757" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Giant sparkling eyes */}
                    <circle cx="38" cy="42" r="10" fill="#141413" />
                    <circle cx="62" cy="42" r="10" fill="#141413" />
                    {/* Sparkles */}
                    <motion.circle
                      cx="41"
                      cy="39"
                      r="3"
                      fill="#FAF9F5"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="65"
                      cy="39"
                      r="3"
                      fill="#FAF9F5"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    />
                    
                    {/* Happy blushing cheeks */}
                    <circle cx="28" cy="50" r="3" fill="#F43F5E" opacity="0.6" />
                    <circle cx="72" cy="50" r="3" fill="#F43F5E" opacity="0.6" />

                    {/* Cute beak */}
                    <polygon points="50,44 46,50 54,50" fill="#F59E0B" stroke="#D97757" strokeWidth="1.5" />

                    {/* Golden magnifying glass waving happily */}
                    <motion.g
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      style={{ transformOrigin: "20px 65px" }}
                    >
                      {/* Left wing holding it */}
                      <path d="M15 55 Q8 62 18 68 Z" fill="#D97757" />
                      {/* Glass handle */}
                      <line x1="14" y1="62" x2="6" y2="72" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                      {/* Glass frame */}
                      <circle cx="22" cy="54" r="9" fill="#93C5FD" opacity="0.6" stroke="#F59E0B" strokeWidth="3" />
                      {/* Sparkle on glass */}
                      <line x1="20" y1="50" x2="24" y2="58" stroke="#FAF9F5" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.g>

                    {/* Right wing waving */}
                    <motion.path
                      d="M85 55 Q92 48 82 42 Z"
                      fill="#D97757"
                      animate={{ rotate: [0, -25, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      style={{ transformOrigin: "80px 55px" }}
                    />
                  </motion.svg>

                  {/* Sparkles rising around */}
                  <div className="absolute top-0 flex gap-12 justify-between w-full pointer-events-none">
                    <motion.span
                      animate={{ y: [20, -10], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                      className="text-amber-400 text-xs"
                    >
                      ✦
                    </motion.span>
                    <motion.span
                      animate={{ y: [30, 0], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.5 }}
                      className="text-amber-500 text-sm"
                    >
                      ★
                    </motion.span>
                  </div>
                </div>
              ) : (
                /* Stage: Empty / Confused */
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Confused Floating Question Marks */}
                  <motion.div
                    className="absolute top-2 left-6 text-purple-400 font-mono text-lg font-bold"
                    animate={{ y: [10, -5], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  >
                    ?
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-6 text-purple-400 font-mono text-base font-bold"
                    animate={{ y: [8, -7], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.7 }}
                  >
                    ?
                  </motion.div>

                  {/* Custom SVG Owl looking around confused */}
                  <motion.svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    {/* Owl Ears / Horns - slightly drooped */}
                    <path d="M25 35 L12 20 L32 27 Z" fill="#9CA3AF" />
                    <path d="M75 35 L88 20 L68 27 Z" fill="#9CA3AF" />

                    {/* Owl Body in Greyish/Slate for confused state */}
                    <rect x="25" y="25" width="50" height="55" rx="25" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" />
                    <path d="M35 55 Q50 48 65 55 Q50 75 35 55 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />

                    {/* Eyes - looking askance / swiveling */}
                    <circle cx="38" cy="44" r="9" fill="#4B5563" />
                    <circle cx="62" cy="44" r="9" fill="#4B5563" />
                    
                    {/* Confused Pupils looking inwards */}
                    <motion.circle
                      cx="41"
                      cy="44"
                      r="3.5"
                      fill="#FAF9F5"
                      animate={{ cx: [41, 39, 41] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="59"
                      cy="44"
                      r="3.5"
                      fill="#FAF9F5"
                      animate={{ cx: [59, 61, 59] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* Beak */}
                    <polygon points="50,47 46,53 54,53" fill="#F59E0B" stroke="#9CA3AF" strokeWidth="1.5" />

                    {/* Scratching head wing */}
                    <motion.g
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      style={{ transformOrigin: "20px 45px" }}
                    >
                      <path d="M15 45 Q5 42 12 34 Z" fill="#9CA3AF" />
                    </motion.g>

                    {/* Wing holding magnifying glass pointed downwards */}
                    <path d="M85 55 Q92 59 82 66 Z" fill="#9CA3AF" />
                    <line x1="86" y1="58" x2="94" y2="68" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="80" cy="52" r="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
                  </motion.svg>
                </div>
              )}

              {/* Status Header */}
              <div className="text-center mt-2 px-4">
                <h2 className="text-lg font-serif font-bold text-[#141413] dark:text-[#ECEAE4] leading-snug">
                  {isFound ? (
                    language === "en" ? (
                      totalMatches === 1 ? (
                        "We found your file!"
                      ) : (
                        `We found ${totalMatches} matches!`
                      )
                    ) : totalMatches === 1 ? (
                      "我们找到了您的文件！"
                    ) : (
                      `我们找到了 ${totalMatches} 个匹配项！`
                    )
                  ) : language === "en" ? (
                    "No matches discovered..."
                  ) : (
                    "未能寻到任何匹配..."
                  )}
                </h2>
                <p className="text-xs text-[#141413]/60 dark:text-[#ECEAE4]/60 mt-1">
                  {isFound
                    ? language === "en"
                      ? "Direct passages from your creative mind are listed below:"
                      : "以下是与您的思绪产生共鸣的文件："
                    : language === "en"
                    ? `We searched everywhere for "${query}" but found empty shelves.`
                    : `我们翻遍了所有角落以寻找“${query}”，却只看到空空的橱柜。`}
                </p>
              </div>
            </div>

            {/* Matches Content List */}
            {isFound ? (
              <div className="flex-grow overflow-y-auto px-1 py-2 space-y-2 border-t border-[#E0D4C1]/40 dark:border-[#33322E]/50 pr-1 max-h-[35vh] custom-scrollbar">
                {/* Matched Notes */}
                {matchedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectView("editor");
                      onSelectNote(note.id, query);
                      onClose();
                    }}
                    className="w-full text-left bg-[#EEEDE9]/40 hover:bg-[#EEEDE9]/80 dark:bg-[#252421]/30 dark:hover:bg-[#252421]/70 border border-[#E0D4C1]/30 dark:border-[#33322E]/30 rounded-xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer hover:translate-x-1 duration-150"
                  >
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#D97757] shrink-0" />
                        <span className="text-xs font-serif font-bold text-[#141413] dark:text-[#ECEAE4] truncate">
                          {note.title || (language === "en" ? "Untitled Note" : "无标题笔记")}
                        </span>
                      </div>
                      
                      {/* snippet of match */}
                      {note.content && (
                        <p className="text-[10px] text-[#141413]/50 dark:text-[#ECEAE4]/50 mt-1 line-clamp-1 font-mono">
                          {note.content.substring(
                            Math.max(0, note.content.toLowerCase().indexOf(lowercaseQuery) - 15),
                            Math.max(0, note.content.toLowerCase().indexOf(lowercaseQuery) - 15) + 60
                          )}
                          ...
                        </p>
                      )}
                    </div>
                    
                    {/* Location Badge */}
                    <span className="text-[9px] font-mono font-semibold text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded-full shrink-0 max-w-[100px] truncate">
                      {getFolderLocation(note.folderId)}
                    </span>
                  </button>
                ))}

                {/* Matched Folders */}
                {matchedFolders.map((folder) => (
                  <button
                    key={folder.id}
                    className="w-full text-left bg-[#E0D4C1]/10 hover:bg-[#E0D4C1]/20 dark:bg-[#33322E]/10 dark:hover:bg-[#33322E]/20 border border-[#E0D4C1]/20 dark:border-[#33322E]/20 rounded-xl p-3 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="min-w-0 flex flex-grow items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-serif font-bold text-[#141413] dark:text-[#ECEAE4] truncate">
                        {folder.name}
                      </span>
                    </div>
                    
                    {/* Parent Location Badge */}
                    <span className="text-[9px] font-mono font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                      {folder.parentId ? (
                        language === "en" ? "Nested Folder" : "嵌套文件夹"
                      ) : (
                        language === "en" ? "Root Folder" : "根文件夹"
                      )}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              /* No Matches: Action guidance */
              <div className="p-4 rounded-2xl bg-[#EEEDE9]/30 dark:bg-[#252421]/30 border border-[#E0D4C1]/30 dark:border-[#33322E]/30 flex gap-3 items-start shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#D97757] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-[#141413] dark:text-[#ECEAE4]">
                    {language === "en" ? "Looking for something else?" : "在寻找其他内容吗？"}
                  </span>
                  <p className="text-[#141413]/70 dark:text-[#ECEAE4]/70 leading-relaxed text-[11px]">
                    {language === "en"
                      ? "Double-check your spelling, or verify if the note wasn't accidentally discarded into the Vessel Trash."
                      : "请检查拼写，或者前往「废纸篓」查看该笔记是否已被丢弃。"}
                  </p>
                </div>
              </div>
            )}

            {/* Footer Details */}
            <div className="text-[10px] font-mono text-[#141413]/40 dark:text-[#ECEAE4]/40 text-center mt-4 border-t border-[#E0D4C1]/30 dark:border-[#33322E]/30 pt-3 shrink-0">
              {language === "en"
                ? "Scribe Seeker • Press ESC to exit"
                : "墨客寻迹 • 按 ESC 键关闭"}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
