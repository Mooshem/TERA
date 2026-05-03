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
    borderRadius: ui.radius.sm,
    borderWidth: 1,
  },
  compact: {
    minHeight: 38,
  },
  primary: {
    backgroundColor: ui.colors.primary,
    borderColor: ui.colors.primary,
    shadowColor: ui.colors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  secondary: {
    backgroundColor: ui.colors.primarySoft,
    borderColor: ui.colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: ui.colors.border,
  },
  text: {
    fontWeight: "700",
    fontSize: ui.type.body,
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: ui.colors.primaryDark,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
});
