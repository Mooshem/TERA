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
    backgroundColor: "#f8f8e8",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#8b7355",
    borderTopColor: "#c4b5a0",
    borderLeftColor: "#c4b5a0",
    padding: ui.spacing.lg,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    elevation: 4,
  },
});
