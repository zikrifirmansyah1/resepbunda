import { Stack, router, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDatabase } from "../src/hooks/useDatabase";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";
import { theme } from "../src/theme";
function Splash() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.neutral.bg }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
}

function GuardedStack({ appReady }: { appReady: boolean }) {
  const { ready: authReady, session } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!appReady || !authReady) return;

    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) router.replace("/(auth)/login");
    else if (session && inAuth) router.replace("/(tabs)");
  }, [appReady, authReady, session, segments]);

  if (!appReady || !authReady) return <Splash />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const dbReady = useDatabase();
  return (
    <AuthProvider dbReady={dbReady}>
      <GuardedStack appReady={dbReady} />
    </AuthProvider>
  );
}
