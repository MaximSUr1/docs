import { View } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { Shift } from "../lib/storage";

export default function ShiftCard({ shift, onDelete }: { shift: Shift; onDelete?: (id: string) => void }) {
  return (
    <Card style={{ marginVertical: 6 }}>
      <Card.Title
        title={shift.title}
        subtitle={`${shift.dateISO} • ${shift.startTime}–${shift.endTime}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => onDelete?.(shift.id)}
            accessibilityLabel="Удалить смену"
          />
        )}
      />
      <Card.Content>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Text>Напоминание: за {shift.alarmMinutesBefore} мин</Text>
        </View>
      </Card.Content>
    </Card>
  );
}