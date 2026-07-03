import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HistoryItem } from "../types";
import { Clock, Filter, FileText, FolderPlus, Trash2, RefreshCw, AlertCircle, Search } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export default function HistoryPanel({ history, onClearHistory }: HistoryPanelProps) {
  const [filter, setFilter] = useState<"all" | "note" | "folder">("all");
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === "all" || item.itemType === filter;
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) || 
                          item.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIconForType = (type: string, itemType: "note" | "folder") => {
    switch (type) {
      case "create":
        return itemType === "folder" ? (
          <div className="bg-green-500/10 p-2 rounded-full text-green-700">
            <FolderPlus className="w-4 h-4" />
          </div>
        ) : (
          <div className="bg-green-500/10 p-2 rounded-full text-green-700">
            <FileText className="w-4 h-4" />
          </div>
        );
      case "edit":
        return (
          <div className="bg-blue-500/10 p-2 rounded-full text-blue-700">
            <FileText className="w-4 h-4 animate-pulse" />
          </div>
        );
      case "delete":
        return (
          <div className="bg-yellow-500/10 p-2 rounded-full text-yellow-700">
            <Trash2 className="w-4 h-4" />
          </div>
        );
      case "restore":
        return (
          <div className="bg-indigo-500/10 p-2 rounded-full text-indigo-700">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
      case "permanent_delete":
        return (
          <div className="bg-red-500/10 p-2 rounded-full text-red-700">
            <Trash2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="bg-[#E0D4C1]/40 p-2 rounded-full text-[#141413]/70">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
    }
  };

  const getActionLabel = (type: string, itemType: string) => {
    const typeUpper = type.replace("_", " ").toUpperCase();
    const itemUpper = itemType.toUpperCase();
    return `${typeUpper} ${itemUpper}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-8 font-sans transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#141413] dark:text-[#ECEAE4] mb-2 flex items-center gap-2.5">
            <Clock className="w-8 h-8 text-[#D97757]" /> Activity Chronicles
          </h1>
          <p className="text-sm text-[#141413]/60 dark:text-[#ECEAE4]/60">
            A beautiful, quiet record of every word drafted and vessel created in your creative sanctuary.
          </p>
        </div>

        {history.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={onClearHistory}
            className="px-3.5 py-1.5 border border-[#E0D4C1] dark:border-[#33322E] hover:bg-[#E0D4C1] dark:hover:bg-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:text-[#141413] dark:hover:text-[#ECEAE4] transition-all rounded-lg text-xs font-mono cursor-pointer"
          >
            Clear Chronicles
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="border border-dashed border-[#E0D4C1] dark:border-[#33322E] bg-[#EEEDE9]/40 dark:bg-[#252421]/30 p-12 rounded-xl text-center">
          <Clock className="w-12 h-12 text-[#E0D4C1] dark:text-[#33322E] mx-auto mb-4 animate-pulse" />
          <p className="text-base font-serif font-medium text-[#141413]/70 dark:text-[#ECEAE4]/70">The Chronicles are quiet</p>
          <p className="text-xs text-[#141413]/40 dark:text-[#ECEAE4]/40 mt-1">Actions you take on notes and folders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] p-3 rounded-xl shadow-sm">
            {/* Search Input */}
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#141413]/40 dark:text-[#ECEAE4]/40" />
              <input
                id="history-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Chronicles..."
                className="w-full bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#141413] dark:text-[#ECEAE4] focus:outline-none focus:border-[#D97757]"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1 items-center shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#141413]/50 dark:text-[#ECEAE4]/50 mr-1.5" />
              {(["all", "note", "folder"] as const).map((opt) => (
                <button
                  key={opt}
                  id={`btn-filter-history-${opt}`}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-all cursor-pointer ${
                    filter === opt
                      ? "bg-[#D97757] text-white"
                      : "bg-[#EEEDE9] dark:bg-[#1E1E1C] text-[#141413]/60 dark:text-[#ECEAE4]/60 hover:text-[#141413] dark:hover:text-[#ECEAE4] hover:bg-[#E0D4C1]/30 dark:hover:bg-[#33322E]/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {filteredHistory.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#141413]/50 dark:text-[#ECEAE4]/50 italic">No chronicles match your filters.</p>
          ) : (
            <div className="relative border-l-2 border-[#E0D4C1] dark:border-[#33322E] ml-4 pl-6 space-y-6">
              <AnimatePresence initial={false}>
                {filteredHistory.map((item, idx) => {
                  const dateStr = new Date(item.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="relative flex items-start gap-4 group"
                    >
                      {/* Anchor Timeline Icon */}
                      <span className="absolute -left-[35px] top-1.5 bg-[#EEEDE9] dark:bg-[#151514] border border-[#E0D4C1] dark:border-[#33322E] rounded-full z-10 transition-transform group-hover:scale-110">
                        {getIconForType(item.type, item.itemType)}
                      </span>

                      {/* Timeline Card */}
                      <div className="flex-grow bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] hover:border-[#D97757]/30 p-4 rounded-xl shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="text-[10px] font-mono tracking-wider text-[#D97757] uppercase font-bold">
                            {getActionLabel(item.type, item.itemType)}
                          </div>
                          <h3 className="text-sm font-serif font-medium text-[#141413] dark:text-[#ECEAE4] mt-0.5">
                            {item.itemName}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#141413]/40 dark:text-[#ECEAE4]/40 whitespace-nowrap bg-[#E0D4C1]/30 dark:bg-[#33322E]/50 px-2 py-1 rounded">
                          {dateStr}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
