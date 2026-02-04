import React, { useEffect, useCallback, useRef, type ReactNode, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLoader from "./reuseable/AppLoader";
import {
  useFetchSharedFileInfoQuery,
  useViewFileMutation,
} from "../services/dirManager/dirServices";
import { useToast } from "../hooks/useToast";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication = true,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const isAuthenticated = !!localStorage.getItem("user");
  const shareKeyFromUrl = searchParams.get("key");

  const { data: linkData } = useFetchSharedFileInfoQuery(
    { share_key: shareKeyFromUrl! },
    { skip: !shareKeyFromUrl || !isAuthenticated }
  );

  const [viewFile] = useViewFileMutation();
  const shareHandledRef = useRef(false);

  const checkAuth = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authentication && !isAuthenticated) {
      if (shareKeyFromUrl) {
        navigate(`/share?key=${encodeURIComponent(shareKeyFromUrl)}`, { replace: true });
        return;
      }
      navigate("/signin");
      return;
    }

    if (!authentication && isAuthenticated) {
      navigate("/");
      return;
    }

    if (shareKeyFromUrl) {
      return;
    }
    setIsLoading(false);
  }, [authentication, navigate, isAuthenticated, shareKeyFromUrl]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!linkData?.data || !shareKeyFromUrl || !isAuthenticated || shareHandledRef.current) return;
    shareHandledRef.current = true;
    const { key, type } = linkData.data;

    if (key && type === "file") {
      const fileKey = linkData.data.key ?? linkData.data.unique_key;
      viewFile({ file_key: fileKey, type: "share" })
        .unwrap()
        .then((blob) => {
          if (!blob) {
            showToast("No file returned from server", "error");
            navigate("/signin");
            return;
          }
          const url = URL.createObjectURL(blob);
          window.open(url);
          navigate("/signin");
        })
        .catch(() => {
          showToast("Failed to view file", "error");
          navigate("/signin");
        });
      return;
    }
    if (type === "folder" && key) {
      navigate(`/share?key=${encodeURIComponent(shareKeyFromUrl)}`);
      return;
    }
    navigate("/shared-with-me");
  }, [linkData, shareKeyFromUrl, isAuthenticated, navigate, viewFile, showToast]);

  if (shareKeyFromUrl && isAuthenticated) {
    return <AppLoader />;
  }

  if (isLoading) {
    return <AppLoader />;
  }

  return <>{children}</>;
};

export default Protected;
