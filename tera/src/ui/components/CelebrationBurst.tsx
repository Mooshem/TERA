import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type CelebrationBurstProps = {
  triggerKey: number;
  message: string;
};

export function CelebrationBurst({ triggerKey, message }: CelebrationBurstProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    if (!triggerKey) return;

    fade.setValue(0);
    rise.setValue(6);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(rise, {
          toValue: -8,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fade, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();
  }, [triggerKey, fade, rise]);

  return (
    <Animated.View style={[styles.wrap, { opacity: fade, transform: [{ translateY: rise }] }]}>
      <Text style={styles.text}>✨ {message} ✨</Text>
      <View style={styles.sparkRow}>
        <Text style={styles.spark}>🌿</Text>
        <Text style={styles.spark}>🎉</Text>
        <Text style={styles.spark}>🌱</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginVertical: 4,
  },
  text: {
    color: "#1f6a33",
    fontWeight: "800",
    fontSize: 13,
  },
  sparkRow: {
    flexDirection: "row",
    gap: 6,
  },
  spark: {
    fontSize: 13,
  },
});
