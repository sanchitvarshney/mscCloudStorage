import React from "react";
import { FileProvider } from "./context/FileContext";
import AppContent from "./components/AppContent";

const App: React.FC = () => {
  return (
    <FileProvider>
      <AppContent />
    </FileProvider>
  );
};

export default App;
