import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FileProvider } from "./context/FileContext";
import AppContent from "./components/AppContent";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";

import OfflinePage from "./pages/OfflinePage";
import Protected from "./components/Protected";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <FileProvider>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<Protected><AppContent /></Protected>}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />} />
            {/* <Route path="home/:folderId" element={<FolderView />} /> */}
            <Route path="my-drive" element={<HomePage />} />
            <Route path="shared-drives" element={<HomePage />} />
            <Route path="shared-with-me" element={<HomePage />} />
            <Route path="starred" element={<HomePage />} />
            <Route path="spam" element={<HomePage />} />
            <Route path="trash" element={<HomePage />} />
         
            <Route path="offline" element={<OfflinePage />} />
          </Route>
        </Routes>
      </FileProvider>
    </BrowserRouter>
  );
};

export default App;
