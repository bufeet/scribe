import { useState, useEffect } from "react";
import { Folder, Note, HistoryItem, UserProfile } from "./types";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import HistoryPanel from "./components/HistoryPanel";
import TrashBin from "./components/TrashBin";
import ProfileSettings from "./components/ProfileSettings";
import Fireworks from "./components/Fireworks";
import ProductTour from "./components/ProductTour";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./components/LandingPage";
import LanguageSweep from "./components/LanguageSweep";
import { translations } from "./translations";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, BookOpen, Feather, AlertCircle, AlertTriangle, Check, X, Info } from "lucide-react";

// Default mockup state for first launch
const INITIAL_FOLDERS: Folder[] = [
  {
    id: "folder-1",
    name: "Reflections & Essays",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    deletedAt: null,
  },
  {
    id: "folder-2",
    name: "Poetic Musings",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    deletedAt: null,
  }
];

const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Welcome to Scribe",
    content: `Welcome to Scribe — your creative sanctuary and literary sounding board.

Scribe is designed for moments when you want to write simply, deeply, and without distraction. This space combines a clean, cozy, Anthropic-inspired canvas with a sophisticated AI companion designed to act as a sounding board rather than a coding helper.

Here is how you can begin:

1. Exploring Ideas (@idea)
Scribe helps you navigate creative blocks. Simply type the tag "@idea" anywhere in your text. After a brief pause, our model reads your preceding words and autocompletes the text with elegant literary prose to carry your train of thought forward.

Try typing some words and placing "@idea" at the end of a sentence to see it in action!

2. Refinement & Editing (@fix)
Type "@fix" before existing text to refine spelling, grammar, and syntax while preserving your unique author voice. Or, place "@fix" before empty space to receive a subtle literary continuation suggestion.

💡 Avoid Token Waste Tip: If you want to write about these shortcuts without triggering them automatically, enclose them in double quotes (for example, "@idea" or "@fix"). Scribe's parser detects quoted shortcuts and ignores them, saving your dynamic hourly usage limit.

We hope you find comfort and necessity in this clean environment. Breathe deep, draft freely, and let Scribe join you in the sea of ideas.`,
    folderId: null,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    deletedAt: null,
  },
  {
    id: "note-2",
    title: "On the Solitary Highland Reaper",
    content: "Behold her, single in the field,\nYon solitary Highland Lass!\nReaping and singing by herself;\nStop here, or gently pass!\n\nWhen I first read Wordsworth's verses, I was struck by the haunting beauty of the Reaper's song. It echoes through the deep valleys of our memories, suggesting that some songs are too profound to ever truly end. @idea",
    folderId: "folder-2",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deletedAt: null,
  },
  {
    id: "note-3",
    title: "A Quiet Study of Silence",
    content: "We live in an age of constant noise. Noise from notifications, noise from streets, and perhaps most of all, noise from our own minds. Scribe represents a deliberate choice to return to silence — to a clean white sheet where only our rawest thoughts can exist. @fix",
    folderId: "folder-1",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    deletedAt: null,
  }
];

const DEFAULT_PROFILE: UserProfile = {
  name: "Samuel Coleridge",
  bio: "drafting reflections on memory, beauty, and silence.",
  aiModel: "gemini",
  apiKey: "",
};

interface AppNotification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function App() {
  const [language, setLanguage] = useState<"en" | "zh">(() => {
    return (localStorage.getItem("scribe_language") as "en" | "zh") || "en";
  });
  const [isLanguageSweeping, setIsLanguageSweeping] = useState(false);
  const t = translations[language];

