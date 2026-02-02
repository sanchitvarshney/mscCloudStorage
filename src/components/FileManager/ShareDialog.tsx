import { FC, useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import {
  Close,
  Search,
  PersonAdd,
  Link as LinkIcon,
  Lock,
} from "@mui/icons-material";
import { FileItem } from "../../types";
import { debounce } from "../../utils";
import {
  useOnSearchUserMutation,
  useOnShareLinkMutation,
} from "../../services/dirManager/dirServices";
import { useToast } from "../../hooks/useToast";

interface PersonAccess {
  email: string;
  name?: string;
  key?: string;
  // role: "viewer" | "commenter" | "editor" | "owner";
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  file: FileItem | null;
}

interface SearchUserItem {
  email?: string;
  name?: string;
  [key: string]: unknown;
}

const ShareDialog: FC<ShareDialogProps> = ({ open, onClose, file }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();
  const [generalAccess, setGeneralAccess] = useState<"anyone" | "restricted">(
    "restricted",
  );
  const [peopleWithAccess, setPeopleWithAccess] = useState<PersonAccess[]>([]);
  // const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  // const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [shareLinkUrl, setShareLinkUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [fieldError, setFieldError] = useState<string>("");

  const [
    triggerSearchUser,
    { data: searchUserData, isLoading: isSearchingUsers },
  ] = useOnSearchUserMutation();

  const [
    triggerShareLink,
    { data: shareLinkData, isLoading: isCreatingShareLink },
  ] = useOnShareLinkMutation();

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim()) {
          triggerSearchUser({ search: query.trim() });
        }
      }, 300),
    [triggerSearchUser],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const filteredPeople = useMemo((): SearchUserItem[] => {
    if (!searchQuery.trim()) return [];
    //@ts-ignore
    const list = Array.isArray(searchUserData?.userData)
      ? searchUserData?.userData
      : [];
    return list
      ?.map((item: SearchUserItem) => ({
        email: item.email ?? "",
        name: item.name,
        key: item.key,
      }))
      ?.filter((p: any) => p.email);
  }, [searchQuery, searchUserData]);

  const availablePeople = useMemo(() => filteredPeople, [filteredPeople]);

  const displayedPeople = useMemo(
    () =>
      filteredPeople?.filter(
        (person: any) =>
          !peopleWithAccess.find((p) => p.email === person.email),
      ) ?? [],
    [filteredPeople, peopleWithAccess],
  );

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() && displayedPeople.length > 0) {
      resultsContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      const t = setTimeout(() => {
        firstItemRef.current?.focus();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [searchQuery, displayedPeople.length]);

  // useEffect(() => {
  //   if (file) {
  //     const existingAccess: PersonAccess[] =
  //       file.sharedWith?.map((email) => ({
  //         email,
  //         name: availablePeople.find((p) => p.email === email)?.name,
  //         role: "viewer" as const,
  //       })) || [];
  //     setPeopleWithAccess(existingAccess);
  //   } else {
  //     setPeopleWithAccess([]);
  //     setSearchQuery("");
  //   }
  // }, [file, open, availablePeople]);

  useEffect(() => {
    if (!open) {
      setFieldError("");
    }
  }, [open]);

  useEffect(() => {
    if (
      shareLinkData?.data &&
      typeof shareLinkData?.data === "object" &&
      "link" in shareLinkData?.data
    ) {
      setShareLinkUrl(shareLinkData?.data?.link ?? null);
      setLinkCopied(false);
    } else if (typeof shareLinkData === "string") {
      setShareLinkUrl(shareLinkData);
      setLinkCopied(false);
    }
  }, [shareLinkData]);

  const handleCopyLink = () => {
    if (!shareLinkUrl) return;
    if (linkCopied) {
      showToast("You already copied link", "success");
      return;
    }
    navigator.clipboard.writeText(shareLinkUrl);
    setLinkCopied(true);
    showToast("Link copied", "success");
  };

  const handleCloseModal = () => {
    onClose();
    setSearchQuery("");
    setGeneralAccess("restricted");
    setPeopleWithAccess([]);
    setExpiresAt("");
    setShareLinkUrl("");
    setLinkCopied(false);
  };

  const handleAddPerson = (email: any, name?: string, key?: string) => {
    if (!peopleWithAccess.find((p) => p.email === email)) {
      setPeopleWithAccess([...peopleWithAccess, { email, name, key }]);
    }
    setSearchQuery("");
    setFieldError("");
  };

  const handleRemovePerson = (email: string) => {
    setPeopleWithAccess(peopleWithAccess.filter((p) => p.email !== email));
  };

  // const handleChangeRole = (email: string, role: PersonAccess["role"]) => {
  //   setPeopleWithAccess(
  //     peopleWithAccess.map((p) => (p.email === email ? { ...p, role } : p))
  //   );
  //   setMenuAnchor(null);
  //   setSelectedPerson(null);
  // };

  const handleShare = async () => {
    setFieldError("");
    const hasPeople = peopleWithAccess?.length > 0;
    const sharedIds = peopleWithAccess?.map((p) => p.key).filter(Boolean) ?? [];
    if (!hasPeople || sharedIds.length === 0) {
      setFieldError("Field required");
      return;
    }
    const payload = {
      file_key: file?.type === "file" ? file?.unique_key : "",
      folder_key: file?.type === "folder" ? file?.unique_key : "",
      restrict: generalAccess === "anyone" ? "N" : "Y",
      shared_with_user_id: sharedIds,
      expires_at: expiresAt ? moment(expiresAt).format("YYYY-MM-DD HH:mm:ss") : "",
    
    };
    try {
      const res: any = await triggerShareLink(payload).unwrap();

      if (res?.success) {
        setPeopleWithAccess([]);
        showToast("File Shared successfully", "success");
        setSearchQuery("");
        setGeneralAccess("restricted");
        setPeopleWithAccess([]);

      }
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.data?.error ??
        error?.message 
 showToast(message || "Failed to share file", "error");
    }
  };

  const onShareLink = () => {
    if (shareLinkUrl) {
      handleCloseModal();
    }
    handleShare();
  };

  // const handleMenuClick = (event: any, email: string) => {
  //   setMenuAnchor(event.currentTarget);
  //   setSelectedPerson(email);
  // };

  // const handleMenuClose = () => {
  //   setMenuAnchor(null);
  //   setSelectedPerson(null);
  // };

  // const getRoleLabel = (role: PersonAccess["role"]) => {
  //   switch (role) {
  //     case "owner":
  //       return "Owner";
  //     case "editor":
  //       return "Editor";
  //     case "commenter":
  //       return "Commenter";
  //     case "viewer":
  //       return "Viewer";
  //     default:
  //       return "Viewer";
  //   }
  // };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 0,
          boxShadow: 0,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.27)",
            backdropFilter: "blur(0px)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Share "{file?.name}"
        </Typography>
        <IconButton
          size="small"
          onClick={handleCloseModal}
          sx={{
            color: "#5f6368",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, }}>
        {/* General Access Section */}
        <Box
          sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 500, color: "#202124", mb: 1.5 }}
          >
            General access
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
            }}
            onClick={() =>
              setGeneralAccess(
                generalAccess === "restricted" ? "anyone" : "restricted",
              )
            }
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {generalAccess === "restricted" ? (
                <Lock sx={{ color: "#5f6368", fontSize: 20 }} />
              ) : (
                <LinkIcon sx={{ color: "#5f6368", fontSize: 20 }} />
              )}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#202124" }}
                >
                  {generalAccess === "restricted"
                    ? "Restricted"
                    : "Anyone with the link"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#5f6368" }}>
                  {generalAccess === "restricted"
                    ? "Only people with access can open with the link"
                    : "Anyone on the internet with this link can view"}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={generalAccess === "restricted" ? "Restricted" : "Anyone"}
              size="small"
              sx={{
                backgroundColor:
                  generalAccess === "restricted" ? "#e8eaed" : "#e8f0fe",
                color: generalAccess === "restricted" ? "#5f6368" : "#1967d2",
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        {/* Expires at */}
        <Box
          sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 500, color: "#202124", mb: 1.5 }}
          >
            Expires at
          </Typography>
          <TextField
            type="datetime-local"
            fullWidth
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            InputProps={{
              inputProps: { min: new Date().toISOString().slice(0, 16) },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f1f3f4",
                "&:hover": { backgroundColor: "#e8eaed" },
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px 1px rgba(64,60,67,.16)",
                },
              },
            }}
          />
        </Box>

        {/* People Search Section */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 500, color: "#202124", mb: 1.5 }}
          >
            People with access
          </Typography>
          {fieldError && (
            <Typography
              variant="caption"
              sx={{ color: "#d32f2f", display: "block", mb: 1 }}
            >
              {fieldError}
            </Typography>
          )}

          {/* Search Input */}
          <Box sx={{ position: "relative", mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Add people and groups"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                    <Search sx={{ color: "#5f6368", fontSize: 20 }} />
                  </Box>
                ),
                endAdornment: isSearchingUsers ? (
                  <Typography variant="caption" color="text.secondary">
                    Searching…
                  </Typography>
                ) : undefined,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  backgroundColor: "#f1f3f4",
                  "&:hover": {
                    backgroundColor: "#e8eaed",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px 1px rgba(64,60,67,.16)",
                  },
                },
              }}
            />

            {/* Search Results Dropdown */}
            {searchQuery.trim() && displayedPeople.length > 0 && (
              <Box
                ref={resultsContainerRef}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  mt: 0.5,
                  mb: 1,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  boxShadow: "0 2px 10px 2px rgba(60,64,67,.15)",
                  zIndex: 1300,
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                {displayedPeople.map((person: any, index: number) => (
                  <Box
                    key={person.email}
                    ref={index === 0 ? firstItemRef : undefined}
                    tabIndex={index === 0 ? 0 : -1}
                    role="button"
                    onClick={() =>
                      handleAddPerson(person.email, person.name, person.key)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAddPerson(person.email, person.name, person.key);
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1.5,
                      cursor: "pointer",
                      outline: "none",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      "&:focus": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "#34a853",
                          fontSize: "14px",
                          mr: 1.5,
                        }}
                      >
                        {(person.name || person.email || "?").charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {person.name || person.email}
                        </Typography>
                        {person.name && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#5f6368" }}
                          >
                            {person.email}
                          </Typography>
                        )}
                      </Box>
                      <PersonAdd sx={{ color: "#5f6368", fontSize: 20 }} />
                    </Box>
                  ))}
              </Box>
            )}
          </Box>

          {/* People with Access List */}
          <List sx={{ py: 0 }}>
            {/* Owner (if file has owner) */}
            {file?.ownerId && (
              <>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#4285f4",
                        fontSize: "14px",
                      }}
                    >
                      {(file.ownerId || "U").charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {file.ownerId === "current-user"
                          ? "You"
                          : availablePeople.find(
                              (p) => p.email === file.ownerId,
                            )?.name || file.ownerId}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: "#5f6368" }}>
                        Owner
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label="Owner"
                      size="small"
                      sx={{
                        backgroundColor: "#e8f0fe",
                        color: "#1967d2",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {peopleWithAccess.length > 0 && <Divider />}
              </>
            )}

            {/* People with access */}
            {peopleWithAccess.map((person, index) => (
              <Box key={person.email}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#34a853",
                        fontSize: "14px",
                      }}
                    >
                      {(person.name || person.email).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {person.name || person.email}
                      </Typography>
                    }
                    secondary={
                      person.name && (
                        <Typography variant="caption" sx={{ color: "#5f6368" }}>
                          {person.email}
                        </Typography>
                      )
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* <Chip
                        label={getRoleLabel(person.role)}
                        size="small"
                        onClick={(e) => handleMenuClick(e, person.email)}
                        sx={{
                          backgroundColor: "#e8eaed",
                          color: "#5f6368",
                          fontWeight: 500,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#dadce0",
                          },
                        }}
                      /> */}
                      <IconButton
                        size="small"
                        onClick={(__: any) => handleRemovePerson(person.email)}
                        sx={{
                          color: "#5f6368",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < peopleWithAccess.length - 1 && <Divider />}
              </Box>
            ))}

            {/* show link with copy button */}
            {shareLinkUrl && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: 1,
                  border: linkCopied ? "1px solid #34a853" : "1px solid #ddd",
                  borderRadius: 2,
                  backgroundColor: linkCopied ? "rgba(52, 168, 83, 0.08)" : "#f9f9f9",
                }}
              >
                {/* Link Text */}
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {shareLinkUrl}
                </Typography>

                {/* Copy Button */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCopyLink}
                  sx={{
                    ...(linkCopied && {
                      backgroundColor: "#34a853",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#2d8f47" },
                    }),
                  }}
                >
                  {linkCopied ? "Copied" : "Copy"}
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button
          onClick={onShareLink}
          variant="contained"
          disabled={isCreatingShareLink}
          startIcon={
            isCreatingShareLink ? <CircularProgress size={20} /> : null
          }
        >
          Done
        </Button>
      </DialogActions>

      {/* Role Selection Menu */}
      {/* <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      > */}
      {/* {(["viewer", "commenter", "editor"] as const).map((role) => (
          <MenuItem
            key={role}
            onClick={() => selectedPerson && handleChangeRole(selectedPerson, role)}
            selected={peopleWithAccess.find((p) => p.email === selectedPerson)}
          > */}
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}> */}
      {/* <Typography variant="body2" sx={{ flex: 1 }}>
                {getRoleLabel(role)}
              </Typography> 
              {peopleWithAccess.find((p) => p.email === selectedPerson) && (
                <Check sx={{ fontSize: 18, color: "#1967d2" }} />
              )}
            </Box>
          {/* </MenuItem>
        ))}
      </Menu> */}
    </Dialog>
  );
};

export default ShareDialog;
