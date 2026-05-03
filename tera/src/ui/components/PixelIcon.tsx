import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

type PixelIconType = "leaf" | "star" | "heart" | "coin" | "badge" | "fire" | "tree" | "flower" | "globe";

type PixelIconProps = {
  type: PixelIconType;
  size?: number;
  color?: string;
  animated?: boolean;
};

export function PixelIcon({ type, size = 24, color, animated = false }: PixelIconProps) {
  const leafSway = useRef(new Animated.Value(0)).current;
  const leafTwinkle = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated && type === "leaf") {
      // Gentle swaying animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(leafSway, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(leafSway, {
            toValue: -1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Twinkle/sparkle effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(leafTwinkle, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(leafTwinkle, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, type, leafSway, leafTwinkle]);

  const iconStyle = {
    width: size,
    height: size,
  };

  switch (type) {
    case "leaf":
      const LeafComponent = animated ? Animated.View : View;
      return (
        <View style={[styles.container, iconStyle]}>
          <LeafComponent
            style={[
              styles.simpleLeafContainer,
              { 
                opacity: animated ? leafTwinkle : 1,
                transform: [
                  { rotate: leafSway.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-3deg', '3deg'],
                  })},
                ],
              }
            ]}
          >
            {/* Simple pixel leaf matching PixelNatureBackdrop style */}
            <View style={[styles.simpleLeaf, { backgroundColor: color || "#8bcf79" }]} />
            <View style={[styles.simpleLeafShadow, { backgroundColor: color ? `${color}cc` : "#7fb869cc" }]} />
          </LeafComponent>
        </View>
      );
    
    case "star":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.starShape, { backgroundColor: color || "#ffd700" }]} />
        </View>
      );
    
    case "heart":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.heartShape, { backgroundColor: color || "#ff6b6b" }]} />
        </View>
      );
    
    case "coin":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.coinShape, { backgroundColor: color || "#ffd700" }]} />
        </View>
      );
    
    case "badge":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.badgeShape, { backgroundColor: color || "#4a7c59" }]} />
        </View>
      );
    
    case "fire":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.fireShape, { backgroundColor: color || "#ff6b35" }]} />
        </View>
      );
    
    case "tree":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.treeLeaves, { backgroundColor: color || "#4a7c59" }]} />
          <View style={[styles.treeTrunk, { backgroundColor: color || "#8b7355" }]} />
        </View>
      );
    
    case "flower":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.flowerPetals, { backgroundColor: color || "#ff69b4" }]} />
          <View style={[styles.flowerCenter, { backgroundColor: "#ffd700" }]} />
        </View>
      );
    
    case "globe":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.globeCircle, { backgroundColor: color || "#4a7c59" }]} />
          <View style={[styles.globeLand1, { backgroundColor: color ? `${color}dd` : "#4a7c59dd" }]} />
          <View style={[styles.globeLand2, { backgroundColor: color ? `${color}dd` : "#4a7c59dd" }]} />
          <View style={[styles.globeLand3, { backgroundColor: color ? `${color}dd` : "#4a7c59dd" }]} />
        </View>
      );
    
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  // Simple leaf styles matching PixelNatureBackdrop
  simpleLeafContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  simpleLeaf: {
    width: 12,
    height: 12,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "#4a7c4a",
  },
  simpleLeafShadow: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 1,
    top: 1,
    left: 1,
  },
  starShape: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffd700",
    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  },
  heartShape: {
    position: "absolute",
    width: "60%",
    height: "70%",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    top: "15%",
    left: "20%",
    transform: [{ rotate: "-45deg" }],
  },
  coinShape: {
    position: "absolute",
    width: "70%",
    height: "70%",
    borderRadius: "50%",
    top: "15%",
    left: "15%",
    borderWidth: 2,
    borderColor: "#b8860b",
  },
  badgeShape: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 2,
    top: "10%",
    left: "10%",
    borderWidth: 2,
    borderColor: "#2d5a3d",
  },
  fireShape: {
    position: "absolute",
    width: "60%",
    height: "80%",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    top: "10%",
    left: "20%",
  },
  treeLeaves: {
    position: "absolute",
    width: "70%",
    height: "50%",
    borderRadius: 2,
    top: "0%",
    left: "15%",
  },
  treeTrunk: {
    position: "absolute",
    width: "30%",
    height: "40%",
    borderRadius: 1,
    top: "45%",
    left: "35%",
  },
  flowerPetals: {
    position: "absolute",
    width: "70%",
    height: "70%",
    borderRadius: 2,
    top: "15%",
    left: "15%",
  },
  flowerCenter: {
    position: "absolute",
    width: "30%",
    height: "30%",
    borderRadius: "50%",
    top: "35%",
    left: "35%",
  },
  // Globe styles
  globeCircle: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: "50%",
    top: "10%",
    left: "10%",
    borderWidth: 2,
    borderColor: "#2d5a3d",
  },
  globeLand1: {
    position: "absolute",
    width: "25%",
    height: "15%",
    borderRadius: 4,
    top: "25%",
    left: "20%",
    transform: [{ rotate: "15deg" }],
  },
  globeLand2: {
    position: "absolute",
    width: "20%",
    height: "12%",
    borderRadius: 3,
    top: "45%",
    left: "55%",
    transform: [{ rotate: "-20deg" }],
  },
  globeLand3: {
    position: "absolute",
    width: "18%",
    height: "10%",
    borderRadius: 3,
    top: "60%",
    left: "35%",
    transform: [{ rotate: "30deg" }],
  },
});
