import { View } from "react-native";
import { Text } from "react-native-paper";

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 32 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        {title}
      </Text>
      {subtitle ? <Text style={{ color: "#666" }}>{subtitle}</Text> : null}
    </View>
  );
}