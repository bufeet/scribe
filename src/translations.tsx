export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  editor: string;
  history: string;
  trash: string;
  settings: string;
  foldersHeader: string;
  standaloneHeader: string;
  emptyVessel: string;
  noFoldersYet: string;
  noNotesYet: string;
  createSubfolder: string;
  newNoteInFolder: string;
  deleteFolder: string;
  deleteNote: string;
  dragToRoot: string;
  dragToUnnest: string;
  newFolderNamePlaceholder: string;
  newSubfolderNamePlaceholder: string;
  createButton: string;
  cancelButton: string;
  // Settings view
  settingsTitle: string;
  settingsSubtitle: string;
  blockProfileTitle: string;
  blockProfileDesc: string;
  blockAiTitle: string;
  blockAiDesc: string;
  blockDataTitle: string;
  blockDataDesc: string;
  penNameLabel: string;
  penNamePlaceholder: string;
  bioLabel: string;
  bioPlaceholder: string;
  saveProfileBtn: string;
  saveAiBtn: string;
  selectedBrainLabel: string;
  customApiKeyLabel: string;
  customApiKeyPlaceholder: string;
  activeSystemKey: string;
  aiHourlyLimitLabel: string;
  aiHourlyLimitDesc: string;
  currentUsageRateLabel: string;
  resetsInMinutes: string;
  noActiveCycle: string;
  verifyConnectionBtn: string;
  verifyingConnection: string;
  connectionSuccess: string;
  connectionError: string;
  exportSanctuaryTitle: string;
  exportSanctuaryDesc: string;
  exportSanctuaryStats: string;
  exportSanctuaryBtn: string;
  importRecoveryTitle: string;
  importRecoveryDesc: string;
  importRecoveryPlaceholder: string;
  importDocsTitle: string;
  importDocsDesc: string;
  importDocsPlaceholder: string;
  dragDropCoverText: string;
  dragDropCoverHover: string;
  dragDropAvatarHover: string;
  uploadCoverBtn: string;
  uploadAvatarBtn: string;
  dragHint: string;
  // Encryption / Decryption Modal
  encryptionTitle: string;
  encryptionProcessing: string;
  decryptionTitle: string;
  decryptionProcessing: string;
  securingData: string;
  restoringSanctuary: string;
  bytesSecured: string;
  integrityChecked: string;
  successComplete: string;
  // Notifications
  profileUpdatedNotif: string;
  coverUpdatedNotif: string;
  avatarUpdatedNotif: string;
  modelConfigSavedNotif: string;
  backupSuccessNotif: string;
  backupErrorNotif: string;
  invalidBackupNotif: string;
  noScribeDataNotif: string;
  restoreSuccessNotif: string;
  restoreErrorNotif: string;
  folderIntoItselfNotif: string;
  folderIntoDescendantNotif: string;
  importDocSuccessNotif: string;
  importDocErrorNotif: string;
  unsupportedDocNotif: string;
  // Trash view
  trashTitle: string;
  trashSubtitle: string;
  emptyTrashBtn: string;
  emptyTrashTitle: string;
  emptyTrashDesc: string;
  trashWarning: string;
  discardedFolders: string;
  discardedNotes: string;
  noDiscardedFolders: string;
  noDiscardedNotes: string;
  daysRemaining: string;
  restoreFolderTooltip: string;
  restoreNoteTooltip: string;
  deletePermanentlyTooltip: string;
  // History / chronicles view
  historyTitle: string;
  historySubtitle: string;
  clearHistoryBtn: string;
  emptyHistoryTitle: string;
  emptyHistoryDesc: string;
  searchHistoryPlaceholder: string;
  noHistoryMatches: string;
  actionLabelCreateNote: string;
  actionLabelCreateFolder: string;
  actionLabelEditNote: string;
  actionLabelEditFolder: string;
  actionLabelDeleteNote: string;
  actionLabelDeleteFolder: string;
  actionLabelRestoreNote: string;
  actionLabelRestoreFolder: string;
  actionLabelPermanentDeleteNote: string;
  actionLabelPermanentDeleteFolder: string;
  museWhisperTitle: string;
  museWhisperDesc: string;
  museWhisperMoti: string;
  museSettingsBtn: string;
  museShortcutsTip: string;
  scribeViewEnter: string;
  scribeViewExit: string;
}

