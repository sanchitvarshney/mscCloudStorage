import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif',
  },
  components: {

    /* ================= TYPOGRAPHY ================= */

    MuiTypography: {
      styleOverrides: {
        root: {
          margin: 0, // Remove default margin
          padding: 0,
        },
      },
    },

    /* ================= ICON BUTTON ================= */

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "6px", // default is 8px
        },
      },
    },

    /* ================= BUTTON ================= */

    MuiButton: {
      styleOverrides: {
        root: {
          padding: "6px 12px",
          minWidth: "auto",
          textTransform: "none", // optional (disable uppercase)
        },
      },
    },

    /* ================= TOGGLE BUTTON ================= */

    MuiToggleButton: {
      styleOverrides: {
        root: {
          padding: "6px",
          minWidth: "36px",
          border: "none",
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: "4px",
        },
      },
    },

    /* ================= CARD ================= */

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "12px",
          "&:last-child": {
            paddingBottom: "12px",
          },
        },
      },
    },

    /* ================= TABLE ================= */

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px 12px", // default is 16px ❌
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "42px",
        },
      },
    },

    /* ================= INPUT FIELDS ================= */

    MuiInputBase: {
      styleOverrides: {
        root: {
        //   padding: "px 8px",
        },
      },
    },

    /* ================= LIST ITEMS ================= */

    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
      },
    },

  },
});

export default theme;
