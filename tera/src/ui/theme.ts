export const ui = {
  colors: {
    // Warm, creamy background like Stardew Valley's soft palette
    background: "#f5e6d3",
    // Slightly darker surface for cards with parchment-like feel
    surface: "#faf0e6",
    // Rich forest green for primary actions
    primary: "#4a7c59",
    primaryDark: "#2d5a3d",
    // Soft green for secondary elements
    primarySoft: "#d4e8d4",
    // Muted accent for highlights
    accent: "#8fb58f",
    // Earthy brown for borders and details
    earth: "#8b7355",
    // Light sky blue for accents
    sky: "#b8d4e3",
    // Border color with aged paper feel
    border: "#c4b5a0",
    // Dark, readable text
    text: "#3a2f2a",
    // Muted text for secondary information
    textMuted: "#6b5d54",
    // Warm red for warnings/danger
    danger: "#c85450",
    // Stardew Valley inspired colors
    gold: "#daa520",
    bronze: "#cd7f32",
    silver: "#c0c0c0",
    // Nature colors
    grass: "#7cb342",
    dirt: "#8d6e63",
    water: "#4fc3f7",
    wood: "#6d4c41",
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
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    pill: 999,
  },
  type: {
    title: 32,
    section: 22,
    body: 16,
    caption: 12,
  },
  shadows: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 0,
      shadowOffset: { width: 4, height: 4 },
      elevation: 4,
    },
    button: {
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 0,
      shadowOffset: { width: 3, height: 3 },
      elevation: 3,
    },
  },
} as const;
