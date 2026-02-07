import { createTheme } from "@mui/material/styles";
import { Assistant } from "next/font/google";

const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

// Fallback hex values (ONLY to satisfy MUI palette validation)
// Your real colors will come from CSS vars in component overrides.
const FALLBACK_PRIMARY = "#db2123";
const FALLBACK_BG_LIGHT = "#ffffff";
const FALLBACK_BG_DARK = "#0f1115";
const FALLBACK_TEXT_LIGHT = "#232127";
const FALLBACK_TEXT_DARK = "#f5f5f5";
const FALLBACK_BORDER_LIGHT = "#e3e3e3";
const FALLBACK_BORDER_DARK = "rgba(255,255,255,0.12)";

const shared = {
  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },
  shape: {
    borderRadius: 10,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "var(--border)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius)",
          color: "var(--foreground)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--ring)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--ring)",
            borderWidth: 2,
          },
        },
        input: {
          color: "var(--foreground)",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--muted-foreground)",
          "&.Mui-focused": {
            color: "var(--foreground)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "var(--radius)",
          textTransform: "none",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          "&:hover": {
            backgroundColor: "var(--primary)",
            opacity: 0.9,
          },
        },
        outlined: {
          borderColor: "var(--border)",
          color: "var(--foreground)",
          "&:hover": {
            borderColor: "var(--ring)",
            backgroundColor:
              "color-mix(in oklch, var(--accent) 60%, transparent)",
          },
        },
        text: {
          color: "var(--foreground)",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "var(--foreground)",
          "&:hover": {
            backgroundColor:
              "color-mix(in oklch, var(--accent) 60%, transparent)",
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
        },
        arrow: {
          color: "var(--popover)",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid var(--border)",
        },
        head: {
          color: "var(--foreground)",
          fontWeight: 700,
          backgroundColor: "var(--card)",
        },
      },
    },
  },

  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.15),0px 1px 1px 0px rgba(0,0,0,0.15),0px 1px 3px 0px rgba(0,0,0,0.15)",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "0 5px 5px rgba(0, 0, 0, 0.15)",
    ...Array(16).fill("none"),
  ],
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",

    // Use valid hex colors here ONLY for MUI internal calculations
    primary: { main: FALLBACK_PRIMARY },
    secondary: { main: FALLBACK_PRIMARY },

    background: {
      default: FALLBACK_BG_LIGHT,
      paper: FALLBACK_BG_LIGHT,
    },

    text: {
      primary: FALLBACK_TEXT_LIGHT,
      secondary: "#404040",
    },

    divider: FALLBACK_BORDER_LIGHT,
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",

    primary: { main: FALLBACK_PRIMARY },
    secondary: { main: FALLBACK_PRIMARY },

    background: {
      default: FALLBACK_BG_DARK,
      paper: "#14181b",
    },

    text: {
      primary: FALLBACK_TEXT_DARK,
      secondary: "#9ca3af",
    },

    divider: FALLBACK_BORDER_DARK,
  },
});
