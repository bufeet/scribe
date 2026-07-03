import { useState, FormEvent } from "react";
import { Folder, Note, UserProfile } from "../types";
import { 
  FolderPlus, FilePlus, ChevronDown, ChevronRight, ChevronLeft, Folder as FolderIcon, 
  FileText, Trash2, Clock, Settings, Sparkles, Plus, BookOpen, Trash
} from "lucide-react";
import MusicPlayer from "./MusicPlayer";

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeView: "editor" | "history" | "trash" | "settings";
  activeNoteId: string | null;
  profile: UserProfile;
  activeTourStep?: number | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectView: (view: "editor" | "history" | "trash" | "settings") => void;
  onSelectNote: (noteId: string) => void;
  onAddFolder: (name: string) => void;
  onAddNote: (folderId: string | null) => void;
  onDeleteNote: (noteId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  isLoading?: boolean;
  onShowNotification?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

export default function Sidebar({
  folders,
  notes,
  activeView,
  activeNoteId,
  profile,
  activeTourStep = null,
  isCollapsed,
  onToggleCollapse,
  onSelectView,
  onSelectNote,
  onAddFolder,
  onAddNote,
  onDeleteNote,
  onDeleteFolder,
  isLoading = false,
  onShowNotification,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleAddFolderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  // Filter out items in the trash
  const activeFolders = folders.filter(f => f.deletedAt === null);
  const activeNotes = notes.filter(n => n.deletedAt === null);

  const standaloneNotes = activeNotes.filter(n => n.folderId === null);

  return (
    <div className={`h-full bg-[#141413] text-[#EEEDE9] flex flex-col border-r border-[#141413]/10 font-sans select-none shrink-0 relative transition-all duration-300 ${
      isCollapsed ? "w-0 border-r-0" : "w-80"
    }`}>
      {/* Absolute Toggle Button hanging on the right edge */}
      {!isLoading && (
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
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-grow bg-[#141413] border border-[#EEEDE9]/20 rounded px-2.5 py-1 text-xs text-[#EEEDE9] focus:outline-none focus:border-[#D97757]"
          />
          <button
            id="btn-confirm-new-folder"
            type="submit"
            className="px-2 py-1 bg-[#D97757] text-white rounded text-[10px] uppercase font-mono cursor-pointer"
          >
            Create
          </button>
          <button
            id="btn-cancel-new-folder"
            type="button"
            onClick={() => setIsCreatingFolder(false)}
            className="px-2 py-1 bg-[#EEEDE9]/10 text-[#EEEDE9]/70 rounded text-[10px] uppercase font-mono cursor-pointer"
          >
            X
          </button>
        </form>
      )}

      {/* Primary Navigation / Tree List */}
      <div className="flex-grow overflow-y-auto px-2 py-4 space-y-5">
        
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
              <Clock className="w-4 h-4" /> Activity Chronicles
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
              <Trash2 className="w-4 h-4" /> Trash Sanctuary
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
              <Settings className="w-4 h-4" /> Sanctuary Settings
            </span>
          </button>
        </div>

        {/* Folders & Notes Navigation list */}
        <div className={`space-y-3 p-1.5 rounded-xl transition-all duration-300 ${
          activeTourStep === 1 
            ? "ring-2 ring-[#D97757] bg-[#EEEDE9]/5 shadow-[0_0_15px_rgba(217,119,87,0.4)] relative z-50 animate-pulse" 
            : ""
        }`}>
          <h2 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#EEEDE9]/40 font-bold">
            Folders & Vessels
          </h2>

          <div className="space-y-1">
            {activeFolders.map((folder) => {
              const nestedNotes = activeNotes.filter(n => n.folderId === folder.id);
              const isExpanded = !!expandedFolders[folder.id];

              return (
                <div key={folder.id} className="space-y-1">
                  {/* Folder Row */}
                  <div className="flex items-center justify-between group px-2 py-1.5 rounded-lg hover:bg-[#EEEDE9]/5 transition-all">
                    <button
                      id={`btn-folder-toggle-${folder.id}`}
                      onClick={() => toggleFolder(folder.id)}
                      className="flex-grow flex items-center gap-2 text-xs font-medium text-[#EEEDE9]/90 text-left transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#EEEDE9]/50" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#EEEDE9]/50" />
                      )}
                      <FolderIcon className="w-4 h-4 text-[#E0D4C1]" />
                      <span className="truncate">{folder.name}</span>
                      <span className="text-[10px] font-mono text-[#EEEDE9]/40 bg-[#EEEDE9]/10 px-1.5 rounded-full">
                        {nestedNotes.length}
                      </span>
                    </button>

                    {/* Folder Quick Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        id={`btn-add-note-to-folder-${folder.id}`}
                        onClick={() => {
                          onAddNote(folder.id);
                          if (!isExpanded) toggleFolder(folder.id);
                        }}
                        className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/65 hover:text-white transition-colors cursor-pointer"
                        title="New note in folder"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        id={`btn-delete-folder-${folder.id}`}
                        onClick={() => onDeleteFolder(folder.id)}
                        className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/65 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Folder"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Folder Nested Notes */}
                  {isExpanded && (
                    <div className="pl-4 border-l border-[#EEEDE9]/10 ml-3.5 space-y-1 py-0.5">
                      {nestedNotes.length === 0 ? (
                        <div className="text-[10px] text-[#EEEDE9]/30 italic px-3 py-1">Empty vessel</div>
                      ) : (
                        nestedNotes.map((note) => (
                          <div
                            key={note.id}
                            className={`flex items-center justify-between group rounded-md px-2.5 py-1.5 text-xs transition-all ${
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
                              className="flex-grow flex items-center gap-1.5 text-left truncate cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#E0D4C1]/60" />
                              <span className="truncate">{note.title || "Untitled Writing"}</span>
                            </button>

                            <button
                              id={`btn-delete-nested-note-${note.id}`}
                              onClick={() => onDeleteNote(note.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/55 hover:text-red-400 transition-all cursor-pointer"
                              title="Delete Note"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Standalone Notes Section */}
        <div className="space-y-2">
          <h2 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#EEEDE9]/40 font-bold">
            Standalone Notes
          </h2>

          <div className="space-y-1">
            {standaloneNotes.length === 0 ? (
              <p className="px-3 py-2 text-[10px] text-[#EEEDE9]/30 italic">No free-floating notes.</p>
            ) : (
              standaloneNotes.map((note) => (
                <div
                  key={note.id}
                  className={`flex items-center justify-between group rounded-lg px-3 py-2 text-xs transition-all ${
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
                    className="flex-grow flex items-center gap-2 text-left truncate cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#E0D4C1]/60" />
                    <span className="truncate">{note.title || "Untitled Writing"}</span>
                  </button>

                  <button
                    id={`btn-delete-standalone-${note.id}`}
                    onClick={() => onDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/55 hover:text-red-400 transition-all cursor-pointer"
                    title="Delete Note"
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
          className="w-full flex items-center gap-2.5 hover:bg-[#EEEDE9]/5 p-1 rounded-lg transition-all cursor-pointer select-none min-w-0 mb-2"
        >
          <div className="w-8.5 h-8.5 rounded-full bg-[#E0D4C1]/30 flex items-center justify-center border border-[#E0D4C1]/40 text-[#D97757] font-serif font-bold shrink-0">
            {profile.name ? profile.name[0].toUpperCase() : "S"}
          </div>
          <div className="min-w-0 flex-grow">
            <h3 className="text-xs font-serif font-semibold text-[#EEEDE9] truncate">{profile.name || "Scribe Quill"}</h3>
            <p className="text-[9px] font-mono text-[#E0D4C1]/60 truncate">{profile.bio || "Crafting thoughts offline..."}</p>
          </div>
        </div>

        {/* Creator Credits */}
        <div className="pt-2 text-center text-[9px] font-mono text-[#EEEDE9]/35 border-t border-[#EEEDE9]/5 flex flex-col gap-0.5">
          <div>All credits belong to <a href="https://linkedin.com/in/joalx" target="_blank" rel="noopener noreferrer" className="text-[#D97757] hover:underline hover:text-[#c46546] font-semibold">João Leite (@joalx)</a></div>
        </div>
      </div>
    </div>
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
