import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '@/constants/design';

export function GlassCard({ title, children, accent }: { title?: string; children: React.ReactNode; accent?: string }) {
  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={Platform.OS === 'ios' ? 45 : 80} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.content}
        >
          {title && (
            <View style={styles.header}>
              <Text style={[styles.title, accent ? { color: accent } : {}]}>{title}</Text>
              {accent && <View style={[styles.dot, { backgroundColor: accent }]} />}
            </View>
          )}
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blur: { flex: 1 },
  content: { padding: spacing.md, borderRadius: borderRadius.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
