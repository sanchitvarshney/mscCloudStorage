import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Breadcrumbs, Typography, IconButton, Link } from "@mui/material";
import { Home, ChevronRight, ArrowBack } from "@mui/icons-material";
import FileManager from "../components/FileManager";
import { useFileContext } from "../context/FileContext";

const FolderViewPage: FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { state, pathname } = useLocation();
 const { files } = useFileContext();

  const navigate = useNavigate();
  const baseRoute = pathname.split("/").filter(Boolean)[0] || "home";
  const [folderName, setFolderName] = useState<string>("Folder");


  useEffect(() => {
    if (files && folderId) {
      const folder = files.find((item: any) => item.id === folderId);
      if (folder) {
        setFolderName(folder.name || "Folder");
      }
    }
  }, [files, folderId]);

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  const backPath = `/${baseRoute}`;

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "#fafafa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate(backPath)}
            sx={{
              color: "#5f6368",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Breadcrumbs
            separator={<ChevronRight fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                color: "#5f6368",
              },
            }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => handleBreadcrumbClick(backPath)}
              sx={{
                color: "#5f6368",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Home sx={{ fontSize: 18 }} />
              Home
            </Link>
            <Typography
              variant="body2"
              sx={{
                color: "#202124",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              {folderName}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Folder Content */}
      <FileManager folder={{ folderId, folderName: state }} />
    </Box>
  );
};

export default FolderViewPage;
