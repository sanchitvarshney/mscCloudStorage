import { FC, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";
import { getViewFromRoute } from "../utils/routeMapping";
import { useFetchSharedFileInfoQuery } from "../services/dirManager/dirServices";

const HomePage: FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const shareKeyFromUrl = searchParams.get("key");
  const { setCurrentView } = useFileContext();
  const { folderId } = useParams<{ folderId: string }>();
  const { folderName, folderPath } = useLocation()?.state || {};

  const { data: linkData } = useFetchSharedFileInfoQuery(
    { share_key: shareKeyFromUrl! },
    { skip: !shareKeyFromUrl }
  );

  useEffect(() => {
    if (linkData?.data) {
      nav("/shared-with-me");
    }
  }, [linkData]);
       
   


  useEffect(() => {
    const route = location.pathname.split("/").filter(Boolean)[0] || "home";
    const view = getViewFromRoute(route);
    setCurrentView(view);
  }, [location.pathname, setCurrentView]);
  const folder = useMemo(
    () => ({
      folderId:  folderId || undefined,
      folderName: folderName || undefined,
      folderPath: folderPath || undefined,
    }),
    [folderId, folderName, folderPath],
  );

  return (
    <FileManager
      key={folderId || "root"}
      folder={folder}
      linkData={shareKeyFromUrl ? { key: shareKeyFromUrl } : undefined}
    />
  );
};

export default HomePage;
