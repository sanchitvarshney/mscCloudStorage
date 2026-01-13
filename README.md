# Google Drive UI

A Material-UI based Google Drive interface with file management capabilities.

## Features

- **File Management**: Upload, download, and organize files
- **Folder Creation**: Create and manage folders
- **Sharing**: Share files and folders with users via email
- **Favourites**: Mark files and folders as favourites
- **Trash**: Deleted items go to trash and can be restored
- **Storage Info**: View storage usage with progress bar and user count
- **Sidebar Navigation**: Easy access to My Drive, Favourites, and Trash

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Left sidebar with navigation
│   ├── StorageInfo.tsx       # Storage usage display
│   └── FileManager.tsx       # Main file management component
├── context/
│   └── FileContext.tsx       # File state management
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Usage

1. **Create Folder**: Click "New Folder" button and enter a name
2. **Upload Files**: Click "Upload" button and select files
3. **Share**: Right-click on a file/folder → Share → Enter email addresses
4. **Download**: Right-click on a file → Download
5. **Favourite**: Right-click on a file/folder → Add to Favourites
6. **Delete**: Right-click on a file/folder → Delete (moves to Trash)
7. **Restore**: Go to Trash → Right-click → Restore

## Technologies

- React 18
- TypeScript
- Material-UI (MUI) 5
- Vite
