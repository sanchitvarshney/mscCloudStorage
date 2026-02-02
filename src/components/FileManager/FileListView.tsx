import { FC, useMemo, useState, useCallback } from "react";
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
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { FileItem } from "../../types";
import FileItemRow from "./FileItemRow";
import { groupFilesByDate } from "../../utils";

type SortBy = "modified" | "size" | null;
type SortOrder = "asc" | "desc";

function getSortableDate(file: FileItem): number {
  const d = (file as any).modified ?? (file as any).dateShared;
  if (d instanceof Date) return d.getTime();
  if (typeof d === "string" && !isNaN(Date.parse(d))) return new Date(d).getTime();
  if (typeof file.modifiedAt === "string" && !isNaN(Date.parse(file.modifiedAt)))
    return new Date(file.modifiedAt).getTime();
  return 0;
}

function getSortableSize(file: FileItem): number {
  if (file.type === "folder") return -1;
  return typeof file.size === "number" ? file.size : 0;
}

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
  const [sortState, setSortState] = useState<{ sortBy: SortBy; sortOrder: SortOrder }>({
    sortBy: null,
    sortOrder: "desc",
  });
  const { sortBy, sortOrder } = sortState;

  const handleSort = useCallback((column: "modified" | "size") => {
    setSortState((prev) => {
      if (prev.sortBy === column) {
        return { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" };
      }
      return {
        sortBy: column,
        sortOrder: column === "modified" ? "desc" : "asc",
      };
    });
  }, []);

  const [sharedDateSortOrder, setSharedDateSortOrder] = useState<SortOrder>("desc");

  const handleSharedDateSort = useCallback(() => {
    setSharedDateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const sortedFiles = useMemo(() => {
    if (!sortBy) return files;
    const order = sortOrder === "asc" ? 1 : -1;
    return [...files].sort((a, b) => {
      if (sortBy === "modified") {
        const ta = getSortableDate(a);
        const tb = getSortableDate(b);
        return order * (ta - tb);
      }
      const sa = getSortableSize(a);
      const sb = getSortableSize(b);
      return order * (sa - sb);
    });
  }, [files, sortBy, sortOrder]);

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
                  <TableHead >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
                        Shared by
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: "#5f6368",
                          cursor: "pointer",
                          userSelect: "none",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                        }}
                        onClick={handleSharedDateSort}
                      >
                        Date shared
                        {sharedDateSortOrder === "asc" ? (
                          <ArrowUpward sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle" }} />
                        ) : (
                          <ArrowDownward sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle" }} />
                        )}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...section.files]
                      .sort((a, b) => {
                        const order = sharedDateSortOrder === "asc" ? 1 : -1;
                        return order * (getSortableDate(a) - getSortableDate(b));
                      })
                      .map((file) => (
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

  const SortIcon = ({ column }: { column: "modified" | "size" }) => {
    if (sortBy !== column) return <ArrowDownward sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle", opacity: 0.5 }} />;
    return sortOrder === "asc" ? (
      <ArrowUpward sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle" }} />
    ) : (
      <ArrowDownward sx={{ fontSize: 14, ml: 0.5, verticalAlign: "middle" }} />
    );
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 500, color: "#5f6368" }}>
              Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 500,
                color: "#5f6368",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
              onClick={() => handleSort("modified")}
            >
              Modified
              <SortIcon column="modified" />
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 500,
                color: "#5f6368",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
              onClick={() => handleSort("size")}
            >
              Size
              <SortIcon column="size" />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedFiles.map((file) => (
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
