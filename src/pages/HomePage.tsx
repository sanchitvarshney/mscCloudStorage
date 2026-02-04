import { FC, useEffect, useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";
import { getViewFromRoute } from "../utils/routeMapping";
const HomePage: FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const shareKeyFromUrl = searchParams.get("key");
  const { setCurrentView } = useFileContext();
  const { folderId } = useParams<{ folderId: string }>();
  const { folderName, folderPath } = useLocation()?.state || {};
  useEffect(() => {
    const route = location.pathname.split("/").filter(Boolean)[0] || "home";
    const view = getViewFromRoute(route);
    setCurrentView(view);
  }, [location.pathname, setCurrentView]);
  const folder = useMemo(
    () => ({
      folderId: folderId || undefined,
      folderName: folderName || undefined,
      folderPath: folderPath || undefined,
    }),
    [folderId, folderName, folderPath],
  );

  const skipFetchForSharedRedirect = !!shareKeyFromUrl;

  return (
    <FileManager
      key={folderId || "root"}
      folder={folder}
      skipFetchForSharedRedirect={skipFetchForSharedRedirect}
    />
  );
};

export default HomePage;
