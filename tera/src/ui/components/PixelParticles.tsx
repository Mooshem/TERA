import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type ParticleType = "sparkle" | "leaf" | "star" | "heart";

type PixelParticlesProps = {
  type: ParticleType;
  count?: number;
  duration?: number;
  trigger?: boolean;
};

export function PixelParticles({ 
  type, 
  count = 5, 
  duration = 2000,
  trigger = false 
}: PixelParticlesProps) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      anim: new Animated.Value(0),
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    }))
  ).current;

  useEffect(() => {
    if (trigger) {
      particles.forEach((particle) => {
        Animated.parallel([
          Animated.timing(particle.anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration: 0,
            delay: duration,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [trigger, particles, duration]);

  const getParticleStyle = (particle: any) => {
    const baseStyle = {
      position: "absolute",
      width: 8,
      height: 8,
    };

    switch (type) {
      case "sparkle":
        return {
          ...baseStyle,
          backgroundColor: "#ffd700",
          borderRadius: 2,
          opacity: particle.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.x],
              }),
            },
            {
              translateY: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.y - 30],
              }),
            },
            {
              scale: particle.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [particle.scale, 1.2, particle.scale],
              }),
            },
            {
              rotate: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${particle.rotation}deg`],
              }),
            },
          ],
        };
      
      case "leaf":
        return {
          ...baseStyle,
          width: 6,
          height: 6,
          backgroundColor: "#7cb342",
          borderRadius: 1,
          opacity: particle.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.x],
              }),
            },
            {
              translateY: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.y + 20],
              }),
            },
            {
              rotate: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", `${particle.rotation * 2}deg`],
              }),
            },
          ],
        };
      
      case "star":
        return {
          ...baseStyle,
          width: 10,
          height: 10,
          backgroundColor: "#ffd700",
          borderRadius: 1,
          opacity: particle.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.x],
              }),
            },
            {
              translateY: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.y - 40],
              }),
            },
            {
              scale: particle.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.5, 0.8],
              }),
            },
          ],
        };
      
      case "heart":
        return {
          ...baseStyle,
          width: 12,
          height: 10,
          backgroundColor: "#ff6b6b",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          opacity: particle.anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateX: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.x],
              }),
            },
            {
              translateY: particle.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, particle.y - 25],
              }),
            },
            {
              scale: particle.anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [particle.scale, 1.3, particle.scale],
              }),
            },
          ],
        };
      
      default:
        return baseStyle;
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
});
