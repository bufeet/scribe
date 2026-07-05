import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import { Note, UserProfile } from "../types";
import { 
  Sparkles, Check, RefreshCw, HelpCircle, FileText, 
  Calendar, Compass, Feather, Download, ChevronDown,
  Bold, Italic, Underline, Link, List, ListOrdered, X, Glasses
} from "lucide-react";
import { translations, TranslationDictionary } from "../translations";

interface NoteEditorProps {
  note: Note;
  profile: UserProfile;
  onUpdateNote: (updated: Note) => void;
  onAddHistory: (itemType: "note" | "folder", itemName: string, type: "create" | "edit" | "delete" | "restore" | "permanent_delete") => void;
  onCheckAndIncrementUsage: () => boolean;
  onSelectView?: (view: "editor" | "history" | "trash" | "settings") => void;
  language?: "en" | "zh";
  t?: TranslationDictionary;
  isScribeView?: boolean;
  onToggleScribeView?: (active: boolean) => void;
  searchHighlightQuery?: string;
  onClearHighlightQuery?: () => void;
}

const splitAtFirstUnquotedTag = (text: string, tag: string): [string, string] | null => {
  let index = text.indexOf(tag);
  while (index !== -1) {
    // Check if the tag is inside quotes by parsing quote states from the start up to the tag index
    let inQuote = false;
    for (let i = 0; i < index; i++) {
      if (text[i] === '"') {
        inQuote = !inQuote;
      } else if (text[i] === '“') {
        inQuote = true;
      } else if (text[i] === '”') {
        inQuote = false;
      }
    }

    const beforeChar = index > 0 ? text[index - 1] : "";
    const afterChar = index + tag.length < text.length ? text[index + tag.length] : "";
    
    const isPrecededByQuote = beforeChar === '"' || beforeChar === '“';
    const isFollowedByQuote = afterChar === '"' || afterChar === '”';
    
    const isQuoted = inQuote || isPrecededByQuote || isFollowedByQuote;
    
    if (!isQuoted) {
      const preceding = text.substring(0, index);
      const trailing = text.substring(index + tag.length);
      return [preceding, trailing];
    }
    index = text.indexOf(tag, index + 1);
  }
  return null;
};

interface LinkPopoverState {
  isOpen: boolean;
  text: string;
  url: string;
  selectionStart: number;
  selectionEnd: number;
  top: number;
  left: number;
}

