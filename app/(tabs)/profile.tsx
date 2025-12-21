import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../src/providers/AuthProvider";

export default function Profile() {
  const { session, signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Profil</Text>
      <Text>{session?.email}</Text>

      <Pressable
        onPress={signOut}
        style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: "#eee" }}
      >
        <Text>Keluar</Text>
      </Pressable>
    </View>
  );
}
