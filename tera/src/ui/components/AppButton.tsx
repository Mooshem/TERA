import { Pressable, StyleSheet, Text } from "react-native";
import { ui } from "@/src/ui/theme";

type Variant = "primary" | "secondary" | "ghost";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  compact?: boolean;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  compact = false,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === "primary"
          ? styles.primary
          : variant === "secondary"
            ? styles.secondary
            : styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: ui.spacing.lg,
    borderRadius: 2,
    borderWidth: 3,
    position: "relative",
    overflow: "hidden",
  },
  compact: {
    minHeight: 38,
    paddingHorizontal: ui.spacing.md,
  },
  primary: {
    backgroundColor: "#4a9d5f",
    borderColor: "#2d5a3d",
    borderTopColor: "#6bc47f",
    borderLeftColor: "#6bc47f",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: "#d4e8d4",
    borderColor: "#8fb58f",
    borderTopColor: "#e8f4e8",
    borderLeftColor: "#e8f4e8",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 },
    elevation: 3,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: ui.colors.border,
    borderWidth: 2,
  },
  text: {
    fontWeight: "800",
    fontSize: ui.type.body,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  primaryText: {
    color: "#fff",
    textShadowColor: "#1a3a2a",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  secondaryText: {
    color: "#2d5a3d",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    shadowOffset: { width: 2, height: 2 },
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: "#e0e0e0",
    borderColor: "#a0a0a0",
  },
});