export default function NoteEditor({ 
  note, 
  profile, 
  onUpdateNote, 
  onAddHistory, 
  onCheckAndIncrementUsage,
  onSelectView,
  language = "en",
  t,
  isScribeView = false,
  onToggleScribeView,
  searchHighlightQuery,
  onClearHighlightQuery
}: NoteEditorProps) {
  const activeT = t || translations[language || "en"];
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [editorFocused, setEditorFocused] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const linkPopoverRef = useRef<HTMLDivElement>(null);

  const [showMuseModal, setShowMuseModal] = useState(false);
  const [hasDismissedMuse, setHasDismissedMuse] = useState(false);

  const [linkPopover, setLinkPopover] = useState<LinkPopoverState>({
    isOpen: false,
    text: "",
    url: "https://",
    selectionStart: 0,
    selectionEnd: 0,
    top: 0,
    left: 0,
  });

  const getSelectionCoords = (textarea: HTMLTextAreaElement) => {
    try {
      const { selectionStart, selectionEnd, value } = textarea;
      const div = document.createElement("div");
      const style = window.getComputedStyle(textarea);
      
      const propertiesToCopy = [
        "direction", "boxSizing", "width", "height", "overflowX", "overflowY",
        "borderWidth", "borderStyle", "borderColor",
        "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontVariant", "fontStretch",
        "lineHeight", "letterSpacing", "wordSpacing", "textTransform", "textIndent",
        "whiteSpace", "wordBreak", "wordWrap"
      ];
      
      propertiesToCopy.forEach((prop) => {
        (div.style as any)[prop] = (style as any)[prop];
      });
      
      const textareaRect = textarea.getBoundingClientRect();
      
      div.style.position = "fixed";
      div.style.visibility = "hidden";
      div.style.top = `${textareaRect.top}px`;
      div.style.left = `${textareaRect.left}px`;
      div.style.width = `${textareaRect.width}px`;
      div.style.height = `${textareaRect.height}px`;
      div.style.overflow = "hidden";
      div.style.overflowY = textarea.scrollHeight > textarea.clientHeight ? "scroll" : "hidden";
      div.style.margin = "0";
      
      const textBefore = value.substring(0, selectionStart);
      const textSelected = value.substring(selectionStart, selectionEnd);
      const textAfter = value.substring(selectionEnd);
      
      const beforeNode = document.createTextNode(textBefore);
      div.appendChild(beforeNode);
      
      const span = document.createElement("span");
      span.textContent = textSelected || "i";
      div.appendChild(span);
      
      const afterNode = document.createTextNode(textAfter);
      div.appendChild(afterNode);
      
      document.body.appendChild(div);
      
      // Sync scroll offsets
      div.scrollTop = textarea.scrollTop;
      div.scrollLeft = textarea.scrollLeft;
      
      const spanRect = span.getBoundingClientRect();
      const parentRect = textarea.parentElement ? textarea.parentElement.getBoundingClientRect() : textareaRect;
      
      let left = spanRect.left - parentRect.left;
      let top = spanRect.top - parentRect.top;
      
      document.body.removeChild(div);
      
      return { top, left, height: spanRect.height || 20 };
    } catch (e) {
      return { top: 100, left: 150, height: 24 };
    }
  };

  const openLinkPopover = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const coords = getSelectionCoords(textarea);

    setLinkPopover({
      isOpen: true,
      text: selectedText || "",
      url: "https://",
      selectionStart: start,
      selectionEnd: end,
      top: coords.top,
      left: coords.left,
    });
  };

  const confirmLink = (linkText: string, linkUrl: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = linkPopover;
    const text = textarea.value;

    const formatted = `[${linkText || "link"}](${linkUrl || "https://"})`;

    const newContent = text.substring(0, selectionStart) + formatted + text.substring(selectionEnd);
    handleContentChange(newContent);

    setLinkPopover(prev => ({ ...prev, isOpen: false }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionStart + formatted.length);
    }, 50);
  };

  const cancelLink = () => {
    setLinkPopover(prev => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    if (!linkPopover.isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (linkPopoverRef.current && !linkPopoverRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest("[data-link-trigger]")) return;
        cancelLink();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [linkPopover.isOpen]);

  // Monitor whether to show the Muse warning modal
  useEffect(() => {
    const hasNoKey = !profile.apiKey || profile.apiKey.trim() === "";
    const hasTag = splitAtFirstUnquotedTag(note.content, "@idea") !== null || splitAtFirstUnquotedTag(note.content, "@fix") !== null;
    
    if (hasNoKey && hasTag && !hasDismissedMuse) {
      setShowMuseModal(true);
    } else {
      setShowMuseModal(false);
    }
  }, [note.content, profile.apiKey, hasDismissedMuse]);

  // Reset dismissal state if the user deletes the tags completely
  useEffect(() => {
    const hasTag = splitAtFirstUnquotedTag(note.content, "@idea") !== null || splitAtFirstUnquotedTag(note.content, "@fix") !== null;
    if (!hasTag) {
      setHasDismissedMuse(false);
    }
  }, [note.content]);

  // Reset dismissal state on note switch
  useEffect(() => {
    setHasDismissedMuse(false);
  }, [note.id]);

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

  const getCleanMarkdown = (text: string) => {
    let temp = text;
    let indexIdea = temp.indexOf("@idea");
    while (indexIdea !== -1) {
      const beforeChar = indexIdea > 0 ? temp[indexIdea - 1] : "";
      const afterChar = indexIdea + 5 < temp.length ? temp[indexIdea + 5] : "";
      const isQuoted = (beforeChar === '"' || beforeChar === '“') && (afterChar === '"' || afterChar === '”');
      if (!isQuoted) {
        temp = temp.substring(0, indexIdea) + temp.substring(indexIdea + 5);
      } else {
        indexIdea += 5;
      }
      indexIdea = temp.indexOf("@idea", indexIdea);
    }

    let indexFix = temp.indexOf("@fix");
    while (indexFix !== -1) {
      const beforeChar = indexFix > 0 ? temp[indexFix - 1] : "";
      const afterChar = indexFix + 4 < temp.length ? temp[indexFix + 4] : "";
      const isQuoted = (beforeChar === '"' || beforeChar === '“') && (afterChar === '"' || afterChar === '”');
      if (!isQuoted) {
        temp = temp.substring(0, indexFix) + temp.substring(indexFix + 4);
      } else {
        indexFix += 4;
      }
      indexFix = temp.indexOf("@fix", indexFix);
    }
    return temp;
  };

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

  // Trigger highlighting inside editor when searchHighlightQuery is set
  useEffect(() => {
    if (searchHighlightQuery && searchHighlightQuery.trim()) {
      // If we are in Scribe preview reader mode, turn it off so we are in the editor field
      if (isScribeView && onToggleScribeView) {
        onToggleScribeView(false);
      }

      // Allow a small timeout for the editor view or textarea to mount and render fully
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          const content = note.content || "";
          const query = searchHighlightQuery.toLowerCase();
          const index = content.toLowerCase().indexOf(query);
          if (index !== -1) {
            const textarea = textareaRef.current;
            textarea.focus();
            textarea.setSelectionRange(index, index + searchHighlightQuery.length);
            
            // Calculate approximate scroll position to bring the word into view
            const linesBefore = content.substring(0, index).split("\n").length;
            const lineHeight = 24; // approximation for standard leading-relaxed line height
            const scrollTop = Math.max(0, (linesBefore - 4) * lineHeight);
            textarea.scrollTop = scrollTop;
          }
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [searchHighlightQuery, note.id, isScribeView]);

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
    // If no API key, do not proceed with API call
    if (!profile.apiKey || profile.apiKey.trim() === "") {
      setAiError(language === "en" ? "API Key is required to summon the Muse." : "配置 API 密钥后方能唤起缪斯。");
      return;
    }

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

  // Formatting and toolbar options
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
        openLinkPopover();
        return;
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
    <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans h-full flex flex-col transition-colors duration-300 relative">
      {/* Floating Exit Scribe View Button */}
      <AnimatePresence>
        {isScribeView && (
          <motion.button
            key="btn-exit-scribe"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            id="btn-exit-scribe-view"
            onClick={() => onToggleScribeView?.(false)}
            className="fixed top-6 right-6 px-4 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#1A1A18] border border-[#E0D4C1] dark:border-[#33322E] text-[#D97757] hover:bg-[#EEEDE9] dark:hover:bg-[#252421] transition-all cursor-pointer shadow-md flex items-center gap-2 text-xs font-mono select-none z-[80]"
            title="Exit Scribe View"
          >
            <Glasses className="w-4 h-4 animate-pulse" />
            <span>{activeT.scribeViewExit}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Note Header Info */}
      <AnimatePresence initial={false}>
        {!isScribeView && (
          <motion.div
            key="note-header-info"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap justify-between items-center border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80 pb-4 gap-2">
              <div className="flex items-center gap-2.5 text-[#141413]/50 dark:text-[#ECEAE4]/50 text-xs font-mono">
                <FileText className="w-4 h-4 text-[#D97757]" />
                <span>Note Workspace</span>
                <span>•</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>Last modified: {formatDate(note.updatedAt)}</span>
              </div>

              {/* Actions (AI Badge + Scribe View + Export Dropdown) */}
              <div className="flex items-center gap-3">
                {/* AI Model Badge */}
                <div className="flex items-center gap-1.5 text-xs bg-[#D97757]/10 text-[#D97757] px-2.5 py-1 rounded-full font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Engine: {profile.aiModel === "gemini" ? "Gemini (System)" : profile.aiModel === "claude" ? "Claude" : "OpenAI"}</span>
                </div>

                {/* Scribe View Button */}
                <button
                  id="btn-enter-scribe-view"
                  onClick={() => onToggleScribeView?.(true)}
                  className="flex items-center gap-1.5 text-xs bg-[#EEEDE9] hover:bg-[#E0D4C1] dark:bg-[#252421] dark:hover:bg-[#33322E] text-[#141413]/80 hover:text-[#141413] dark:text-[#ECEAE4]/80 dark:hover:text-[#ECEAE4] px-3 py-1 rounded-lg border border-[#E0D4C1] dark:border-[#33322E] font-mono transition-all cursor-pointer shadow-sm"
                  title="Enter Scribe View"
                >
                  <Glasses className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>{activeT.scribeViewEnter}</span>
                </button>

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
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Highlight Banner */}
      <AnimatePresence>
        {searchHighlightQuery && searchHighlightQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-[#141413] dark:text-[#ECEAE4]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                <span>
                  {language === "en" ? (
                    <>Highlighted occurrences of <strong>"{searchHighlightQuery}"</strong> inside the editor field.</>
                  ) : (
                    <>已在编辑器字段中为您高亮标记 <strong>“{searchHighlightQuery}”</strong> 的匹配项。</>
                  )}
                </span>
              </div>
              <button
                onClick={onClearHighlightQuery}
                className="p-1 rounded-lg hover:bg-amber-500/20 text-[#141413]/50 dark:text-[#ECEAE4]/50 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 shrink-0"
              >
                <span>{language === "en" ? "Clear" : "清除高亮"}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="mb-4">
        <AnimatePresence mode="wait">
          {isScribeView ? (
            <motion.h1
              key="scribe-title"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="text-3xl sm:text-4xl font-serif font-bold text-[#141413] dark:text-[#ECEAE4] border-b border-[#E0D4C1]/40 dark:border-[#33322E]/40 pb-4 mb-2 leading-tight"
            >
              {note.title || (language === "en" ? "Untitled Writing" : "无标题笔记")}
            </motion.h1>
          ) : (
            <motion.input
              key="editor-title"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
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
              className="text-3xl sm:text-4xl font-serif font-bold bg-transparent border-none outline-none text-[#141413] dark:text-[#ECEAE4] placeholder-gray-400 dark:placeholder-gray-600 w-full focus:ring-0"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Muse Whisper Modal */}
      <AnimatePresence>
        {showMuseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: dimming and slightly blurring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHasDismissedMuse(true)}
              className="absolute inset-0 bg-[#0c0c0b]/40 dark:bg-[#000000]/60 backdrop-blur-[4px]"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-[#FAF9F5] dark:bg-[#1A1A18] border border-[#E0D4C1] dark:border-[#33322E] rounded-2xl shadow-2xl p-6 overflow-hidden z-10 transition-colors duration-300"
            >
              {/* Close Button */}
              <button
                id="btn-close-muse-modal"
                onClick={() => setHasDismissedMuse(true)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#141413]/40 dark:text-[#ECEAE4]/40 hover:bg-[#EEEDE9] dark:hover:bg-[#252421] hover:text-[#141413] dark:hover:text-[#ECEAE4] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
                <div className="w-12 h-12 rounded-2xl bg-[#D97757]/10 flex items-center justify-center text-[#D97757] shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-4 flex-grow min-w-0">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#141413] dark:text-[#ECEAE4] leading-snug">
                      {activeT.museWhisperTitle}
                    </h3>
                    <p className="text-xs text-[#141413]/70 dark:text-[#ECEAE4]/70 mt-1.5 leading-relaxed">
                      {activeT.museWhisperDesc}
                    </p>
                  </div>

                  <div className="text-xs italic text-[#141413]/70 dark:text-[#ECEAE4]/70 bg-[#EEEDE9]/60 dark:bg-[#252421]/60 p-4 rounded-xl border border-[#E0D4C1]/40 dark:border-[#33322E]/40 leading-relaxed font-sans">
                    {activeT.museWhisperMoti}
                  </div>

                  {onSelectView && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        id="btn-muse-modal-close"
                        onClick={() => setHasDismissedMuse(true)}
                        className="px-3.5 py-1.5 border border-[#E0D4C1] dark:border-[#33322E] hover:bg-[#EEEDE9] dark:hover:bg-[#252421] text-[#141413]/70 dark:text-[#ECEAE4]/70 rounded-lg text-xs font-mono transition-all cursor-pointer"
                      >
                        {language === "en" ? "Dismiss" : "忽略"}
                      </button>
                      <button
                        id="btn-muse-modal-configure"
                        onClick={() => {
                          setHasDismissedMuse(true);
                          onSelectView("settings");
                        }}
                        className="px-4 py-1.5 bg-[#D97757] hover:bg-[#c46546] text-[#EEEDE9] rounded-lg text-xs font-mono font-medium shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{activeT.museSettingsBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shortcut Tip shown when API key is set */}
      <AnimatePresence>
        {!isScribeView && profile.apiKey && profile.apiKey.trim() !== "" && (
          <motion.div
            key="shortcut-tip"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 bg-[#EEEDE9] dark:bg-[#1E1E1C] border border-[#E0D4C1]/70 dark:border-[#33322E] p-2.5 rounded-xl text-xs font-mono transition-colors duration-300">
              <Feather className="w-3.5 h-3.5 text-[#D97757] shrink-0 ml-1.5" />
              <span className="text-[#141413]/70 dark:text-[#ECEAE4]/70">
                {activeT.museShortcutsTip}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Editing Toolbar */}
      <AnimatePresence>
        {!isScribeView && (
          <motion.div
            key="editing-toolbar"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-1.5 bg-[#EEEDE9] dark:bg-[#1E1E1C] border border-[#E0D4C1]/70 dark:border-[#33322E] p-1.5 rounded-xl text-xs font-mono transition-colors duration-300">
              <span className="text-[#141413]/60 dark:text-[#ECEAE4]/60 mr-1.5 ml-2">Format:</span>
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
                data-link-trigger="true"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Main Textarea / Scribe View */}
      <div className="relative flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {isScribeView ? (
            <motion.div
              key="scribe-reader-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex-grow pb-24 overflow-y-auto max-w-none prose dark:prose-invert"
            >
              <div className="markdown-body text-[#141413]/90 dark:text-[#ECEAE4]/90 text-base leading-relaxed font-serif select-text">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-serif font-bold text-[#141413] dark:text-[#ECEAE4] mt-6 mb-3 border-b border-[#E0D4C1]/40 pb-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-serif font-bold text-[#141413] dark:text-[#ECEAE4] mt-5 mb-2.5" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-serif font-bold text-[#141413] dark:text-[#ECEAE4] mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-base text-[#141413]/95 dark:text-[#ECEAE4]/95 mb-4 leading-relaxed font-serif" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1.5" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1.5" {...props} />,
                    li: ({node, ...props}) => <li className="text-base text-[#141413]/90 dark:text-[#ECEAE4]/90 font-serif" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#D97757] pl-4 italic my-4 text-[#141413]/75 dark:text-[#ECEAE4]/75 bg-[#EEEDE9]/30 dark:bg-[#1E1E1C]/30 p-3 rounded-r-xl" {...props} />,
                    code: ({node, ...props}) => <code className="bg-[#EEEDE9] dark:bg-[#252421] px-1.5 py-0.5 rounded text-sm font-mono text-[#D97757]" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-[#EEEDE9] dark:bg-[#252421] p-4 rounded-xl overflow-x-auto text-sm font-mono text-[#141413]/90 dark:text-[#ECEAE4]/90 border border-[#E0D4C1]/40 dark:border-[#33322E]/40 mb-4" {...props} />,
                    a: ({node, ...props}) => (
                      <a 
                        className="text-[#D97757] hover:underline hover:text-[#c46546] font-medium transition-colors inline-flex items-center gap-0.5 cursor-pointer" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={`Open link: ${props.href}`}
                        {...props}
                      >
                        {props.children}
                        <span className="inline-block text-[10px] opacity-75 font-mono ml-0.5">↗</span>
                      </a>
                    ),
                  }}
                >
                  {getCleanMarkdown(note.content)}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <motion.textarea
              key="scribe-editor-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              id="note-content-textarea"
              ref={textareaRef}
              value={note.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onFocus={() => setEditorFocused(true)}
              onBlur={() => setEditorFocused(false)}
              placeholder="Begin writing your masterpiece here... Use '@idea' to extend your thoughts, or '@fix' to edit syntax."
              className="w-full flex-grow bg-transparent border-none outline-none resize-none text-[#141413]/90 dark:text-[#ECEAE4]/90 text-base leading-relaxed font-serif claude-editor focus:ring-0 min-h-[400px] pb-24"
            />
          )}
        </AnimatePresence>

        {/* Link creation floating card with cartoon animation */}
        <AnimatePresence>
          {!isScribeView && linkPopover.isOpen && (
            <motion.div
              key="link-popover-card"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 15, stiffness: 180 }}
              style={{
                position: "absolute",
                top: `${linkPopover.top}px`,
                left: `${Math.max(10, Math.min(textareaRef.current ? textareaRef.current.clientWidth - 300 : 300, linkPopover.left - 130))}px`,
                width: "0px",
                height: "0px",
                zIndex: 100,
              }}
            >
              <div
                ref={linkPopoverRef}
                className="absolute bottom-full left-0 mb-[30px] w-[280px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#D97757]/40 rounded-2xl shadow-xl p-4 flex flex-col font-mono text-xs text-[#141413] dark:text-[#ECEAE4]"
              >
                {/* Pointy Arrow indicator */}
                <div 
                  className="absolute left-[130px] bottom-[-6px] w-3 h-3 bg-[#FAF9F5] dark:bg-[#1E1E1C] border-r border-b border-[#D97757]/40 rotate-45"
                />

                {/* Cartoon Mascot: Nibby the Quill */}
                <div className="flex items-center gap-3 mb-3 border-b border-[#E0D4C1]/50 dark:border-[#33322E]/80 pb-2.5">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-amber-400 to-[#D97757] rounded-xl flex items-center justify-center relative shadow-sm"
                    animate={{ 
                      y: [0, -4, 0],
                      rotate: [0, -3, 3, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2.2, 
                      ease: "easeInOut" 
                    }}
                  >
                    {/* Pen Nib detail */}
                    <div className="absolute top-1 w-1.5 h-3 bg-[#FAF9F5] dark:bg-[#1E1E1C] rounded-full" />
                    
                    {/* Blinking Anime Eyes */}
                    <div className="flex gap-1.5 mt-2 z-10">
                      <motion.div 
                        className="w-1.5 h-1.5 bg-[#FAF9F5] dark:bg-[#FAF9F5] rounded-full"
                        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                        transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 0.85, 0.9, 1] }}
                      />
                      <motion.div 
                        className="w-1.5 h-1.5 bg-[#FAF9F5] dark:bg-[#FAF9F5] rounded-full"
                        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                        transition={{ repeat: Infinity, duration: 3, times: [0, 0.8, 0.85, 0.9, 1] }}
                      />
                    </div>
                    
                    {/* Rosy Cheeks */}
                    <div className="absolute left-1.5 bottom-2.5 w-1 h-1 bg-red-400 rounded-full opacity-70" />
                    <div className="absolute right-1.5 bottom-2.5 w-1 h-1 bg-red-400 rounded-full opacity-70" />
                    
                    {/* Happy Smile */}
                    <div className="absolute bottom-1.5 w-2.5 h-1 bg-[#FAF9F5] dark:bg-[#FAF9F5] rounded-b-full" />
                  </motion.div>

                  <div>
                    <h4 className="font-bold text-[#D97757]">Link with Scribe</h4>
                    <p className="text-[10px] text-[#141413]/60 dark:text-[#ECEAE4]/60">Summon links into existence!</p>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="text-[10px] text-[#141413]/50 dark:text-[#ECEAE4]/50 block mb-0.5 font-bold uppercase tracking-wide">Link Text</label>
                    <input
                      type="text"
                      value={linkPopover.text}
                      onChange={(e) => setLinkPopover(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter text..."
                      className="w-full bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#D97757] text-[#141413] dark:text-[#ECEAE4]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#141413]/50 dark:text-[#ECEAE4]/50 block mb-0.5 font-bold uppercase tracking-wide">Destination URL</label>
                    <input
                      type="text"
                      value={linkPopover.url}
                      onChange={(e) => setLinkPopover(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://"
                      className="w-full bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#D97757] text-[#141413] dark:text-[#ECEAE4]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          confirmLink(linkPopover.text, linkPopover.url);
                        } else if (e.key === "Escape") {
                          cancelLink();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={cancelLink}
                    className="px-2.5 py-1.5 rounded-lg border border-[#E0D4C1] dark:border-[#33322E] hover:bg-[#EEEDE9] dark:hover:bg-[#252421] text-[#141413]/70 dark:text-[#ECEAE4]/70 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmLink(linkPopover.text, linkPopover.url)}
                    className="px-3 py-1.5 rounded-lg bg-[#D97757] text-white hover:bg-[#c46546] font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Link</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Loading & Status Bar */}
        <AnimatePresence>
          {!isScribeView && isAiLoading && (
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
          {!isScribeView && aiError && (
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
      <AnimatePresence>
        {!isScribeView && (
          <motion.div
            key="cozy-footer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden mt-auto"
          >
            <div className="text-[10px] font-mono text-[#141413]/35 dark:text-[#ECEAE4]/35 flex justify-between items-center pt-4 border-t border-[#E0D4C1]/35 dark:border-[#33322E]/50">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#D97757]" />
                <span>Scribe Sandbox</span>
              </div>
              <div>
                <span>{note.content.length} characters</span>
                <span className="mx-1.5">•</span>
                <span>{note.content.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
