import { addDays, startOfWeek, format } from "date-fns";
import { ru } from "date-fns/locale";
import { View, Pressable } from "react-native";
import { Text } from "react-native-paper";

export function getISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function WeekStrip(props: {
  selectedISO: string;
  onSelect: (iso: string) => void;
}) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
      {days.map((d) => {
        const iso = getISO(d);
        const isSel = iso === props.selectedISO;
        return (
          <Pressable
            key={iso}
            onPress={() => props.onSelect(iso)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: isSel ? "#6750A4" : "#EEE",
            }}
          >
            <Text style={{ color: isSel ? "white" : "#111", textAlign: "center" }}>
              {format(d, "EEE", { locale: ru })}
            </Text>
            <Text style={{ color: isSel ? "white" : "#111", textAlign: "center", fontWeight: "bold" }}>
              {format(d, "d", { locale: ru })}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}