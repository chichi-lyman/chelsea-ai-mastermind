import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue, 
  useEffect 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const LiquidBackground = () => {
  const blob1X = useSharedValue(0);
  const blob2X = useSharedValue(width);
  const blob3Y = useSharedValue(height);

  useEffect(() => {
    blob1X.value = withRepeat(withTiming(width * 0.5, { duration: 15000 }), -1, true);
    blob2X.value = withRepeat(withTiming(0, { duration: 18000 }), -1, true);
    blob3Y.value = withRepeat(withTiming(height * 0.4, { duration: 12000 }), -1, true);
  }, []);

  const blob1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }],
  }));

  const blob2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }],
  }));

  const blob3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: blob3Y.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#0F172A', '#1E1B4B', '#312E81']}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.blob, styles.blob1, blob1Style]}>
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0)']}
          style={styles.fill}
        />
      </Animated.View>

      <Animated.View style={[styles.blob, styles.blob2, blob2Style]}>
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0)']}
          style={styles.fill}
        />
      </Animated.View>

      <Animated.View style={[styles.blob, styles.blob3, blob3Style]}>
        <LinearGradient
          colors={['rgba(219, 39, 119, 0.2)', 'rgba(219, 39, 119, 0)']}
          style={styles.fill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    opacity: 0.6,
  },
  blob1: {
    top: -100,
    left: -100,
  },
  blob2: {
    bottom: -100,
    right: -100,
  },
  blob3: {
    top: height * 0.3,
    left: width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
  },
  fill: {
    flex: 1,
    borderRadius: 999,
  },
});
