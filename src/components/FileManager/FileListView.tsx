import { FC } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileItemRow from "./FileItemRow";
import { groupFilesByDate } from "../../utils";

interface FileListViewProps {
  files: FileItem[];
  currentView: string;
  onMenuClick: (event: React.MouseEvent, file: FileItem) => void;
  onDownload?: (file: FileItem) => void;
  onView?: (file: FileItem) => void;
  onClickFolder?: (file: FileItem) => void;
}

const FileListView: FC<FileListViewProps> = ({
  files,
  currentView,
  onMenuClick,
  onDownload,
  onView,
  onClickFolder,
}) => {
  if (currentView === "sharedWithMe") {
    const groupedFiles = groupFilesByDate(files);
    const sections = [
      { label: "Yesterday", files: groupedFiles["Yesterday"] },
      { label: "Last month", files: groupedFiles["Last month"] },
      { label: "Older", files: groupedFiles["Older"] },
    ];

    return (
      <Box>
        {sections.map((section) =>
          section.files.length > 0 ? (
            <Box key={section.label} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "#5f6368", fontWeight: 500, px: 2 }}
              >
                {section.label}
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
                        Shared by
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
                        Date shared
                        <ArrowDownward
                          sx={{
                            fontSize: 14,
                            ml: 0.5,
                            verticalAlign: "middle",
                          }}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {section.files.map((file) => (
                      <FileItemRow
                        key={file.id}
                        file={file}
                        onMenuClick={onMenuClick}
                        onDownload={onDownload}
                        onView={onView}
                        isSharedWithMe={true}
                        onClickFolder={onClickFolder}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : null,
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
              Name
            </TableCell>
            <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
              Modified
            </TableCell>
            <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
              Size
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <FileItemRow
              key={file.id}
              file={file}
              onMenuClick={onMenuClick}
              onDownload={onDownload}
              onView={onView}
              onClickFolder={onClickFolder}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FileListView;
