import React, { useState, FormEvent, DragEvent } from "react";
import { Folder, Note, UserProfile } from "../types";
import { 
  FolderPlus, FilePlus, ChevronDown, ChevronRight, ChevronLeft, Folder as FolderIcon, 
  FileText, Trash2, Clock, Settings, Sparkles, Plus, BookOpen, Trash, Globe, Search
} from "lucide-react";
import MusicPlayer from "./MusicPlayer";
import { TranslationDictionary } from "../translations";
import SearchModal from "./SearchModal";

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeView: "editor" | "history" | "trash" | "settings";
  activeNoteId: string | null;
  profile: UserProfile;
  activeTourStep?: number | null;
  isCollapsed: boolean;
  language: "en" | "zh";
  onToggleLanguage: () => void;
  t: TranslationDictionary;
  onToggleCollapse: () => void;
  onSelectView: (view: "editor" | "history" | "trash" | "settings") => void;
  onSelectNote: (noteId: string, highlightQuery?: string) => void;
  onAddFolder: (name: string, parentId?: string | null) => void;
  onAddNote: (folderId: string | null) => void;
  onDeleteNote: (noteId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveNote: (noteId: string, folderId: string | null) => void;
  onMoveFolder: (folderId: string, parentId: string | null) => void;
  isLoading?: boolean;
  onShowNotification?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  isScribeView?: boolean;
}

