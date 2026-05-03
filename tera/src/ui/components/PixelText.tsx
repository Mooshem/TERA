import { Text, StyleSheet } from "react-native";
import { ui } from "@/src/ui/theme";

type PixelTextProps = {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "title";
  color?: string;
  weight?: "normal" | "bold" | "extra-bold";
  uppercase?: boolean;
  center?: boolean;
  style?: any;
};

export function PixelText({ 
  children, 
  size = "md", 
  color, 
  weight = "normal", 
  uppercase = false,
  center = false,
  style 
}: PixelTextProps) {
  const getTextSize = () => {
    switch (size) {
      case "xs": return 10;
      case "sm": return 12;
      case "md": return 16;
      case "lg": return 20;
      case "xl": return 24;
      case "title": return 32;
      default: return 16;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case "normal": return "600";
      case "bold": return "700";
      case "extra-bold": return "800";
      default: return "600";
    }
  };

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: getTextSize(),
          fontWeight: getFontWeight(),
          color: color || ui.colors.text,
          textTransform: uppercase ? "uppercase" : "none",
          textAlign: center ? "center" : "left",
          letterSpacing: uppercase ? 1 : 0.5,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "System", // You can replace with a pixel font if available
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