  const [folders, setFolders] = useState<Folder[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [aiUsageCount, setAiUsageCount] = useState<number>(() => {
    return parseInt(localStorage.getItem("scribe_ai_usage_count") || "0", 10);
  });
  const [aiUsageResetTime, setAiUsageResetTime] = useState<string | null>(() => {
    return localStorage.getItem("scribe_ai_usage_reset_time");
  });

  const showNotification = (
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    const id = "notif-" + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const checkAndIncrementUsage = (): boolean => {
    const limit = profile.aiUsageLimit ?? 10;
    const now = new Date();
    let currentCount = aiUsageCount;
    let currentResetTime = aiUsageResetTime;

    if (currentResetTime) {
      const resetTime = new Date(currentResetTime);
      if (now >= resetTime) {
        currentCount = 0;
        currentResetTime = null;
        localStorage.setItem("scribe_ai_usage_count", "0");
        localStorage.removeItem("scribe_ai_usage_reset_time");
        setAiUsageCount(0);
        setAiUsageResetTime(null);
      }
    }

    if (currentCount >= limit) {
      let timeRemainingStr = "one hour";
      if (currentResetTime) {
        const resetTime = new Date(currentResetTime);
        const diffMs = resetTime.getTime() - now.getTime();
        if (diffMs > 0) {
          const diffMins = Math.ceil(diffMs / 60000);
          timeRemainingStr = `${diffMins} minute${diffMins > 1 ? "s" : ""}`;
        }
      }
      showNotification(
        `Creative limit of ${limit} reached. Please wait ${timeRemainingStr} for reset.`,
        "error"
      );
      return false;
    }

    const newCount = currentCount + 1;
    localStorage.setItem("scribe_ai_usage_count", newCount.toString());
    setAiUsageCount(newCount);

    if (!currentResetTime) {
      const newReset = new Date(now.getTime() + 3600 * 1000).toISOString();
      localStorage.setItem("scribe_ai_usage_reset_time", newReset);
      setAiUsageResetTime(newReset);
    }

    return true;
  };
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [fireworksTrigger, setFireworksTrigger] = useState(0);
  const [activeView, setActiveView] = useState<"editor" | "history" | "trash" | "settings">("editor");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState<boolean>(() => {
    return !localStorage.getItem("scribe_visited_before");
  });
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme] = useState<"light">("light");
  const [isInApp, setIsInApp] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobileDevice(isMobileUA || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("scribe_theme", "light");
  }, []);