export default function Sidebar({
  folders,
  notes,
  activeView,
  activeNoteId,
  profile,
  activeTourStep = null,
  isCollapsed,
  language,
  onToggleLanguage,
  t,
  onToggleCollapse,
  onSelectView,
  onSelectNote,
  onAddFolder,
  onAddNote,
  onDeleteNote,
  onDeleteFolder,
  onMoveNote,
  onMoveFolder,
  isLoading = false,
  onShowNotification,
  isScribeView = false,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [activeSubfolderParentId, setActiveSubfolderParentId] = useState<string | null>(null);
  const [newSubfolderName, setNewSubfolderName] = useState("");

  const [searchVal, setSearchVal] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setActiveSearchQuery(searchVal.trim());
      setIsSearchOpen(true);
    }
  };

  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [dragOverRootFolders, setDragOverRootFolders] = useState(false);
  const [dragOverRootNotes, setDragOverRootNotes] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleAddFolderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), null);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleAddSubfolderSubmit = (e: FormEvent, parentId: string) => {
    e.preventDefault();
    if (newSubfolderName.trim()) {
      onAddFolder(newSubfolderName.trim(), parentId);
      setNewSubfolderName("");
      setActiveSubfolderParentId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, type: "note" | "folder", id: string) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", JSON.stringify({ type, id }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverFolderId(null);
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const { type, id } = JSON.parse(dataStr);

      if (type === "note") {
        onMoveNote(id, targetFolderId);
      } else if (type === "folder") {
        if (id === targetFolderId) {
          onShowNotification?.("Cannot move a folder into itself.", "warning");
          return;
        }

        // Cycle check: make sure target is not a descendant of dragged folder
        let currentParentId: string | null | undefined = targetFolderId;
        while (currentParentId) {
          if (currentParentId === id) {
            onShowNotification?.("Cannot move a folder into its own subfolders.", "warning");
            return;
          }
          const parent = folders.find(f => f.id === currentParentId);
          currentParentId = parent?.parentId;
        }

        onMoveFolder(id, targetFolderId);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverRootFolders(false);
    setDragOverRootNotes(false);
    try {
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const { type, id } = JSON.parse(dataStr);

      if (type === "note") {
        onMoveNote(id, null);
      } else if (type === "folder") {
        onMoveFolder(id, null);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  // Filter out items in the trash
  const activeFolders = folders.filter(f => f.deletedAt === null);
  const activeNotes = notes.filter(n => n.deletedAt === null);

  // Group standalone notes
  const standaloneNotes = activeNotes.filter(n => n.folderId === null);

  // Filter out top-level folders (those without active parents)
  const isRootFolder = (f: Folder) => {
    if (!f.parentId) return true;
    return !activeFolders.some(parent => parent.id === f.parentId);
  };
  const rootFolders = activeFolders.filter(isRootFolder);

  // Recursive folder tree item renderer
  const renderFolderItem = (folder: Folder, depth: number = 0) => {
    const subfolders = activeFolders.filter(f => f.parentId === folder.id);
    const nestedNotes = activeNotes.filter(n => n.folderId === folder.id);
    const isExpanded = !!expandedFolders[folder.id];
    const isDragOver = dragOverFolderId === folder.id;

    return (
      <div 
        key={folder.id} 
        className="space-y-1"
      >
        {/* Folder Item Row */}
        <div 
          draggable="true"
          onDragStart={(e) => handleDragStart(e, "folder", folder.id)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => {
            e.stopPropagation();
            setDragOverFolderId(folder.id);
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            if (dragOverFolderId === folder.id) {
              setDragOverFolderId(null);
            }
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDropOnFolder(e, folder.id);
          }}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          className={`flex items-center justify-between group py-1.5 rounded-lg transition-all border border-transparent ${
            isDragOver 
              ? "bg-[#D97757]/20 border-[#D97757]/50 shadow-inner" 
              : "hover:bg-[#EEEDE9]/5"
          }`}
        >
          <button
            id={`btn-folder-toggle-${folder.id}`}
            onClick={() => toggleFolder(folder.id)}
            className="flex-grow flex items-center gap-2 text-xs font-medium text-[#EEEDE9]/90 text-left transition-colors cursor-pointer min-w-0"
          >
            {isExpanded || subfolders.length > 0 || nestedNotes.length > 0 ? (
              isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#EEEDE9]/50 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#EEEDE9]/50 shrink-0" />
              )
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-0 shrink-0" />
            )}
            <FolderIcon className="w-4 h-4 text-[#E0D4C1] shrink-0" />
            <span className="truncate">{folder.name}</span>
            {(nestedNotes.length > 0 || subfolders.length > 0) && (
              <span className="text-[10px] font-mono text-[#EEEDE9]/40 bg-[#EEEDE9]/10 px-1.5 rounded-full shrink-0">
                {nestedNotes.length + subfolders.length}
              </span>
            )}
          </button>

          {/* Folder Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 pr-1.5 shrink-0 transition-opacity">
            <button
              id={`btn-add-subfolder-${folder.id}`}
              onClick={() => {
                setActiveSubfolderParentId(folder.id);
                setNewSubfolderName("");
                if (!isExpanded) toggleFolder(folder.id);
              }}
              className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/65 hover:text-[#D97757] transition-colors cursor-pointer"
              title={t.createSubfolder}
            >
              <FolderPlus className="w-3 h-3" />
            </button>
            <button
              id={`btn-add-note-to-folder-${folder.id}`}
              onClick={() => {
                onAddNote(folder.id);
                if (!isExpanded) toggleFolder(folder.id);
              }}
              className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/65 hover:text-white transition-colors cursor-pointer"
              title={t.newNoteInFolder}
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              id={`btn-delete-folder-${folder.id}`}
              onClick={() => onDeleteFolder(folder.id)}
              className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/65 hover:text-red-400 transition-colors cursor-pointer"
              title={t.deleteFolder}
            >
              <Trash className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Inline subfolder input creator */}
        {activeSubfolderParentId === folder.id && (
          <form 
            onSubmit={(e) => handleAddSubfolderSubmit(e, folder.id)} 
            style={{ marginLeft: `${depth * 14 + 28}px` }}
            className="mr-2 py-1 flex gap-1 bg-[#EEEDE9]/5 border border-[#EEEDE9]/10 rounded px-1.5"
          >
            <input
              autoFocus
              type="text"
              placeholder={t.newSubfolderNamePlaceholder}
              value={newSubfolderName}
              onChange={(e) => setNewSubfolderName(e.target.value)}
              className="flex-grow bg-[#141413] border border-[#EEEDE9]/20 rounded px-2 py-0.5 text-[11px] text-[#EEEDE9] focus:outline-none focus:border-[#D97757]"
            />
            <button
              type="submit"
              className="px-1.5 py-0.5 bg-[#D97757] text-white rounded text-[9px] uppercase font-mono cursor-pointer shrink-0"
            >
              {t.createButton}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubfolderParentId(null)}
              className="px-1.5 py-0.5 bg-[#EEEDE9]/10 text-[#EEEDE9]/70 rounded text-[9px] uppercase font-mono cursor-pointer shrink-0"
            >
              {t.cancelButton}
            </button>
          </form>
        )}

        {/* Nested folders/notes content */}
        {isExpanded && (
          <div className="space-y-1">
            {/* Render nested subfolders recursively */}
            {subfolders.map(subfolder => renderFolderItem(subfolder, depth + 1))}

            {/* Render nested notes */}
            {nestedNotes.map((note) => (
              <div
                key={note.id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, "note", note.id)}
                style={{ paddingLeft: `${(depth + 1) * 14 + 18}px` }}
                className={`flex items-center justify-between group rounded-md py-1.5 text-xs transition-all border border-transparent ${
                  activeView === "editor" && activeNoteId === note.id
                    ? "bg-[#EEEDE9]/15 text-[#EEEDE9] font-medium"
                    : "text-[#EEEDE9]/65 hover:bg-[#EEEDE9]/5 hover:text-[#EEEDE9]"
                }`}
              >
                <button
                  id={`btn-select-nested-note-${note.id}`}
                  onClick={() => {
                    onSelectView("editor");
                    onSelectNote(note.id);
                  }}
                  className="flex-grow flex items-center gap-1.5 text-left truncate cursor-pointer min-w-0"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E0D4C1]/60 shrink-0" />
                  <span className="truncate">{note.title || (language === "en" ? "Untitled Writing" : "无标题笔记")}</span>
                </button>

                <button
                  id={`btn-delete-nested-note-${note.id}`}
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/55 hover:text-red-400 transition-all cursor-pointer mr-1 shrink-0"
                  title={t.deleteNote}
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
            ))}

            {subfolders.length === 0 && nestedNotes.length === 0 && (
              <div 
                style={{ paddingLeft: `${(depth + 1) * 14 + 18}px` }}
                className="text-[10px] text-[#EEEDE9]/30 italic py-1"
              >
                {t.emptyVessel}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-full bg-[#141413] text-[#EEEDE9] flex flex-col border-r border-[#141413]/10 font-sans select-none shrink-0 relative transition-all duration-300 ${
      isCollapsed ? "w-0 border-r-0" : "w-80"
    }`}>
      {/* Absolute Toggle Button hanging on the right edge */}
      {!isLoading && !isScribeView && (
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleCollapse}
          className="absolute top-6 -right-3.5 z-50 flex items-center justify-center w-7 h-7 bg-[#141413] hover:bg-[#252421] text-[#EEEDE9] hover:text-[#D97757] border border-[#EEEDE9]/10 rounded-full shadow-md transition-all cursor-pointer focus:outline-none"
          title={isCollapsed ? "Show Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Internal Content wrapped to preserve layout width when collapsing */}
      <div className={`flex flex-col h-full w-80 transition-opacity duration-200 ${
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        {/* Brand Title Block */}
      <div className="p-6 border-b border-[#EEEDE9]/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#D97757] text-[#EEEDE9] p-2 rounded-lg glow-terracotta">
            <FeatherIcon />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold tracking-wide">Scribe</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#E0D4C1] uppercase">Creative Sounding Board</p>
          </div>
        </div>
      </div>

      {/* Creation Actions bar */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2 border-b border-[#EEEDE9]/10">
        <button
          id="btn-sidebar-new-note"
          onClick={() => onAddNote(null)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#D97757] hover:bg-[#c46546] text-white rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm"
        >
          <FilePlus className="w-3.5 h-3.5" /> Note
        </button>
        <button
          id="btn-sidebar-new-folder"
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EEEDE9]/10 hover:bg-[#EEEDE9]/20 text-[#EEEDE9] rounded-lg text-xs font-medium transition-all cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" /> Folder
        </button>
      </div>

      {/* Folder Name Creator Overlay */}
      {isCreatingFolder && (
        <form onSubmit={handleAddFolderSubmit} className="p-3 bg-[#EEEDE9]/5 border-b border-[#EEEDE9]/10 flex gap-2">
          <input
            id="input-new-folder-name"
            autoFocus
            type="text"
            placeholder={t.newFolderNamePlaceholder}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-grow bg-[#141413] border border-[#EEEDE9]/20 rounded px-2.5 py-1 text-xs text-[#EEEDE9] focus:outline-none focus:border-[#D97757]"
          />
          <button
            id="btn-confirm-new-folder"
            type="submit"
            className="px-2 py-1 bg-[#D97757] text-white rounded text-[10px] uppercase font-mono cursor-pointer"
          >
            {t.createButton}
          </button>
          <button
            id="btn-cancel-new-folder"
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="px-2 py-1 bg-[#EEEDE9]/10 text-[#EEEDE9]/70 rounded text-[10px] uppercase font-mono cursor-pointer"
          >
            {t.cancelButton}
          </button>
        </form>
      )}

      {/* Primary Navigation / Tree List */}
      <div className="flex-grow overflow-y-auto px-2 py-4 space-y-5">
        
        {/* Search field located above Chronicles */}
        <div className="px-1.5">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={language === "en" ? "Search notes & folders..." : "搜索笔记与文件夹..."}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-[#EEEDE9]/5 hover:bg-[#EEEDE9]/10 focus:bg-[#EEEDE9]/10 border border-[#EEEDE9]/10 hover:border-[#EEEDE9]/20 focus:border-[#D97757]/60 rounded-xl pl-9 pr-3 py-2 text-xs text-[#EEEDE9] focus:outline-none transition-all placeholder-[#EEEDE9]/30"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#EEEDE9]/40" />
            <span className="absolute right-3 top-2.5 text-[9px] font-mono text-[#EEEDE9]/20 pointer-events-none select-none">
              ↵
            </span>
          </form>
        </div>

        {/* Navigation Tabs */}
        <div className={`space-y-1 p-1.5 rounded-xl transition-all duration-300 ${
          activeTourStep === 2 
            ? "ring-2 ring-[#D97757] bg-[#EEEDE9]/5 shadow-[0_0_15px_rgba(217,119,87,0.4)] relative z-50 animate-pulse" 
            : ""
        }`}>
          <button
            id="nav-history"
            onClick={() => onSelectView("history")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeView === "history" 
                ? "bg-[#D97757] text-white" 
                : "text-[#EEEDE9]/75 hover:bg-[#EEEDE9]/10 hover:text-[#EEEDE9]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {t.history}
            </span>
          </button>

          <button
            id="nav-trash"
            onClick={() => onSelectView("trash")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeView === "trash" 
                ? "bg-[#D97757] text-white" 
                : "text-[#EEEDE9]/75 hover:bg-[#EEEDE9]/10 hover:text-[#EEEDE9]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> {t.trash}
            </span>
          </button>

          <button
            id="nav-settings"
            onClick={() => onSelectView("settings")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeView === "settings" 
                ? "bg-[#D97757] text-white" 
                : "text-[#EEEDE9]/75 hover:bg-[#EEEDE9]/10 hover:text-[#EEEDE9]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> {t.settings}
            </span>
          </button>
        </div>

        {/* Folders & Notes Navigation list */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDragOverRootFolders(true)}
          onDragLeave={() => setDragOverRootFolders(false)}
          onDrop={handleDropOnRoot}
          className={`space-y-3 p-1.5 rounded-xl border border-transparent transition-all duration-300 ${
            activeTourStep === 1 
              ? "ring-2 ring-[#D97757] bg-[#EEEDE9]/5 shadow-[0_0_15px_rgba(217,119,87,0.4)] relative z-50 animate-pulse" 
              : ""
          } ${dragOverRootFolders ? "border-[#D97757]/30 bg-[#EEEDE9]/5" : ""}`}
        >
          <h2 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#EEEDE9]/40 font-bold flex justify-between items-center">
            <span>{t.foldersHeader}</span>
            {dragOverRootFolders && <span className="text-[9px] text-[#D97757] font-mono lowercase">{t.dragToRoot}</span>}
          </h2>

          <div className="space-y-1">
            {rootFolders.map((folder) => renderFolderItem(folder, 0))}
            {activeFolders.length === 0 && (
              <p className="px-3 py-2 text-[10px] text-[#EEEDE9]/30 italic">{t.noFoldersYet}</p>
            )}
          </div>
        </div>

        {/* Standalone Notes Section */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDragOverRootNotes(true)}
          onDragLeave={() => setDragOverRootNotes(false)}
          onDrop={handleDropOnRoot}
          className={`space-y-2 p-1.5 rounded-xl border border-transparent transition-all duration-300 ${
            dragOverRootNotes ? "border-[#D97757]/30 bg-[#EEEDE9]/5" : ""
          }`}
        >
          <h2 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#EEEDE9]/40 font-bold flex justify-between items-center">
            <span>{t.standaloneHeader}</span>
            {dragOverRootNotes && <span className="text-[9px] text-[#D97757] font-mono lowercase">{t.dragToUnnest}</span>}
          </h2>

          <div className="space-y-1">
            {standaloneNotes.length === 0 ? (
              <p className="px-3 py-2 text-[10px] text-[#EEEDE9]/30 italic">{t.noNotesYet}</p>
            ) : (
              standaloneNotes.map((note) => (
                <div
                  key={note.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, "note", note.id)}
                  className={`flex items-center justify-between group rounded-lg px-3 py-2 text-xs transition-all border border-transparent ${
                    activeView === "editor" && activeNoteId === note.id
                      ? "bg-[#EEEDE9]/15 text-[#EEEDE9] font-medium"
                      : "text-[#EEEDE9]/65 hover:bg-[#EEEDE9]/5 hover:text-[#EEEDE9]"
                  }`}
                >
                  <button
                    id={`btn-select-standalone-${note.id}`}
                    onClick={() => {
                      onSelectView("editor");
                      onSelectNote(note.id);
                    }}
                    className="flex-grow flex items-center gap-2 text-left truncate cursor-pointer min-w-0"
                  >
                    <FileText className="w-4 h-4 text-[#E0D4C1]/60 shrink-0" />
                    <span className="truncate">{note.title || (language === "en" ? "Untitled Writing" : "无标题笔记")}</span>
                  </button>

                  <button
                    id={`btn-delete-standalone-${note.id}`}
                    onClick={() => onDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/55 hover:text-red-400 transition-all cursor-pointer shrink-0"
                    title={t.deleteNote}
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Scribe Ambient Gramophone integrated above settings */}
      <div className={`px-3 py-1.5 border-t border-[#EEEDE9]/10 rounded-xl transition-all duration-300 ${
        activeTourStep === 3 
          ? "ring-2 ring-[#D97757] bg-[#EEEDE9]/5 shadow-[0_0_15px_rgba(217,119,87,0.4)] relative z-50 animate-pulse" 
          : ""
      }`}>
        <MusicPlayer onShowNotification={onShowNotification} isSidebarCollapsed={isCollapsed} />
      </div>

      {/* User settings Quick indicator bottom */}
      <div className={`border-t border-[#EEEDE9]/10 flex flex-col p-3 rounded-xl transition-all duration-300 ${
        activeTourStep === 4 
          ? "ring-2 ring-[#D97757] bg-[#EEEDE9]/5 shadow-[0_0_15px_rgba(217,119,87,0.4)] relative z-50 animate-pulse" 
          : ""
      }`}>
        <div 
          id="btn-sidebar-profile"
          onClick={() => onSelectView("settings")}
          className="w-full flex items-center gap-2.5 hover:bg-[#EEEDE9]/5 p-1 rounded-lg transition-all cursor-pointer select-none min-w-0"
        >
          {profile.avatarUrl ? (
            <img 
              src={profile.avatarUrl} 
              alt="Pen avatar" 
              className="w-8.5 h-8.5 rounded-full object-cover border border-[#E0D4C1]/40 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8.5 h-8.5 rounded-full bg-[#E0D4C1]/30 flex items-center justify-center border border-[#E0D4C1]/40 text-[#D97757] font-serif font-bold shrink-0">
              {profile.name ? profile.name[0].toUpperCase() : "S"}
            </div>
          )}
          <div className="min-w-0 flex-grow">
            <h3 className="text-xs font-serif font-semibold text-[#EEEDE9] truncate">{profile.name || (language === "en" ? "Scribe Quill" : "笔墨墨客")}</h3>
            <p className="text-[9px] font-mono text-[#E0D4C1]/60 truncate">{profile.bio || (language === "en" ? "Crafting thoughts offline..." : "离线记录创作思绪...")}</p>
          </div>
        </div>

        {/* Scribe International Language Switch Button */}
        <button
          id="btn-toggle-language"
          type="button"
          onClick={onToggleLanguage}
          className="w-full mt-2.5 flex items-center justify-between gap-2 bg-[#EEEDE9]/5 hover:bg-[#EEEDE9]/10 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none text-[10px] font-mono text-[#E0D4C1]/70 hover:text-[#EEEDE9] border border-[#EEEDE9]/5"
          title="Scribe International - Change Language / 切换语言"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Scribe International</span>
          </div>
          <span className="font-bold text-[#D97757] bg-[#D97757]/15 px-1.5 py-0.5 rounded text-[9px]">
            {language === "en" ? "ENGLISH" : "中文"}
          </span>
        </button>


      </div>
    </div>

    {/* Search Modal component overlay */}
    <SearchModal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      query={activeSearchQuery}
      notes={notes}
      folders={folders}
      onSelectNote={onSelectNote}
      onSelectView={onSelectView}
      language={language}
    />
    </div>
  );
}

// Custom simple logo icon inline
function FeatherIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}
