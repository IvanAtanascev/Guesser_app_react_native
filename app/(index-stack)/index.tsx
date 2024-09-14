import { CategoryDisplay } from "@/layers/presentation/displayCategoriesComponent";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";

export default function IndexPage() {
  return (
    <View style={styles.container}>
      <CategoryDisplay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
