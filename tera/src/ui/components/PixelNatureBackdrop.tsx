import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type PixelNatureBackdropProps = {
  opacity?: number;
};

export function PixelNatureBackdrop({ opacity = 0.55 }: PixelNatureBackdropProps) {
  const leafDrift = useRef(new Animated.Value(0)).current;
  const cloudDrift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafDrift, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(leafDrift, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudDrift, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudDrift, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [leafDrift, cloudDrift]);

  return (
    <View pointerEvents="none" style={[styles.wrapper, { opacity }]}>
      <Animated.View
        style={[
          styles.cloud,
          {
            transform: [
              {
                translateX: cloudDrift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-8, 12],
                }),
              },
            ],
          },
        ]}
      />

      <View style={[styles.tree, { left: 14, bottom: 12 }]}>
        <View style={styles.pixelLeaves} />
        <View style={styles.pixelTrunk} />
      </View>
      <View style={[styles.tree, { right: 18, bottom: 22, transform: [{ scale: 0.88 }] }]}>
        <View style={styles.pixelLeaves} />
        <View style={styles.pixelTrunk} />
      </View>

      <Animated.View
        style={[
          styles.leaf,
          styles.leafA,
          {
            transform: [
              {
                translateY: leafDrift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -12],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.leaf,
          styles.leafB,
          {
            transform: [
              {
                translateY: leafDrift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-4, 8],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  tree: {
    position: "absolute",
    alignItems: "center",
  },
  pixelLeaves: {
    width: 46,
    height: 30,
    borderRadius: 2,
    backgroundColor: "#8ed08e",
    borderWidth: 2,
    borderColor: "#4f8a53",
  },
  pixelTrunk: {
    width: 10,
    height: 18,
    backgroundColor: "#7a5a45",
    borderWidth: 1,
    borderColor: "#5f4332",
    marginTop: -1,
  },
  leaf: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: "#8bcf79",
  },
  leafA: {
    top: 72,
    right: 40,
  },
  leafB: {
    top: 132,
    left: 28,
    backgroundColor: "#a2db90",
  },
  cloud: {
    position: "absolute",
    top: 46,
    left: 34,
    width: 84,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#e2efe7",
    borderWidth: 1,
    borderColor: "#c8ddd0",
  },
});
