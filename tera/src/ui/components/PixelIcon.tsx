import { View, StyleSheet } from "react-native";

type PixelIconType = "leaf" | "star" | "heart" | "coin" | "badge" | "fire" | "tree" | "flower";

type PixelIconProps = {
  type: PixelIconType;
  size?: number;
  color?: string;
};

export function PixelIcon({ type, size = 24, color }: PixelIconProps) {
  const iconStyle = {
    width: size,
    height: size,
  };

  switch (type) {
    case "leaf":
      return (
        <View style={[styles.container, iconStyle]}>
          <View style={[styles.leafShape, { backgroundColor: color || "#7cb342" }]} />
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
    
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  leafShape: {
    position: "absolute",
    width: "60%",
    height: "80%",
    borderRadius: 2,
    top: "10%",
    left: "20%",
    transform: [{ rotate: "45deg" }],
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
});
