import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, router } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../src/theme";

function AnimatedTabItem({
  label,
  focused,
  iconName,
  onPress,
}: {
  label: string;
  focused: boolean;
  iconName: { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: focused ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const bubbleOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const color = focused ? theme.colors.primary.DEFAULT : "#CBD5E1";

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[styles.iconWrap, { transform: [{ translateY }, { scale }] }]}>
        <Animated.View pointerEvents="none" style={[styles.bubble, { opacity: bubbleOpacity }]} />
        <Ionicons name={focused ? iconName.active : iconName.inactive} size={24} color={color} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: focused ? theme.colors.primary.DEFAULT : "#CBD5E1" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FloatingPlusButton({ onPress }: { onPress: () => void }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const pressIn = () => Animated.spring(scaleValue, { toValue: 0.92, useNativeDriver: true }).start();
  const pressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
    onPress();
  };

  return (
    <View style={styles.fabSlot} pointerEvents="box-none">
      <Pressable onPressIn={pressIn} onPressOut={pressOut} style={styles.fabTouchable}>
        <Animated.View style={[styles.fabCircle, { transform: [{ scale: scaleValue }] }]}>
          <Ionicons name="add" size={32} color="#fff" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

function CustomTabBar(props: BottomTabBarProps) {
  const { state, navigation } = props;

  const meta = useMemo(
    () => ({
      index: { label: "Beranda", icon: { active: "home", inactive: "home-outline" } as const },
      "my-recipes": { label: "Resepku", icon: { active: "book", inactive: "book-outline" } as const },
      saved: { label: "Disimpan", icon: { active: "bookmark", inactive: "bookmark-outline" } as const },
      profile: { label: "Profil", icon: { active: "person", inactive: "person-outline" } as const },
    }),
    []
  );

  const focusedName = state.routes[state.index]?.name;
  const leftRoutes = ["index", "my-recipes"];
  const rightRoutes = ["saved", "profile"];

  const go = (name: string) => navigation.navigate(name as never);

  return (
    <View style={styles.tabBarOuter} pointerEvents="box-none">
      <View style={styles.tabBarPill}>
        {leftRoutes.map((name) => (
          <AnimatedTabItem
            key={name}
            label={(meta as any)[name].label}
            iconName={(meta as any)[name].icon}
            focused={focusedName === name}
            onPress={() => go(name)}
          />
        ))}

        <View style={{ width: 84 }} />

        {rightRoutes.map((name) => (
          <AnimatedTabItem
            key={name}
            label={(meta as any)[name].label}
            iconName={(meta as any)[name].icon}
            focused={focusedName === name}
            onPress={() => go(name)}
          />
        ))}

        <FloatingPlusButton onPress={() => router.push("/(tabs)/create-form")} />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="my-recipes" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />

      {/* hidden but still part of (tabs) because file exists in (tabs) */}
      <Tabs.Screen name="create" options={{ href: null }} />
      <Tabs.Screen name="create-form" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "ios" ? 18 : 14,
    paddingHorizontal: 16,
  },
  tabBarPill: {
    height: 72,
    backgroundColor: "#fff",
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  tabItem: { width: 62, alignItems: "center", justifyContent: "center", gap: 4 },
  iconWrap: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  bubble: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary.bg,
  },
  tabLabel: { fontSize: 10, fontFamily: theme.font.medium, marginTop: -2 },

  fabSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    top: -2,
  },
  fabTouchable: {
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
  },
  fabCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    borderWidth: 4,
    borderColor: "#fff",
  },
});
