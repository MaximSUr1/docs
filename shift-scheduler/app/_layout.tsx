import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { Platform } from "react-native";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6750A4",
    secondary: "#625B71",
    tertiary: "#7D5260",
  },
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      (async () => {
        try {
          await Notifications.setNotificationChannelAsync("shift-alarms", {
            name: "Shift Alarms",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [250, 250, 500, 250],
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          });
        } catch (e) {
          // channel setup failed; continue without blocking app start
        }
      })();
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Мои смены" }} />
        <Stack.Screen name="shifts/new" options={{ title: "Новая смена" }} />
        <Stack.Screen name="settings" options={{ title: "Настройки" }} />
      </Stack>
    </PaperProvider>
  );
}