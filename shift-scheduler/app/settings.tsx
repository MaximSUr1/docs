import { View } from "react-native";
import { Appbar, List } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Настройки" />
      </Appbar.Header>
      <List.Section>
        <List.Subheader>Общие</List.Subheader>
        <List.Item title="Тема" description="Светлая" left={(p) => <List.Icon {...p} icon="palette" />} />
      </List.Section>
    </View>
  );
}