  // Guided tour starts 1.5 seconds after the loading screen exit animation (1.0s) has fully completed
  useEffect(() => {
    if (!isLoadingScreen && isInApp) {
      const tourCompleted = localStorage.getItem("scribe_tour_completed");
      if (!tourCompleted) {
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 2500); // 1000ms loading screen exit animation + 1500ms delay
        return () => clearTimeout(timer);
      }
    }
  }, [isLoadingScreen, isInApp]);

  // Synchronize Active View with Tour Steps to showcase the Settings Page
  useEffect(() => {
    if (showTour) {
      if (tourStep === 4) {
        setActiveView("settings");
      } else {
        setActiveView("editor");
      }
    }
  }, [tourStep, showTour]);

  // Initial load
  useEffect(() => {
    const savedFolders = localStorage.getItem("scribe_folders");
    const savedNotes = localStorage.getItem("scribe_notes");
    const savedHistory = localStorage.getItem("scribe_history");
    const savedProfile = localStorage.getItem("scribe_profile");
    const tourCompleted = localStorage.getItem("scribe_tour_completed");

    if (savedFolders) setFolders(JSON.parse(savedFolders));
    else setFolders(INITIAL_FOLDERS);

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      // Select the first active note
      const activeList = parsedNotes.filter((n: Note) => n.deletedAt === null);
      if (activeList.length > 0) setActiveNoteId(activeList[0].id);
    } else {
      setNotes(INITIAL_NOTES);
      setActiveNoteId("note-1");
    }

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else {
      // Mock history
      const mockHist: HistoryItem[] = [
        {
          id: "hist-1",
          type: "create",
          itemType: "note",
          itemName: "Welcome to Scribe",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      setHistory(mockHist);
    }

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...DEFAULT_PROFILE,
        ...parsed,
      });
    }
  }, []);

  // Save changes helper
  const saveFolders = (updated: Folder[]) => {
    setFolders(updated);
    localStorage.setItem("scribe_folders", JSON.stringify(updated));
  };

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("scribe_notes", JSON.stringify(updated));
  };

  const saveHistory = (updated: HistoryItem[]) => {
    setHistory(updated);
    localStorage.setItem("scribe_history", JSON.stringify(updated));
  };

  const handleProfileSave = () => {
    localStorage.setItem("scribe_profile", JSON.stringify(profile));
    addHistoryLog("note", "Sanctuary Settings updated", "edit");
  };

  const handleToggleLanguage = () => {
    const nextLang = language === "en" ? "zh" : "en";
    setIsLanguageSweeping(true);
    setLanguage(nextLang);
    localStorage.setItem("scribe_language", nextLang);
    
    // Auto save settings
    localStorage.setItem("scribe_profile", JSON.stringify(profile));

    // Show localized notification immediately in the newly selected language
    const msg = nextLang === "en" 
      ? "Language switched to English, automatically saved." 
      : "语言已切换为中文，自适应保存。";
    showNotification(msg, "info");
  };

  const handleImportSingleNote = (title: string, content: string) => {
    const newNote: Note = {
      id: "note-" + Math.random().toString(36).substr(2, 9),
      title,
      content,
      folderId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    setActiveView("editor");
    addHistoryLog("note", `Imported note: ${title}`, "create");
  };

  const handleImportData = (importedFolders: Folder[], importedNotes: Note[]) => {
    saveFolders(importedFolders);
    saveNotes(importedNotes);

    // Find first active note among imported notes to activate
    const activeList = importedNotes.filter((n) => n.deletedAt === null);
    if (activeList.length > 0) {
      setActiveNoteId(activeList[0].id);
    } else {
      setActiveNoteId(null);
    }

    addHistoryLog("note", "Sanctuary state restored from backup", "restore");
  };

  // Add history record helper
  const addHistoryLog = (
    itemType: "note" | "folder",
    itemName: string,
    type: "create" | "edit" | "delete" | "restore" | "permanent_delete"
  ) => {
    const newLog: HistoryItem = {
      id: "hist-" + Math.random().toString(36).substr(2, 9),
      type,
      itemType,
      itemName,
      timestamp: new Date().toISOString(),
    };
    saveHistory([newLog, ...history]);
  };

  // Creation logic
  const handleAddFolder = (name: string, parentId: string | null = null) => {
    const newFolder: Folder = {
      id: "folder-" + Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date().toISOString(),
      deletedAt: null,
      parentId,
    };
    saveFolders([...folders, newFolder]);
    addHistoryLog("folder", name, "create");
    showNotification(`Folder "${name}" created successfully.`, "success");
  };

  const handleMoveNote = (noteId: string, folderId: string | null) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, folderId } : n
    );
    saveNotes(updated);

    const folderName = folderId
      ? folders.find((f) => f.id === folderId)?.name || "Folder"
      : "Standalone";
    addHistoryLog("note", `Moved "${note.title || "Untitled"}" to ${folderName}`, "edit");
    showNotification(`Moved "${note.title || "Untitled"}" to ${folderName}.`, "success");
  };

  const handleMoveFolder = (folderId: string, parentId: string | null) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    // Cycle checking
    if (parentId) {
      let currentParentId: string | null | undefined = parentId;
      while (currentParentId) {
        if (currentParentId === folderId) {
          showNotification("Cannot move a folder into its own subfolders.", "warning");
          return;
        }
        const parent = folders.find((f) => f.id === currentParentId);
        currentParentId = parent?.parentId;
      }
    }

    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, parentId } : f
    );
    saveFolders(updated);

    const targetName = parentId
      ? folders.find((f) => f.id === parentId)?.name || "Folder"
      : "Root";
    addHistoryLog("folder", `Moved "${folder.name}" to ${targetName}`, "edit");
    showNotification(`Moved "${folder.name}" to ${targetName}.`, "success");
  };

  const handleAddNote = (folderId: string | null = null) => {
    const newNote: Note = {
      id: "note-" + Math.random().toString(36).substr(2, 9),
      title: "",
      content: "",
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    saveNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setActiveView("editor");
    addHistoryLog("note", "New Note draft started", "create");
    showNotification("New note draft started.", "success");
  };

  // Updating note
  const handleUpdateNote = (updatedNote: Note) => {
    const updated = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    saveNotes(updated);
  };

  // Soft Deletion
  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find((n) => n.id === noteId);
    if (!noteToDelete) return;

    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, deletedAt: new Date().toISOString() } : n
    );
    saveNotes(updated);

    if (activeNoteId === noteId) {
      const activeList = updated.filter((n) => n.deletedAt === null);
      setActiveNoteId(activeList.length > 0 ? activeList[0].id : null);
    }

    addHistoryLog("note", noteToDelete.title || "Untitled Writing", "delete");
    showNotification(`Note "${noteToDelete.title || "Untitled"}" moved to Trash.`, "info");
  };

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (!folderToDelete) return;

    // Find all descendants recursively
    const getDescendants = (id: string): string[] => {
      const children = folders.filter((f) => f.parentId === id);
      return [id, ...children.flatMap((c) => getDescendants(c.id))];
    };
    const folderIdsToDelete = getDescendants(folderId);

    // soft delete folders
    const updatedFolders = folders.map((f) =>
      folderIdsToDelete.includes(f.id) ? { ...f, deletedAt: new Date().toISOString() } : f
    );
    saveFolders(updatedFolders);

    // soft delete all nested notes for these folders
    const updatedNotes = notes.map((n) =>
      n.folderId && folderIdsToDelete.includes(n.folderId)
        ? { ...n, deletedAt: new Date().toISOString() }
        : n
    );
    saveNotes(updatedNotes);

    // check if active note is now deleted
    if (activeNoteId) {
      const currentActive = notes.find((n) => n.id === activeNoteId);
      if (currentActive && currentActive.folderId && folderIdsToDelete.includes(currentActive.folderId)) {
        const remainingActive = updatedNotes.filter((n) => n.deletedAt === null);
        setActiveNoteId(remainingActive.length > 0 ? remainingActive[0].id : null);
      }
    }

    addHistoryLog("folder", folderToDelete.name, "delete");
    showNotification(`Folder "${folderToDelete.name}" and subfolders moved to Trash.`, "info");
  };

  // Restores
  const handleRestoreNote = (noteId: string) => {
    const noteToRestore = notes.find((n) => n.id === noteId);
    if (!noteToRestore) return;

    // If the note belongs to a folder that is currently in trash, restore it to standalone (null)
    let finalFolderId = noteToRestore.folderId;
    if (finalFolderId) {
      const folder = folders.find((f) => f.id === finalFolderId);
      if (folder && folder.deletedAt !== null) {
        finalFolderId = null; // restore as standalone note since its folder is dead
      }
    }

    const updated = notes.map((n) =>
      n.id === noteId ? { ...n, deletedAt: null, folderId: finalFolderId } : n
    );
    saveNotes(updated);
    setActiveNoteId(noteId);
    setActiveView("editor");
    addHistoryLog("note", noteToRestore.title || "Untitled Writing", "restore");
    showNotification(`Note "${noteToRestore.title || "Untitled"}" restored to workspace.`, "success");
  };

  const handleRestoreFolder = (folderId: string) => {
    const folderToRestore = folders.find((f) => f.id === folderId);
    if (!folderToRestore) return;

    // Find all descendants recursively
    const getDescendants = (id: string): string[] => {
      const children = folders.filter((f) => f.parentId === id);
      return [id, ...children.flatMap((c) => getDescendants(c.id))];
    };
    const folderIdsToRestore = getDescendants(folderId);

    const updatedFolders = folders.map((f) =>
      folderIdsToRestore.includes(f.id) ? { ...f, deletedAt: null } : f
    );
    saveFolders(updatedFolders);

    // Restore all notes inside these folders too
    const updatedNotes = notes.map((n) =>
      n.folderId && folderIdsToRestore.includes(n.folderId) ? { ...n, deletedAt: null } : n
    );
    saveNotes(updatedNotes);

    addHistoryLog("folder", folderToRestore.name, "restore");
    showNotification(`Folder "${folderToRestore.name}" and subfolders restored.`, "success");
  };

  // Permanent deletions
  const handlePermanentDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find((n) => n.id === noteId);
    const updated = notes.filter((n) => n.id !== noteId);
    saveNotes(updated);

    if (noteToDelete) {
      addHistoryLog("note", noteToDelete.title || "Untitled Writing", "permanent_delete");
      showNotification(`Note "${noteToDelete.title || "Untitled"}" permanently deleted.`, "warning");
    }
  };

  const handlePermanentDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (!folderToDelete) return;

    // Find all descendants recursively
    const getDescendants = (id: string): string[] => {
      const children = folders.filter((f) => f.parentId === id);
      return [id, ...children.flatMap((c) => getDescendants(c.id))];
    };
    const folderIdsToDelete = getDescendants(folderId);

    const updatedFolders = folders.filter((f) => !folderIdsToDelete.includes(f.id));
    saveFolders(updatedFolders);

    // Also permanently delete nested notes
    const updatedNotes = notes.filter(
      (n) => !n.folderId || !folderIdsToDelete.includes(n.folderId)
    );
    saveNotes(updatedNotes);

    addHistoryLog("folder", folderToDelete.name, "permanent_delete");
    showNotification(`Folder "${folderToDelete.name}" and subfolders permanently deleted.`, "warning");
  };

  const handleEmptyTrash = () => {
    const notesToKeep = notes.filter((n) => n.deletedAt === null);
    const foldersToKeep = folders.filter((f) => f.deletedAt === null);
    saveNotes(notesToKeep);
    saveFolders(foldersToKeep);
    addHistoryLog("note", "Entire Trash Bin Emptied", "permanent_delete");
    showNotification("Entire Trash Bin Emptied.", "warning");
  };

  // Clear Chronicles
  const handleClearHistory = () => {
    saveHistory([]);
  };

  // Close tour callback
  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem("scribe_tour_completed", "true");
  };

  // Current active note object
  const activeNote = notes.find((n) => n.id === activeNoteId);

  if (isMobileDevice) {
    return (
      <div className="min-h-screen bg-[#EEEDE9] text-[#141413] flex flex-col items-center justify-center p-6 text-center select-none relative font-sans antialiased overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D97757]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md bg-[#FAF9F6] border border-[#E0D4C1] p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#141413] flex items-center justify-center text-[#EEEDE9] shadow">
            <Feather className="w-8 h-8 text-[#D97757] animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#141413]">
            Scribe Writing Sanctuary
          </h1>
          
          <div className="h-px w-16 bg-[#D97757]/40" />
          
          <h2 className="text-sm font-serif font-semibold text-[#D97757] uppercase tracking-wider">
            Desktop Access Only
          </h2>
          
          <p className="text-xs text-[#141413]/70 leading-relaxed">
            Scribe is designed as a focused literary workspace, requiring a full desktop environment to preserve its typography pairings, tactile key strokes, and spatial sanctuary layouts.
          </p>
          
          <p className="text-xs text-[#141413]/60 leading-relaxed bg-[#D97757]/5 border border-[#D97757]/10 p-3.5 rounded-xl font-mono">
            Our team is actively crafting a dedicated companion experience for mobile, but for now, we invite you to open Scribe on your laptop or computer.
          </p>

          <div className="text-[10px] font-mono text-[#141413]/50 mt-2">
            All credits belong to <a href="https://linkedin.com/in/joalx" target="_blank" rel="noopener noreferrer" className="text-[#D97757] font-semibold hover:underline">João Leite (@joalx)</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoadingScreen && (
          <LoadingScreen onComplete={() => {
            setIsLoadingScreen(false);
            localStorage.setItem("scribe_visited_before", "true");
          }} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isInApp ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <LandingPage onLaunchApp={() => {
              setIsInApp(true);
              setIsLoadingScreen(true);
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="app-workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex h-screen w-screen transition-colors duration-300 overflow-hidden antialiased ${
              theme === "dark" ? "dark bg-[#151514] text-[#ECEAE4]" : "bg-[#EEEDE9] text-[#141413]"
            }`}
          >
            {/* Product Tour Overlay */}
            <AnimatePresence>
              {showTour && (
                <ProductTour 
                  onClose={handleCloseTour} 
                  onStepChange={setTourStep} 
                />
              )}
            </AnimatePresence>

            {/* Main Sidebar */}
            <Sidebar
              folders={folders}
              notes={notes}
              activeView={activeView}
              activeNoteId={activeNoteId}
              profile={profile}
              activeTourStep={tourStep}
              isCollapsed={isSidebarCollapsed}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              t={t}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onSelectView={setActiveView}
              onSelectNote={setActiveNoteId}
              onAddFolder={handleAddFolder}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onDeleteFolder={handleDeleteFolder}
              onMoveNote={handleMoveNote}
              onMoveFolder={handleMoveFolder}
              isLoading={isLoadingScreen}
              onShowNotification={showNotification}
            />

            {/* Primary Workspace Stage */}
            <main className="flex-grow h-full flex flex-col overflow-y-auto bg-[#EEEDE9] dark:bg-[#151514] text-[#141413] dark:text-[#ECEAE4] transition-colors duration-300">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView + "-" + activeNoteId}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex-grow flex flex-col"
                >
                  {activeView === "editor" && (
                    activeNote ? (
                      <NoteEditor
                        note={activeNote}
                        profile={profile}
                        onUpdateNote={handleUpdateNote}
                        onAddHistory={addHistoryLog}
                        onCheckAndIncrementUsage={checkAndIncrementUsage}
                        onSelectView={setActiveView}
                        language={language}
                        t={t}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                        <Compass className="w-12 h-12 text-[#E0D4C1] mb-4 animate-pulse" />
                        <h2 className="text-xl font-serif font-medium text-[#141413]/70">No note selected</h2>
                        <p className="text-xs text-[#141413]/40 mt-1.5 leading-relaxed">
                          Begin typing immediately by creating a "New Standalone Note" or starting a draft inside a folder from the sidebar.
                        </p>
                        <button
                          id="btn-workspace-new-note"
                          onClick={() => handleAddNote(null)}
                          className="mt-6 px-4 py-2 bg-[#D97757] hover:bg-[#c46546] text-white rounded-lg text-xs font-mono font-medium shadow transition-all cursor-pointer"
                        >
                          Draft First Standalone
                        </button>
                      </div>
                    )
                  )}

                  {activeView === "history" && (
                    <HistoryPanel
                      history={history}
                      onClearHistory={handleClearHistory}
                      language={language}
                      t={t}
                    />
                  )}

                  {activeView === "trash" && (
                    <TrashBin
                      deletedNotes={notes.filter((n) => n.deletedAt !== null)}
                      deletedFolders={folders.filter((f) => f.deletedAt !== null)}
                      onRestoreNote={handleRestoreNote}
                      onRestoreFolder={handleRestoreFolder}
                      onPermanentDeleteNote={handlePermanentDeleteNote}
                      onPermanentDeleteFolder={handlePermanentDeleteFolder}
                      onEmptyTrash={handleEmptyTrash}
                      language={language}
                      t={t}
                    />
                  )}

                  {activeView === "settings" && (
                    <ProfileSettings
                      profile={profile}
                      onChange={setProfile}
                      onSave={handleProfileSave}
                      aiUsageCount={aiUsageCount}
                      aiUsageResetTime={aiUsageResetTime}
                      folders={folders}
                      notes={notes}
                      onImportData={handleImportData}
                      onImportSingleNote={handleImportSingleNote}
                      onTriggerFireworks={() => setFireworksTrigger((prev) => prev + 1)}
                      onShowNotification={showNotification}
                      language={language}
                      t={t}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

    {/* Toast Notifications Container */}
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="pointer-events-auto bg-[#141413]/95 backdrop-blur border border-[#E0D4C1]/15 text-[#EEEDE9] rounded-xl shadow-2xl p-4 flex items-start gap-3 w-80 sm:w-96 select-none"
          >
            {notif.type === "success" && <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
            {notif.type === "info" && <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />}
            {notif.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
            {notif.type === "error" && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
            
            <div className="flex-grow font-sans text-xs leading-relaxed font-medium">
              {notif.message}
            </div>

            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              className="text-[#EEEDE9]/40 hover:text-[#EEEDE9] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {/* Celebratory Minimalist Fireworks Canvas */}
    <Fireworks triggerCount={fireworksTrigger} />

    {/* Subtle Language Sweep Effect Overlay */}
    <LanguageSweep isTriggered={isLanguageSweeping} onFinished={() => setIsLanguageSweeping(false)} />
    </>
  );
}