export const translations: Record<"en" | "zh", TranslationDictionary> = {
  en: {
    appName: "Scribe Creative Sanctuary",
    appSubtitle: "drafting reflections on memory, beauty, and silence.",
    editor: "Editor",
    history: "History",
    trash: "Trash",
    settings: "Settings",
    foldersHeader: "Folders & Vessels",
    standaloneHeader: "Standalone Notes",
    emptyVessel: "Empty vessel",
    noFoldersYet: "No folders created yet.",
    noNotesYet: "No writing drafts yet.",
    createSubfolder: "Create nested folder",
    newNoteInFolder: "New note in folder",
    deleteFolder: "Delete Folder",
    deleteNote: "Delete Note",
    dragToRoot: "drop to move to root",
    dragToUnnest: "drop to un-nest",
    newFolderNamePlaceholder: "Vessel folder name...",
    newSubfolderNamePlaceholder: "Subfolder name...",
    createButton: "Create",
    cancelButton: "X",
    // Settings view
    settingsTitle: "Profile & Sanctuary Settings",
    settingsSubtitle: "Configure your writing profile, personalize your sanctuary's visual identity, and preserve your creative work.",
    blockProfileTitle: "Visual Identity & Persona",
    blockProfileDesc: "Personalize your pen name, bio, and visual profile theme. These details live in your browser's space.",
    blockAiTitle: "Sounding Board Engine",
    blockAiDesc: "Configure the AI model that listens to your writing and acts as your creative guide.",
    blockDataTitle: "Data Preservation & Recovery",
    blockDataDesc: "Backup your work, restore from past sessions, or import plain text/markdown notebooks.",
    penNameLabel: "Pen Name / Identity",
    penNamePlaceholder: "e.g. Samuel Coleridge",
    bioLabel: "Creator Bio",
    bioPlaceholder: "A soul exploring the limits of prose...",
    saveProfileBtn: "Save Profile Settings",
    saveAiBtn: "Save AI Engine Config",
    selectedBrainLabel: "Selected Brain",
    customApiKeyLabel: "Custom API Key",
    customApiKeyPlaceholder: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    activeSystemKey: "Active System Key Found",
    aiHourlyLimitLabel: "AI Hourly Usage Limit",
    aiHourlyLimitDesc: "The sounding board is restricted to this many queries per hour to maintain writing rhythm.",
    currentUsageRateLabel: "Current Usage Rate",
    resetsInMinutes: "Resets in ~{mins}m",
    noActiveCycle: "No active cycle",
    verifyConnectionBtn: "Verify Model Connection",
    verifyingConnection: "Verifying Connection...",
    connectionSuccess: "Connection Success",
    connectionError: "Connection Error",
    exportSanctuaryTitle: "Export Sanctuary",
    exportSanctuaryDesc: "Creates a secure, encrypted backup file (.json) containing your folders and notebooks.",
    exportSanctuaryStats: "Contains: {folders} folders, {notes} drafts",
    exportSanctuaryBtn: "Export Cozy Backup",
    importRecoveryTitle: "Import Recovery",
    importRecoveryDesc: "Upload or drop an encrypted Scribe backup file to decrypt and restore your sanctuary.",
    importRecoveryPlaceholder: "Click or Drop JSON Backup",
    importDocsTitle: "Import Document",
    importDocsDesc: "Import any plain text or Markdown draft directly into your current workspace as a new note. Not applicable to backups.",
    importDocsPlaceholder: "Click or Drop File",
    dragDropCoverText: "Drag & drop cover banner image here...",
    dragDropCoverHover: "Drop image to set cover",
    dragDropAvatarHover: "Drop Here",
    uploadCoverBtn: "Upload Cover",
    uploadAvatarBtn: "Upload",
    dragHint: "Drag files to cover or portrait",
    // Encryption / Decryption Modal
    encryptionTitle: "Encrypting Sanctuary",
    encryptionProcessing: "Applying cryptographic seal to your creative works...",
    decryptionTitle: "Decrypting Sanctuary",
    decryptionProcessing: "Opening cryptographic seal to recover your creative works...",
    securingData: "Securing notes and folders structure...",
    restoringSanctuary: "Reconstructing creative vessels...",
    bytesSecured: "{bytes} bytes securely encoded",
    integrityChecked: "Cryptographic integrity check passed",
    successComplete: "Operation Completed Successfully!",
    // Notifications
    profileUpdatedNotif: "Profile and identity saved successfully!",
    coverUpdatedNotif: "Profile background cover updated!",
    avatarUpdatedNotif: "Profile picture updated!",
    modelConfigSavedNotif: "AI Engine configurations saved successfully!",
    backupSuccessNotif: "Sanctuary backup created and downloaded!",
    backupErrorNotif: "Unable to generate backup file.",
    invalidBackupNotif: "Invalid backup file or decryption failed.",
    noScribeDataNotif: "Backup file contains no Scribe folders or notes.",
    restoreSuccessNotif: "Sanctuary successfully decrypted and restored!",
    restoreErrorNotif: "Failed to parse and restore backup.",
    folderIntoItselfNotif: "Cannot move a folder into itself.",
    folderIntoDescendantNotif: "Cannot move a folder into its own subfolders.",
    importDocSuccessNotif: "Successfully imported \"{title}\" as a new note!",
    importDocErrorNotif: "Failed to read imported document file.",
    unsupportedDocNotif: "Only .txt and .md files are supported for document imports.",
    // Trash view
    trashTitle: "The Trash Sanctuary",
    trashSubtitle: "Letting go doesn't have to be instant. Items here will be permanently dissolved after 30 days. Restore them, or wipe them clean forever.",
    emptyTrashBtn: "Empty All Items",
    emptyTrashTitle: "Your trash bin is empty",
    emptyTrashDesc: "When notes or folders are discarded, they rest here.",
    trashWarning: "Writings here are set to permanently decompose. Leaving items in the trash is safe, but emptying or manual deletion will delete them immediately.",
    discardedFolders: "Discarded Folders",
    discardedNotes: "Discarded Notes",
    noDiscardedFolders: "No folders in the trash.",
    noDiscardedNotes: "No notes in the trash.",
    daysRemaining: "days remaining",
    restoreFolderTooltip: "Restore Folder and notes",
    restoreNoteTooltip: "Restore Note",
    deletePermanentlyTooltip: "Delete Permanently",
    // History / chronicles view
    historyTitle: "Activity Chronicles",
    historySubtitle: "A beautiful, quiet record of every word drafted and vessel created in your creative sanctuary.",
    clearHistoryBtn: "Clear Chronicles",
    emptyHistoryTitle: "The Chronicles are quiet",
    emptyHistoryDesc: "Actions you take on notes and folders will appear here.",
    searchHistoryPlaceholder: "Search Chronicles...",
    noHistoryMatches: "No chronicles match your filters.",
    actionLabelCreateNote: "CREATE NOTE",
    actionLabelCreateFolder: "CREATE FOLDER",
    actionLabelEditNote: "EDIT NOTE",
    actionLabelEditFolder: "EDIT FOLDER",
    actionLabelDeleteNote: "DELETE NOTE",
    actionLabelDeleteFolder: "DELETE FOLDER",
    actionLabelRestoreNote: "RESTORE NOTE",
    actionLabelRestoreFolder: "RESTORE FOLDER",
    actionLabelPermanentDeleteNote: "PERMANENT DELETE NOTE",
    actionLabelPermanentDeleteFolder: "PERMANENT DELETE FOLDER",
    museWhisperTitle: "A Whisper from the Sanctuary Muse",
    museWhisperDesc: "To awaken Scribe's sounding board (@idea and @fix), please ensure you enter your valid model API key in the Profile Settings.",
    museWhisperMoti: "These commands are gentle guides along your path—not the authors of your journey. Use them to break blocks or smooth rough drafts, but let the true spirit, raw stories, and brilliant creativity flow from your own mind. The most beautiful pages are the ones written with your heart.",
    museSettingsBtn: "Configure API Key",
    museShortcutsTip: "Tip: Type @idea anywhere to extend thoughts, or @fix to correct grammar. Let your own voice lead.",
    scribeViewEnter: "Scribe View",
    scribeViewExit: "Exit Scribe View"
  },
  zh: {
    appName: "Scribe 创作圣殿",
    appSubtitle: "起草关于记忆、美与沉静的感悟。",
    editor: "编辑器",
    history: "垃圾",
    trash: "废纸篓",
    settings: "设置",
    foldersHeader: "文件夹与容器",
    standaloneHeader: "独立笔记",
    emptyVessel: "空无一物",
    noFoldersYet: "暂无文件夹。",
    noNotesYet: "暂无创作草稿。",
    createSubfolder: "创建子文件夹",
    newNoteInFolder: "在此文件夹内新建笔记",
    deleteFolder: "删除文件夹",
    deleteNote: "删除笔记",
    dragToRoot: "拖拽以移动到根目录",
    dragToUnnest: "拖拽以取消嵌套",
    newFolderNamePlaceholder: "容器文件夹名称...",
    newSubfolderNamePlaceholder: "子文件夹名称...",
    createButton: "创建",
    cancelButton: "取消",
    // Settings view
    settingsTitle: "个人资料与圣殿设置",
    settingsSubtitle: "配置您的写作资料、个性化圣殿的视觉形象，并妥善保存您的创意作品。",
    blockProfileTitle: "视觉形象与笔名",
    blockProfileDesc: "个性化您的笔名、简介及头像背景。这些细节将安全保存在您的浏览器中。",
    blockAiTitle: "创意回音壁引擎",
    blockAiDesc: "配置倾听您写作的 AI 智能体，让其成为您的创作向导。",
    blockDataTitle: "数据存储与恢复",
    blockDataDesc: "备份您的创作成果、恢复历史会话，或导入纯文本/Markdown 笔记本。",
    penNameLabel: "笔名 / 身份设定",
    penNamePlaceholder: "例如：蒲松龄",
    bioLabel: "创作者简介",
    bioPlaceholder: "探寻文字边界的旅人...",
    saveProfileBtn: "保存个人资料设置",
    saveAiBtn: "保存 AI 引擎配置",
    selectedBrainLabel: "已选智能脑库",
    customApiKeyLabel: "自定义 API 密钥",
    customApiKeyPlaceholder: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    activeSystemKey: "已启用系统默认密钥",
    aiHourlyLimitLabel: "每小时 AI 使用上限",
    aiHourlyLimitDesc: "为了维持平稳的写作节奏，创意回音壁每小时的查询受限于此数值。",
    currentUsageRateLabel: "当前使用率",
    resetsInMinutes: "将在约 {mins} 分钟后重置",
    noActiveCycle: "当前无活跃周期",
    verifyConnectionBtn: "测试模型连接状态",
    verifyingConnection: "正在验证连接...",
    connectionSuccess: "连接测试成功",
    connectionError: "连接发生错误",
    exportSanctuaryTitle: "导出圣殿数据（加密）",
    exportSanctuaryDesc: "生成一个包含您所有文件夹和笔记的加密备份文件 (.json)，以便离线存档。",
    exportSanctuaryStats: "内含：{folders} 个文件夹，{notes} 篇草稿",
    exportSanctuaryBtn: "导出温馨备份",
    importRecoveryTitle: "导入圣殿恢复",
    importRecoveryDesc: "上传或拖入加密的 Scribe 备份文件，以解密并完整恢复您的创作圣殿。",
    importRecoveryPlaceholder: "点击或拖拽 JSON 备份到此处",
    importDocsTitle: "导入文档",
    importDocsDesc: "将任意纯文本或 Markdown 草稿直接导入当前工作区作为新笔记。此功能不适用于备份。",
    importDocsPlaceholder: "点击或拖拽 文件到此处",
    dragDropCoverText: "拖拽封面背景图片到此处...",
    dragDropCoverHover: "释放以设置为封面",
    dragDropAvatarHover: "释放到此处",
    uploadCoverBtn: "上传封面背景",
    uploadAvatarBtn: "上传头像",
    dragHint: "可将文件直接拖入封面或头像区域",
    // Encryption / Decryption Modal
    encryptionTitle: "正在加密并锁定圣殿数据",
    encryptionProcessing: "正在为您的创意文字加盖专属加密印记...",
    decryptionTitle: "正在解密并开启圣殿数据",
    decryptionProcessing: "正在开启专属加密印记，恢复您的创意作品...",
    securingData: "正在对笔记及文件夹结构进行安全编码...",
    restoringSanctuary: "正在重建您的创意容器...",
    bytesSecured: "已安全加密 {bytes} 字节",
    integrityChecked: "加密数据完整性校验通过",
    successComplete: "操作已成功圆满完成！",
    // Notifications
    profileUpdatedNotif: "个人资料与身份设置已成功保存！",
    coverUpdatedNotif: "个人封面背景图已成功更新！",
    avatarUpdatedNotif: "个人头像已成功更新！",
    modelConfigSavedNotif: "AI 引擎配置已成功保存！",
    backupSuccessNotif: "圣殿加密备份已成功生成并下载！",
    backupErrorNotif: "无法生成备份文件。",
    invalidBackupNotif: "备份文件格式不正确或解密失败。",
    noScribeDataNotif: "该备份中没有包含任何 Scribe 文件夹或笔记数据。",
    restoreSuccessNotif: "圣殿数据已成功解密并恢复！",
    restoreErrorNotif: "解析并恢复备份文件失败。",
    folderIntoItselfNotif: "不能将文件夹移动到其自身中。",
    folderIntoDescendantNotif: "不能将文件夹移动到其自身的子文件夹中。",
    importDocSuccessNotif: "已成功将 \"{title}\" 导入为全新笔记！",
    importDocErrorNotif: "读取导入的文档文件失败。",
    unsupportedDocNotif: "文档导入仅支持 .txt 和 .md 格式的文件。",
    // Trash view
    trashTitle: "废纸篓圣殿",
    trashSubtitle: "放手不一定非要在一瞬之间。此处的项目将在 30 天后被永久分解。在此之前，您可以随时恢复它们，或将其彻底抹去。",
    emptyTrashBtn: "清空所有项目",
    emptyTrashTitle: "您的废纸篓空空如也",
    emptyTrashDesc: "当丢弃笔记或文件夹时，它们会在此处静候。",
    trashWarning: "此处的文字正处于永久分解的过程中。保留在废纸篓中是安全的，但手动清空或删除将立即彻底抹去它们。",
    discardedFolders: "已丢弃文件夹",
    discardedNotes: "已丢弃笔记",
    noDiscardedFolders: "废纸篓中暂无文件夹。",
    noDiscardedNotes: "废纸篓中暂无笔记。",
    daysRemaining: "天后永久删除",
    restoreFolderTooltip: "恢复文件夹及其笔记",
    restoreNoteTooltip: "恢复笔记",
    deletePermanentlyTooltip: "永久删除",
    // History / chronicles view
    historyTitle: "活动编年史",
    historySubtitle: "一幅静谧而典雅的画卷，记录着您在创意圣殿中起草的字字句句与创建的每个容器。",
    clearHistoryBtn: "清空编年史",
    emptyHistoryTitle: "编年史目前静悄悄",
    emptyHistoryDesc: "您对笔记和文件夹进行的操作将会记录于此。",
    searchHistoryPlaceholder: "搜索编年史...",
    noHistoryMatches: "没有找到匹配当前过滤条件的编年史记录。",
    actionLabelCreateNote: "创建笔记",
    actionLabelCreateFolder: "创建文件夹",
    actionLabelEditNote: "编辑笔记",
    actionLabelEditFolder: "编辑文件夹",
    actionLabelDeleteNote: "删除笔记",
    actionLabelDeleteFolder: "删除文件夹",
    actionLabelRestoreNote: "恢复笔记",
    actionLabelRestoreFolder: "恢复文件夹",
    actionLabelPermanentDeleteNote: "永久删除笔记",
    actionLabelPermanentDeleteFolder: "永久删除文件夹",
    museWhisperTitle: "创作圣殿缪斯的低语",
    museWhisperDesc: "若要唤醒 Scribe 创作回音壁（@idea 和 @fix 指令），请确保在“个人设置”中配置有效的 API 密钥。",
    museWhisperMoti: "这些指令是您创作道路上的静谧向导，而非您文学旅程的主笔。请在遭遇阻碍或润色草稿时适度使用它们，而将真正的情感、生动的故事和非凡的创意保留在您自己的脑海中。最动人的篇章，永远源自您的内心深处。",
    museSettingsBtn: "配置 API 密钥",
    museShortcutsTip: "提示：在文中任意位置输入 @idea 可延伸灵感，输入 @fix 可修改语法。让您自己的声音指引创作。",
    scribeViewEnter: "书卷预览",
    scribeViewExit: "退出预览",
  }
};
