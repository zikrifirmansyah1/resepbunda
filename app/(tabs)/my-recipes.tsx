import { Text, View } from "react-native";
import { theme } from "../../src/theme";

export default function MyRecipes() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.neutral.bg }}>
      <Text style={{ fontFamily: theme.font.bold, fontSize: 18, color: theme.colors.neutral.dark }}>
        Resep Saya
      </Text>
      <Text style={{ marginTop: 6, fontFamily: theme.font.regular, color: theme.colors.neutral.medium }}>
        Daftar resep buatanmu akan tampil di sini.
      </Text>
    </View>
  );
}
