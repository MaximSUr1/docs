import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const req = await Notifications.requestPermissionsAsync();
  return !!(req.granted || req.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
}

export async function scheduleShiftAlarm(options: {
  id: string;
  title: string;
  dateISO: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  alarmMinutesBefore: number;
}) {
  const { dateISO, startTime, alarmMinutesBefore, title, id } = options;
  const [year, month, day] = dateISO.split("-").map((x) => Number(x));
  const [hours, minutes] = startTime.split(":").map((x) => Number(x));
  const start = new Date(year, month - 1, day, hours, minutes, 0);
  const fireAt = new Date(start.getTime() - alarmMinutesBefore * 60_000);

  if (fireAt.getTime() <= Date.now()) return null;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Смена скоро: ${title}`,
      body: `Начало в ${startTime}`,
      sound: "default",
    },
    trigger: {
      date: fireAt,
      channelId: "shift-alarms",
    },
  });

  return identifier;
}