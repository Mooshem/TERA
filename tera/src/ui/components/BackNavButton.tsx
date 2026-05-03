import { Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { ui } from "@/src/ui/theme";

type BackNavButtonProps = {
  fallbackHref: Href;
  style?: ViewStyle;
  label?: string;
};

export function BackNavButton({
  fallbackHref,
  style,
  label = "Back",
}: BackNavButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof router.canGoBack === "function" && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  };

  return (
    <Pressable onPress={handleBack} style={[styles.button, style]}>
      <Text style={styles.text}>← {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: ui.colors.border,
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    color: ui.colors.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },
});
