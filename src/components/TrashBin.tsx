import { motion } from "motion/react";
import { Note, Folder } from "../types";
import { Trash2, RotateCcw, AlertTriangle, FileText, FolderOpen, AlertCircle } from "lucide-react";

interface TrashBinProps {
  deletedNotes: Note[];
  deletedFolders: Folder[];
  onRestoreNote: (noteId: string) => void;
  onRestoreFolder: (folderId: string) => void;
  onPermanentDeleteNote: (noteId: string) => void;
  onPermanentDeleteFolder: (folderId: string) => void;
  onEmptyTrash: () => void;
}

export default function TrashBin({
  deletedNotes,
  deletedFolders,
  onRestoreNote,
  onRestoreFolder,
  onPermanentDeleteNote,
  onPermanentDeleteFolder,
  onEmptyTrash,
}: TrashBinProps) {
  const hasItems = deletedNotes.length > 0 || deletedFolders.length > 0;

  // Simulate days remaining based on deletion date (or fall back to mock)
  const getDaysRemaining = (deletedAt: string | null) => {
    if (!deletedAt) return 30;
    const deletionDate = new Date(deletedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - deletionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Simulated 30 days countdown. Just subtract the diffDays (default 1-3 if very fresh)
    const remaining = 30 - (diffDays > 0 ? diffDays - 1 : 0);
    return Math.max(1, Math.min(30, remaining));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#141413] dark:text-[#ECEAE4] mb-2 flex items-center gap-2.5">
            <Trash2 className="w-8 h-8 text-[#D97757]" /> The Trash Sanctuary
          </h1>
          <p className="text-sm text-[#141413]/60 dark:text-[#ECEAE4]/60">
            Letting go doesn't have to be instant. Items here will be permanently dissolved after 30 days. Restore them, or wipe them clean forever.
          </p>
        </div>

        {hasItems && (
          <button
            id="btn-empty-trash"
            onClick={onEmptyTrash}
            className="px-4 py-2 bg-red-600/10 border border-red-600/20 text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Empty All Items
          </button>
        )}
      </div>

      {!hasItems ? (
        <div className="border border-dashed border-[#E0D4C1] dark:border-[#33322E] bg-[#EEEDE9]/40 dark:bg-[#252421]/30 p-12 rounded-xl text-center">
          <Trash2 className="w-12 h-12 text-[#E0D4C1] dark:text-[#33322E] mx-auto mb-4" />
          <p className="text-base font-serif font-medium text-[#141413]/70 dark:text-[#ECEAE4]/70">Your trash bin is empty</p>
          <p className="text-xs text-[#141413]/40 dark:text-[#ECEAE4]/40 mt-1">When notes or folders are discarded, they rest here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="bg-[#D97757]/10 border border-[#D97757]/20 text-[#D97757] p-4 rounded-xl flex gap-3 items-center text-xs font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Writings here are set to permanently decompose. Leaving items in the trash is safe, but emptying or manual deletion will delete them immediately.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deleted Folders Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase flex items-center gap-1.5 border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80 pb-2">
                <FolderOpen className="w-3.5 h-3.5" /> Discarded Folders ({deletedFolders.length})
              </h2>

              {deletedFolders.length === 0 ? (
                <p className="text-xs text-[#141413]/40 dark:text-[#ECEAE4]/40 italic py-4">No folders in the trash.</p>
              ) : (
                <div className="space-y-3">
                  {deletedFolders.map((folder) => {
                    const remaining = getDaysRemaining(folder.deletedAt);
                    return (
                      <motion.div
                        layout
                        key={folder.id}
                        className="bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] p-4 rounded-xl flex justify-between items-center group shadow-sm hover:border-[#D97757]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#E0D4C1]/40 dark:bg-[#33322E]/50 p-2 rounded-lg text-[#141413]/70 dark:text-[#ECEAE4]/70">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-[#141413] dark:text-[#ECEAE4] font-serif">{folder.name}</h3>
                            <div className="flex items-center gap-1 text-[11px] text-[#D97757] font-mono mt-0.5">
                              <AlertCircle className="w-3 h-3" />
                              <span>{remaining} days remaining</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`btn-restore-folder-${folder.id}`}
                            onClick={() => onRestoreFolder(folder.id)}
                            className="p-1.5 rounded-lg hover:bg-[#E0D4C1] dark:hover:bg-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:text-green-700 transition-colors cursor-pointer"
                            title="Restore Folder and notes"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-folder-perm-${folder.id}`}
                            onClick={() => onPermanentDeleteFolder(folder.id)}
                            className="p-1.5 rounded-lg hover:bg-[#E0D4C1] dark:hover:bg-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Deleted Notes Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono tracking-wider text-[#141413]/60 dark:text-[#ECEAE4]/60 uppercase flex items-center gap-1.5 border-b border-[#E0D4C1]/60 dark:border-[#33322E]/80 pb-2">
                <FileText className="w-3.5 h-3.5" /> Discarded Notes ({deletedNotes.length})
              </h2>

              {deletedNotes.length === 0 ? (
                <p className="text-xs text-[#141413]/40 dark:text-[#ECEAE4]/40 italic py-4">No notes in the trash.</p>
              ) : (
                <div className="space-y-3">
                  {deletedNotes.map((note) => {
                    const remaining = getDaysRemaining(note.deletedAt);
                    return (
                      <motion.div
                        layout
                        key={note.id}
                        className="bg-[#EEEDE9] dark:bg-[#252421] border border-[#E0D4C1] dark:border-[#33322E] p-4 rounded-xl flex justify-between items-center group shadow-sm hover:border-[#D97757]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-[#E0D4C1]/40 dark:bg-[#33322E]/50 p-2 rounded-lg text-[#141413]/70 dark:text-[#ECEAE4]/70">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="max-w-[180px] sm:max-w-xs">
                            <h3 className="text-sm font-medium text-[#141413] dark:text-[#ECEAE4] font-serif truncate">
                              {note.title || "Untitled Writing"}
                            </h3>
                            <div className="flex items-center gap-1 text-[11px] text-[#D97757] font-mono mt-0.5">
                              <AlertCircle className="w-3 h-3" />
                              <span>{remaining} days remaining</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`btn-restore-note-${note.id}`}
                            onClick={() => onRestoreNote(note.id)}
                            className="p-1.5 rounded-lg hover:bg-[#E0D4C1] dark:hover:bg-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:text-green-700 transition-colors cursor-pointer"
                            title="Restore Note"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-note-perm-${note.id}`}
                            onClick={() => onPermanentDeleteNote(note.id)}
                            className="p-1.5 rounded-lg hover:bg-[#E0D4C1] dark:hover:bg-[#33322E] text-[#141413]/70 dark:text-[#ECEAE4]/70 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
