import { Animated, StyleSheet, View } from "react-native";
import { ui } from "@/src/ui/theme";

type PixelProgressBarProps = {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
};

export function PixelProgressBar({
  progress,
  height = 12,
  color = ui.colors.primary,
  backgroundColor = ui.colors.border,
  animated = true,
}: PixelProgressBarProps) {
  const animatedWidth = animated 
    ? new Animated.Value(0) 
    : null;

  if (animated && animatedWidth) {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 650,
      useNativeDriver: false,
    }).start();
  }

  const fillWidth = animated 
    ? animatedWidth?.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
      })
    : `${progress * 100}%`;

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: fillWidth,
            backgroundColor: color,
            height,
          },
        ]}
      />
      {/* Pixel segments for retro look */}
      <View style={styles.pixelOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#3a2f2a",
    position: "relative",
    overflow: "hidden",
  },
  fill: {
    borderRadius: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  pixelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
});
