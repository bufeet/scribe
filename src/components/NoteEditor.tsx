import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { Note, UserProfile } from "../types";
import { 
  Sparkles, Check, RefreshCw, HelpCircle, FileText, 
  Calendar, Compass, Feather, Download, ChevronDown,
  Bold, Italic, Underline, Link, List, ListOrdered
} from "lucide-react";

interface NoteEditorProps {
  note: Note;
  profile: UserProfile;
  onUpdateNote: (updated: Note) => void;
  onAddHistory: (itemType: "note" | "folder", itemName: string, type: "create" | "edit" | "delete" | "restore" | "permanent_delete") => void;
  onCheckAndIncrementUsage: () => boolean;
}

export default function NoteEditor({ note, profile, onUpdateNote, onAddHistory, onCheckAndIncrementUsage }: NoteEditorProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [editorFocused, setEditorFocused] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export as Plain Text (.txt)
  const handleExportTxt = () => {
    const text = `${note.title || "Untitled Note"}\n\n${note.content}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (note.title || "Untitled Note").trim().toLowerCase().replace(/\s+/g, "_") + ".txt";
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export as Markdown (.md)
  const handleExportMd = () => {
    const markdown = `# ${note.title || "Untitled Note"}\n\n${note.content}`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (note.title || "Untitled Note").trim().toLowerCase().replace(/\s+/g, "_") + ".md";
    link.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export as PDF with repeating watermark (.pdf)
  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Draw header border
    doc.setDrawColor(217, 119, 87); // Terracotta
    doc.setLineWidth(0.5);
    doc.line(15, 20, 195, 20);

    // App name header indicator
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(150, 140, 130);
    doc.text("SCRIBE SANCTUARY WRITING", 195, 15, { align: "right" });

    // Note Title
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 19); // Scribe Charcoal
    const wrappedTitle = doc.splitTextToSize(note.title || "Untitled Writing", 170);
    doc.text(wrappedTitle, 15, 30);

    // Generation metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 115, 110);
    doc.text(`Generated via Scribe on ${new Date().toLocaleDateString()}`, 15, 42);

    // Divider line
    doc.setDrawColor(224, 212, 193); // Beige
    doc.setLineWidth(0.25);
    doc.line(15, 46, 195, 46);

    // Note Content
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 28);
    const contentLines = doc.splitTextToSize(note.content || "Begin typing immediately...", 170);

    let currentY = 54;
    const lineSpacing = 6.2;
    const bottomMargin = 22;

    for (let i = 0; i < contentLines.length; i++) {
      if (currentY > pageHeight - bottomMargin) {
        doc.addPage();
        
        // Header border for next pages
        doc.setDrawColor(217, 119, 87);
        doc.setLineWidth(0.5);
        doc.line(15, 20, 195, 20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(150, 140, 130);
        doc.text("SCRIBE SANCTUARY WRITING", 195, 15, { align: "right" });

        currentY = 30;
      }

      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 28);
      doc.text(contentLines[i], 15, currentY);
      currentY += lineSpacing;
    }

    // Footers across all pages
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(160, 155, 150);
      doc.text(`Page ${p} of ${pageCount}`, 195, 287, { align: "right" });
      doc.text("Scribe — Generated with Scribe App", 15, 287);
    }

    const filename = (note.title || "Untitled Note").trim().toLowerCase().replace(/\s+/g, "_") + ".pdf";
    doc.save(filename);
    setShowExportMenu(false);
  };

  // Focus the editor when note changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [note.id]);

  // Handle checking for tags as the user types
  const handleContentChange = (newContent: string) => {
    // Basic change updates the parent
    onUpdateNote({
      ...note,
      content: newContent,
      updatedAt: new Date().toISOString(),
    });

    // Check for @idea or @fix tags
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Let's implement a small delay to make it smooth (debounce)
    timeoutRef.current = setTimeout(() => {
      checkForAiTags(newContent);
    }, 1200); // 1.2 seconds of silence triggers the AI complete! Very natural writing flow.
  };

  const splitAtFirstUnquotedTag = (text: string, tag: string): [string, string] | null => {
    let index = text.indexOf(tag);
    while (index !== -1) {
      const beforeChar = index > 0 ? text[index - 1] : "";
      const afterChar = index + tag.length < text.length ? text[index + tag.length] : "";
      
      const isPrecededByQuote = beforeChar === '"' || beforeChar === '“';
      const isFollowedByQuote = afterChar === '"' || afterChar === '”';
      
      if (!(isPrecededByQuote && isFollowedByQuote)) {
        const preceding = text.substring(0, index);
        const trailing = text.substring(index + tag.length);
        return [preceding, trailing];
      }
      index = text.indexOf(tag, index + 1);
    }
    return null;
  };

  const checkForAiTags = async (content: string) => {
    // 1. Check for unquoted @idea
    const ideaSplit = splitAtFirstUnquotedTag(content, "@idea");
    if (ideaSplit) {
      const [preceding] = ideaSplit;
      triggerAiCompletion("@idea", preceding, "");
      return;
    }

    // 2. Check for unquoted @fix
    const fixSplit = splitAtFirstUnquotedTag(content, "@fix");
    if (fixSplit) {
      const [preceding, trailing] = fixSplit;
      triggerAiCompletion("@fix", preceding, trailing);
      return;
    }
  };

  const triggerAiCompletion = async (tag: "@idea" | "@fix", precedingText: string, trailingText: string) => {
    // Enforce usage limits first
    const isAllowed = onCheckAndIncrementUsage();
    if (!isAllowed) {
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          precedingText,
          tag,
          model: profile.aiModel,
          apiKey: profile.apiKey,
          trailingText: trailingText.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.completion) {
        const aiResponse = data.completion;
        
        let finalContent = "";
        if (tag === "@idea") {
          // Replace "@idea" with the AI completion text
          finalContent = precedingText + aiResponse;
        } else if (tag === "@fix") {
          if (trailingText.trim() === "") {
            // Send preceding content to be corrected, and replace the whole note with corrected text
            finalContent = aiResponse;
          } else {
            // Replace the @fix text and subsequent trailing text with the corrected text
            finalContent = precedingText + aiResponse;
          }
        }

        onUpdateNote({
          ...note,
          content: finalContent,
          updatedAt: new Date().toISOString(),
        });

        onAddHistory("note", note.title || "Untitled Writing", "edit");
      } else {
        setAiError(data.error || "Could not contact Scribe's literary board.");
      }
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred during AI completion.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Explicit helper triggers
  const forceTriggerIdea = () => {
    const currentVal = textareaRef.current?.value || "";
    triggerAiCompletion("@idea", currentVal, "");
  };

  const forceTriggerFix = () => {
    const currentVal = textareaRef.current?.value || "";
    // If selecting some text or just correcting everything, let's treat the whole text as trailing
    triggerAiCompletion("@fix", "", currentVal);
  };

  const applyFormatting = (format: "bold" | "italic" | "underline" | "link" | "ul" | "ol") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let formatted = "";
    let cursorOffsetStart = 0;
    let cursorOffsetEnd = 0;

    switch (format) {
      case "bold":
        formatted = `**${selectedText || "bold text"}**`;
        cursorOffsetStart = selectedText ? 0 : 2;
        cursorOffsetEnd = selectedText ? 0 : -2;
        break;
      case "italic":
        formatted = `*${selectedText || "italic text"}*`;
        cursorOffsetStart = selectedText ? 0 : 1;
        cursorOffsetEnd = selectedText ? 0 : -1;
        break;
      case "underline":
        formatted = `<u>${selectedText || "underlined text"}</u>`;
        cursorOffsetStart = selectedText ? 0 : 3;
        cursorOffsetEnd = selectedText ? 0 : -4;
        break;
      case "link":
        const url = prompt("Enter the URL:", "https://");
        if (url === null) return; // user cancelled prompt
        formatted = `[${selectedText || "link text"}](${url})`;
        cursorOffsetStart = selectedText ? 0 : 1;
        cursorOffsetEnd = selectedText ? 0 : -1;
        break;
      case "ul":
        if (selectedText) {
          formatted = selectedText
            .split("\n")
            .map(line => line.startsWith("- ") ? line : `- ${line}`)
            .join("\n");
        } else {
          formatted = "- List item";
        }
        break;
      case "ol":
        if (selectedText) {
          formatted = selectedText
            .split("\n")
            .map((line, idx) => {
              const prefix = `${idx + 1}. `;
              return line.match(/^\d+\.\s/) ? line : `${prefix}${line}`;
            })
            .join("\n");
        } else {
          formatted = "1. List item";
        }
        break;
    }

    const newContent = text.substring(0, start) + formatted + text.substring(end);
    handleContentChange(newContent);

    // Refocus and place selection elegantly
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + formatted.length);
      } else {
        const newCursorPos = start + formatted.length + cursorOffsetEnd;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans h-full flex flex-col transition-colors duration-300">
      {/* Note Header Info */}
      <div className="flex flex-wrap justify-between items-center border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80 pb-4 mb-6 gap-2">
        <div className="flex items-center gap-2.5 text-[#141413]/50 dark:text-[#ECEAE4]/50 text-xs font-mono">
          <FileText className="w-4 h-4 text-[#D97757]" />
          <span>Note Workspace</span>
          <span>•</span>
          <Calendar className="w-3.5 h-3.5" />
          <span>Last modified: {formatDate(note.updatedAt)}</span>
        </div>

        {/* Actions (AI Badge + Export Dropdown) */}
        <div className="flex items-center gap-3">
          {/* AI Model Badge */}
          <div className="flex items-center gap-1.5 text-xs bg-[#D97757]/10 text-[#D97757] px-2.5 py-1 rounded-full font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engine: {profile.aiModel === "gemini" ? "Gemini (System)" : profile.aiModel === "claude" ? "Claude" : "OpenAI"}</span>
          </div>

          {/* Export Dropdown Menu */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              id="btn-export-dropdown-toggle"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 text-xs bg-[#EEEDE9] hover:bg-[#E0D4C1] dark:bg-[#252421] dark:hover:bg-[#33322E] text-[#141413]/80 hover:text-[#141413] dark:text-[#ECEAE4]/80 dark:hover:text-[#ECEAE4] px-3 py-1 rounded-lg border border-[#E0D4C1] dark:border-[#33322E] font-mono transition-all cursor-pointer shadow-sm animate-none"
              title="Export Note to standard formats"
            >
              <Download className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-[#141413]/50 dark:text-[#ECEAE4]/50" />
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-1.5 w-48 bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] rounded-xl shadow-xl z-40 overflow-hidden font-mono text-xs text-[#141413] dark:text-[#ECEAE4] py-1"
                >
                  <button
                    id="btn-export-txt"
                    onClick={handleExportTxt}
                    className="w-full text-left px-4 py-2 hover:bg-[#E0D4C1]/50 dark:hover:bg-[#33322E]/50 hover:text-[#D97757] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-semibold text-gray-500 dark:text-gray-400">.TXT</span>
                    <span>Plain Text</span>
                  </button>
                  <button
                    id="btn-export-md"
                    onClick={handleExportMd}
                    className="w-full text-left px-4 py-2 hover:bg-[#E0D4C1]/50 dark:hover:bg-[#33322E]/50 hover:text-[#D97757] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-semibold text-gray-500 dark:text-gray-400">.MD</span>
                    <span>Markdown</span>
                  </button>
                  <button
                    id="btn-export-pdf"
                    onClick={handleExportPdf}
                    className="w-full text-left px-4 py-2 hover:bg-[#E0D4C1]/50 dark:hover:bg-[#33322E]/50 hover:text-[#D97757] transition-all flex items-center gap-2 cursor-pointer border-t border-[#E0D4C1]/40 dark:border-[#33322E]/40"
                  >
                    <span className="font-semibold text-[#D97757]">.PDF</span>
                    <span>Watermarked PDF</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Title Input */}
      <input
        id="note-title-input"
        type="text"
        value={note.title}
        onChange={(e) => {
          onUpdateNote({
            ...note,
            title: e.target.value,
            updatedAt: new Date().toISOString(),
          });
        }}
        placeholder="Drafting title..."
        className="text-3xl sm:text-4xl font-serif font-bold bg-transparent border-none outline-none text-[#141413] dark:text-[#ECEAE4] mb-4 placeholder-gray-400 dark:placeholder-gray-600 w-full focus:ring-0"
      />

      {/* Creative sound boarding helpers bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-[#EEEDE9] dark:bg-[#1E1E1C] border border-[#E0D4C1]/70 dark:border-[#33322E] p-2 rounded-xl text-xs font-mono transition-colors duration-300">
        <Feather className="w-3.5 h-3.5 text-[#D97757] shrink-0 ml-1.5" />
        <span className="text-[#141413]/60 dark:text-[#ECEAE4]/60 mr-2">Shortcuts:</span>
        <button
          id="btn-shortcut-idea"
          onClick={forceTriggerIdea}
          className="px-2.5 py-1 rounded bg-[#E0D4C1]/60 hover:bg-[#D97757]/10 hover:text-[#D97757] dark:bg-[#33322E]/80 dark:hover:bg-[#D97757]/20 text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Completes the preceding text"
        >
          <span>Type <span className="font-bold">@idea</span></span>
        </button>
        <button
          id="btn-shortcut-fix"
          onClick={forceTriggerFix}
          className="px-2.5 py-1 rounded bg-[#E0D4C1]/60 hover:bg-[#D97757]/10 hover:text-[#D97757] dark:bg-[#33322E]/80 dark:hover:bg-[#D97757]/20 text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Fix spelling and grammar"
        >
          <span>Type <span className="font-bold">@fix</span></span>
        </button>

        <div className="flex-grow" />

        <div className="text-[10px] text-[#141413]/55 dark:text-[#ECEAE4]/55 flex items-center gap-1 mr-1">
          <HelpCircle className="w-3 h-3 text-[#D97757]/80" /> Use tags anywhere inline to summon the Muse
        </div>
      </div>

      {/* Text Editing Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-[#EEEDE9] dark:bg-[#1E1E1C] border border-[#E0D4C1]/70 dark:border-[#33322E] p-1.5 rounded-xl text-xs font-mono transition-colors duration-300">
        <button
          id="btn-format-bold"
          onClick={() => applyFormatting("bold")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Bold (**text**)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-italic"
          onClick={() => applyFormatting("italic")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Italic (*text*)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-underline"
          onClick={() => applyFormatting("underline")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Underline (<u>text</u>)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <span className="h-4 w-px bg-[#E0D4C1]/60 dark:bg-[#33322E] mx-1" />
        <button
          id="btn-format-link"
          onClick={() => applyFormatting("link")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Insert Link ([text](url))"
        >
          <Link className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-ul"
          onClick={() => applyFormatting("ul")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Unordered List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          id="btn-format-ol"
          onClick={() => applyFormatting("ol")}
          className="p-1.5 rounded hover:bg-[#D97757]/10 hover:text-[#D97757] text-[#141413]/80 dark:text-[#ECEAE4]/80 transition-all flex items-center justify-center cursor-pointer"
          title="Ordered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Main Textarea */}
      <div className="relative flex-grow flex flex-col">
        <textarea
          id="note-content-textarea"
          ref={textareaRef}
          value={note.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onFocus={() => setEditorFocused(true)}
          onBlur={() => setEditorFocused(false)}
          placeholder="Begin writing your masterpiece here... Use '@idea' to extend your thoughts, or '@fix' to edit syntax."
          className="w-full flex-grow bg-transparent border-none outline-none resize-none text-[#141413]/90 dark:text-[#ECEAE4]/90 text-base leading-relaxed font-serif claude-editor focus:ring-0 min-h-[400px] pb-24"
        />

        {/* AI Loading & Status Bar */}
        <AnimatePresence>
          {isAiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#141413] dark:bg-[#252421] text-[#EEEDE9] dark:text-[#ECEAE4] px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 z-30 border border-[#D97757]/30"
            >
              <RefreshCw className="w-4 h-4 text-[#D97757] animate-spin" />
              <span className="text-xs font-mono font-medium tracking-wider uppercase">
                Sanctuary Muse drafting...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Error feedback */}
        <AnimatePresence>
          {aiError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-900 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-30 border border-red-500 max-w-md"
            >
              <div className="text-xs font-sans">
                <span className="font-bold">Muse error:</span> {aiError}
              </div>
              <button
                id="btn-dismiss-error"
                onClick={() => setAiError(null)}
                className="text-xs underline ml-2 hover:opacity-80 font-mono"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini cozy footer inside editor */}
      <div className="text-[10px] font-mono text-[#141413]/35 dark:text-[#ECEAE4]/35 flex justify-between items-center mt-auto pt-4 border-t border-[#E0D4C1]/35 dark:border-[#33322E]/50">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-[#D97757]" />
          <span>Scribe Offline-First Sandbox</span>
        </div>
        <div>
          <span>{note.content.length} characters</span>
          <span className="mx-1.5">•</span>
          <span>{note.content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>
    </div>
  );
}
