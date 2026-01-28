import { FC, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";
import { getViewFromRoute } from "../utils/routeMapping";

const HomePage: FC = () => {
  const location = useLocation();
  const { setCurrentView } = useFileContext();
  const { folderId } = useParams<{ folderId: string }>();
  const { folderName, folderPath } = useLocation()?.state || {};
  
  useEffect(() => {
    const route = location.pathname.split("/").filter(Boolean)[0] || "home";
    const view = getViewFromRoute(route);
    setCurrentView(view);
  }, [location.pathname, setCurrentView]);
  const folder = useMemo(() => ({
    folderId: folderId || undefined,
    folderName: folderName || undefined,
    folderPath: folderPath || undefined,
  }), [folderId, folderName, folderPath]);

 
  return (
    <FileManager 
      key={folderId || 'root'}
      folder={folder} 
    />
  );
};

export default HomePage;
