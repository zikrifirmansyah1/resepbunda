import {
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
    useFonts,
} from "@expo-google-fonts/mulish";

export function useMulishFonts() {
  const [loaded] = useFonts({
    Mulish_400Regular,
    Mulish_500Medium,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  return { loaded };
}

export const mulish = {
  regular: "Mulish_400Regular",
  medium: "Mulish_500Medium",
  semibold: "Mulish_600SemiBold",
  bold: "Mulish_700Bold",
};
