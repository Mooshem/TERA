import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type PixelNatureBackdropProps = {
  opacity?: number;
};

export function PixelNatureBackdrop({ opacity = 0.55 }: PixelNatureBackdropProps) {
  const leafDrift = useRef(new Animated.Value(0)).current;
  const cloudDrift = useRef(new Animated.Value(0)).current;
  const flowerSway = useRef(new Animated.Value(0)).current;
  const butterflyFloat = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(flowerSway, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(flowerSway, {
          toValue: -1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(butterflyFloat, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(butterflyFloat, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [leafDrift, cloudDrift, flowerSway, butterflyFloat]);

  return (
    <View pointerEvents="none" style={[styles.wrapper, { opacity }]}>
      {/* Clouds */}
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
      <Animated.View
        style={[
          styles.cloud,
          styles.cloudSmall,
          {
            transform: [
              {
                translateX: cloudDrift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, -8],
                }),
              },
            ],
          },
        ]}
      />

      {/* Trees */}
      <View style={[styles.tree, { left: 14, bottom: 12 }]}>
        <View style={styles.pixelLeaves} />
        <View style={styles.pixelTrunk} />
      </View>
      <View style={[styles.tree, { right: 18, bottom: 22, transform: [{ scale: 0.88 }] }]}>
        <View style={styles.pixelLeaves} />
        <View style={styles.pixelTrunk} />
      </View>
      
      {/* Pine Tree */}
      <View style={[styles.pineTree, { left: 8, bottom: 35, transform: [{ scale: 0.7 }] }]}>
        <View style={styles.pineLeavesTop} />
        <View style={styles.pineLeavesMiddle} />
        <View style={styles.pineLeavesBottom} />
        <View style={styles.pineTrunk} />
      </View>

      {/* Flowers */}
      <Animated.View
        style={[
          styles.flower,
          styles.flower1,
          {
            transform: [
              {
                rotate: flowerSway.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-3deg', '3deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.flowerPetals}>
          <View style={styles.flowerCenter} />
        </View>
        <View style={styles.flowerStem} />
      </Animated.View>
      <Animated.View
        style={[
          styles.flower,
          styles.flower2,
          {
            transform: [
              {
                rotate: flowerSway.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['3deg', '-3deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.flowerPetals, { backgroundColor: "#ff85c1", borderColor: "#ff69b4" }]}>
          <View style={styles.flowerCenter} />
        </View>
        <View style={styles.flowerStem} />
      </Animated.View>
      <Animated.View
        style={[
          styles.flower,
          styles.flower3,
          {
            transform: [
              {
                rotate: flowerSway.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-2deg', '2deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.flowerPetals, { backgroundColor: "#ffa500", borderColor: "#ff8c00" }]}>
          <View style={styles.flowerCenter} />
        </View>
        <View style={styles.flowerStem} />
      </Animated.View>

      {/* Bushes */}
      <View style={[styles.bush, { left: 25, bottom: 8 }]} />
      <View style={[styles.bush, { right: 32, bottom: 15, transform: [{ scale: 0.8 }] }]} />

      {/* Rocks */}
      <View style={[styles.rock, { left: 45, bottom: 10 }]} />
      <View style={[styles.rockSmall, { right: 50, bottom: 25 }]} />

      {/* Falling leaves */}
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
      <Animated.View
        style={[
          styles.leaf,
          styles.leafC,
          {
            transform: [
              {
                translateY: leafDrift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, -8],
                }),
              },
            ],
          },
        ]}
      />

      {/* Butterfly */}
      <Animated.View
        style={[
          styles.butterfly,
          {
            transform: [
              {
                translateX: butterflyFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
              {
                translateY: butterflyFloat.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -15, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.butterflyWing, styles.butterflyWingLeft]} />
        <View style={[styles.butterflyWing, styles.butterflyWingRight]} />
        <View style={styles.butterflyBody} />
      </Animated.View>
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
  pineTree: {
    position: "absolute",
    alignItems: "center",
  },
  pineLeavesTop: {
    width: 20,
    height: 16,
    backgroundColor: "#2d5a2d",
    borderWidth: 1,
    borderColor: "#1a3a1a",
    borderRadius: 2,
  },
  pineLeavesMiddle: {
    width: 28,
    height: 14,
    backgroundColor: "#3a6b3a",
    borderWidth: 1,
    borderColor: "#2d5a2d",
    borderRadius: 2,
    marginTop: -2,
  },
  pineLeavesBottom: {
    width: 36,
    height: 12,
    backgroundColor: "#4a7c4a",
    borderWidth: 1,
    borderColor: "#3a6b3a",
    borderRadius: 2,
    marginTop: -2,
  },
  pineTrunk: {
    width: 6,
    height: 12,
    backgroundColor: "#6b4423",
    borderWidth: 1,
    borderColor: "#4a2f1a",
    marginTop: -1,
  },
  flower: {
    position: "absolute",
    alignItems: "center",
  },
  flower1: {
    left: 20,
    bottom: 15,
  },
  flower2: {
    right: 25,
    bottom: 8,
  },
  flower3: {
    left: 35,
    bottom: 20,
  },
  flowerPetals: {
    width: 12,
    height: 12,
    backgroundColor: "#ff69b4",
    borderWidth: 1,
    borderColor: "#ff1493",
    borderRadius: 2,
  },
  flowerCenter: {
    width: 4,
    height: 4,
    backgroundColor: "#ffd700",
    borderWidth: 1,
    borderColor: "#ffb347",
    borderRadius: 1,
    position: "absolute",
    top: 4,
    left: 4,
  },
  flowerStem: {
    width: 2,
    height: 8,
    backgroundColor: "#4a7c4a",
    borderWidth: 1,
    borderColor: "#2d5a2d",
    marginTop: -1,
  },
  bush: {
    position: "absolute",
    width: 32,
    height: 20,
    backgroundColor: "#6b8e6b",
    borderWidth: 2,
    borderColor: "#4a6b4a",
    borderRadius: 4,
  },
  rock: {
    position: "absolute",
    width: 24,
    height: 16,
    backgroundColor: "#8b8680",
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 3,
  },
  rockSmall: {
    position: "absolute",
    width: 16,
    height: 12,
    backgroundColor: "#a9a9a9",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 2,
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
  leafC: {
    top: 95,
    right: 65,
    backgroundColor: "#7fb869",
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
  cloudSmall: {
    top: 35,
    right: 25,
    width: 60,
    height: 18,
  },
  butterfly: {
    position: "absolute",
    top: 60,
    left: 40,
    width: 16,
    height: 12,
  },
  butterflyWing: {
    position: "absolute",
    width: 8,
    height: 10,
    backgroundColor: "#ff6b9d",
    borderWidth: 1,
    borderColor: "#c44569",
    borderRadius: 2,
  },
  butterflyWingLeft: {
    left: 0,
    transform: [{ rotate: '-15deg' }],
  },
  butterflyWingRight: {
    right: 0,
    transform: [{ rotate: '15deg' }],
  },
  butterflyBody: {
    position: "absolute",
    left: 7,
    top: 2,
    width: 2,
    height: 8,
    backgroundColor: "#2c2c2c",
    borderRadius: 1,
  },
});
