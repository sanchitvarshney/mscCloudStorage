import { FC, useEffect, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";
import { getViewFromRoute } from "../utils/routeMapping";
import {
  useFetchSharedFileInfoQuery,
  useViewFileMutation,
} from "../services/dirManager/dirServices";
import { useToast } from "../hooks/useToast";

const HomePage: FC = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const shareKeyFromUrl = searchParams.get("key");
  const { setCurrentView } = useFileContext();
  const { folderId } = useParams<{ folderId: string }>();
  const { folderName, folderPath } = useLocation()?.state || {};
  const [viewFile, { isLoading }] = useViewFileMutation();

  const { data: linkData } = useFetchSharedFileInfoQuery(
    { share_key: shareKeyFromUrl! },
    { skip: !shareKeyFromUrl },
  );

  useEffect(() => {
    if (linkData?.data) {
      const { key } = linkData?.data;
      if (key) {
    
        handleView(key);
      } else {
        nav("/shared-with-me");
      }
    }
  }, [linkData]);

  useEffect(() => {
    showToast("Loading...", "success", isLoading);
  }, [isLoading]);

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
    [folderId, folderName, folderPath, linkData?.data?.key],
  );

  // // When share key is in URL we will redirect to shared-with-me; skip folder list fetch
  const skipFetchForSharedRedirect = !!shareKeyFromUrl;

  const handleView = async (file: any) => {
    const payload = {
      file_key: file,
      type: "list",
    };

    try {
      const blob = await viewFile(payload).unwrap();

      if (!blob) {
        console.error("No file returned from server");
        showToast("No file returned from server", "error");
        nav("/home");

        return;
      }
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // nav("/home");
    } catch (err) {
      console.error("Failed to view file:", err);
      showToast("Failed to view file", "error");
      nav("/home");
    } 
  };

  return (
    <FileManager
      key={folderId || "root"}
      folder={folder}
      linkData={shareKeyFromUrl ? { key: shareKeyFromUrl } : undefined}
      skipFetchForSharedRedirect={skipFetchForSharedRedirect}
    />
  );
};

export default HomePage;
