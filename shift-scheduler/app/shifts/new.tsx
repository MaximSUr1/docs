import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, TextInput, HelperText } from "react-native-paper";
import { addShift } from "../../lib/storage";
import { ensureNotificationPermission, scheduleShiftAlarm } from "../../lib/notifications";

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function NewShiftScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();

  const [title, setTitle] = useState("Смена");
  const [dateISO, setDateISO] = useState(params.date ?? "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [alarmBefore, setAlarmBefore] = useState("30");

  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(dateISO);
  const timeValid = /^\d{2}:\d{2}$/.test(startTime) && /^\d{2}:\d{2}$/.test(endTime);

  const onSave = async () => {
    if (!dateValid || !timeValid) return;

    const id = generateId();
    await addShift({
      id,
      title: title.trim() || "Смена",
      dateISO,
      startTime,
      endTime,
      alarmMinutesBefore: Number(alarmBefore) || 0,
    });

    const granted = await ensureNotificationPermission();
    if (granted) {
      await scheduleShiftAlarm({ id, title, dateISO, startTime, alarmMinutesBefore: Number(alarmBefore) || 0 });
    }

    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Новая смена" />
      </Appbar.Header>

      <View style={{ padding: 16, gap: 12 }}>
        <TextInput label="Название" value={title} onChangeText={setTitle} mode="outlined" />
        <TextInput label="Дата (ГГГГ-ММ-ДД)" value={dateISO} onChangeText={setDateISO} mode="outlined" />
        <HelperText type={dateValid ? "info" : "error"} visible>
          {dateValid ? "Например, 2025-08-01" : "Неверный формат даты"}
        </HelperText>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput label="Начало (ЧЧ:ММ)" value={startTime} onChangeText={setStartTime} mode="outlined" />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput label="Конец (ЧЧ:ММ)" value={endTime} onChangeText={setEndTime} mode="outlined" />
          </View>
        </View>
        <HelperText type={timeValid ? "info" : "error"} visible>
          {timeValid ? "24-часовой формат" : "Неверный формат времени"}
        </HelperText>
        <TextInput
          label="Напоминание за (мин)"
          value={alarmBefore}
          onChangeText={setAlarmBefore}
          keyboardType="numeric"
          mode="outlined"
        />
        <Button mode="contained" onPress={onSave} disabled={!dateValid || !timeValid}>
          Сохранить
        </Button>
      </View>
    </View>
  );
}