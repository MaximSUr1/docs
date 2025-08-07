import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { FAB, Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import WeekStrip, { getISO } from "../components/WeekStrip";
import ShiftCard from "../components/ShiftCard";
import EmptyState from "../components/EmptyState";
import { loadShifts, Shift, deleteShift, isSameDate } from "../lib/storage";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedISO, setSelectedISO] = useState<string>(getISO(new Date()));
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const load = async () => {
      setShifts(await loadShifts());
    };
    const unsub = router.addListener("focus", load);
    load();
    return () => unsub();
  }, [router]);

  const todays = shifts.filter((s) => isSameDate(s.dateISO, selectedISO));

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Плавающий график" />
        <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
      </Appbar.Header>

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <WeekStrip selectedISO={selectedISO} onSelect={setSelectedISO} />
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        {todays.length === 0 ? (
          <EmptyState title="Смен нет" subtitle="Нажмите + чтобы добавить" />
        ) : (
          todays.map((s) => (
            <ShiftCard
              key={s.id}
              shift={s}
              onDelete={async (id) => setShifts(await deleteShift(id))}
            />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={{ position: "absolute", right: 24, bottom: 24 }}
        onPress={() => router.push("/shifts/new?date=" + selectedISO)}
        label="Смена"
      />
    </View>
  );
}