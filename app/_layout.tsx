import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlinkProvider, createTamagui, tamaguiDefaultConfig, Theme, BlinkToastProvider } from '@blinkdotnew/mobile-ui';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LiquidBackground } from '@/src/components/LiquidBackground';
import { startSwarmOrchestration, stopSwarmOrchestration } from '@/src/services/SwarmOrchestrator';
import React, { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const config = createTamagui({ ...tamaguiDefaultConfig });

function WebStyleReset() {
  if (Platform.OS !== 'web') return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          input:focus,textarea:focus{outline:none!important}
          body { background-color: #0F172A; }
        `,
      }}
    />
  );
}

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    startSwarmOrchestration();
    return () => stopSwarmOrchestration();
  }, []);

  return (
    <BlinkProvider config={config} palette="rose" defaultTheme="light">
      <Theme name="light">
        <QueryClientProvider client={queryClient}>
          <BlinkToastProvider>
            <View style={styles.container}>
              <LiquidBackground />
              <WebStyleReset />
              <Stack screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
              }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="light" />
            </View>
          </BlinkToastProvider>
        </QueryClientProvider>
      </Theme>
    </BlinkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
