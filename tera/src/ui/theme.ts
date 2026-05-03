export const ui = {
  colors: {
    // Soft moss tint avoids stark white and feels more immersive.
    background: "#eaf1eb",
    // Slightly warm-neutral surface keeps text contrast accessible.
    surface: "#f7fbf7",
    primary: "#2f8f46",
    primaryDark: "#1f6a33",
    primarySoft: "#e7f6ea",
    accent: "#7bc47f",
    earth: "#8d6e63",
    sky: "#d8ece3",
    border: "#c7dccb",
    text: "#123222",
    textMuted: "#4f6a56",
    danger: "#c62828",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  type: {
    title: 30,
    section: 20,
    body: 15,
    caption: 12,
  },
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  },
} as const;
