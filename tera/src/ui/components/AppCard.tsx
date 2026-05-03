import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ui } from "@/src/ui/theme";

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.lg,
    borderWidth: 1,
    borderColor: ui.colors.border,
    padding: ui.spacing.lg,
    ...ui.shadows.card,
  },
});
