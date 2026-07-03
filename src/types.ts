export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null; // null means standalone note
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; // if in trash, holds deletion ISO timestamp
  isFavorite?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  deletedAt: string | null; // if in trash, holds deletion ISO timestamp
}

export interface HistoryItem {
  id: string;
  type: "create" | "edit" | "delete" | "restore" | "permanent_delete";
  itemType: "note" | "folder";
  itemName: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  aiModel: "gemini" | "claude" | "openai";
  apiKey: string;
  aiUsageLimit?: number;
}
