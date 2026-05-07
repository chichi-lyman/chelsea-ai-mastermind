import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export function GlassCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={40} tint="light" style={styles.blur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'transparent']}
          style={styles.content}
        >
          <Text style={styles.title}>{title}</Text>
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 20,
  },
  blur: { padding: 2 },
  content: { padding: 20, borderRadius: 28 },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8e4d5a',
    letterSpacing: 2,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
});