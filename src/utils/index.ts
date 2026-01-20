export const formatDate = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return "Last month";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

export const getViewTitle = (currentView: string) => {
  switch (currentView) {
    case "home":
      return "Home";
    case "myDrive":
      return "My Drive";
    case "sharedDrives":
      return "Shared Drives";
    case "sharedWithMe":
      return "Shared with me";
    case "starred":
      return "Starred";
    case "spam":
      return "Spam";
    case "trash":
      return "Trash";
    default:
      return "Files";
  }
};

export const groupFilesByDate = (files: any[]) => {
  const groups: { [key: string]: any[] } = {
    Yesterday: [],
    "Last month": [],
    Older: [],
  };

  files.forEach((file) => {
    const date = file.dateShared || file.modified;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      groups["Yesterday"].push(file);
    } else if (diffDays <= 30) {
      groups["Last month"].push(file);
    } else {
      groups["Older"].push(file);
    }
  });

  return groups;
};