import AsyncStorage from "@react-native-async-storage/async-storage";

export type Shift = {
  id: string;
  title: string;
  dateISO: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  alarmMinutesBefore: number; // minutes
};

const SHIFTS_KEY = "shifts:v1";

export async function loadShifts(): Promise<Shift[]> {
  const raw = await AsyncStorage.getItem(SHIFTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Shift[];
  } catch {
    return [];
  }
}

export async function saveShifts(shifts: Shift[]): Promise<void> {
  await AsyncStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
}

export async function addShift(shift: Shift): Promise<Shift[]> {
  const all = await loadShifts();
  const updated = [shift, ...all].sort((a, b) =>
    a.dateISO.localeCompare(b.dateISO) || a.startTime.localeCompare(b.startTime)
  );
  await saveShifts(updated);
  return updated;
}

export async function deleteShift(id: string): Promise<Shift[]> {
  const all = await loadShifts();
  const updated = all.filter((s) => s.id !== id);
  await saveShifts(updated);
  return updated;
}

export function isSameDate(aISO: string, bISO: string): boolean {
  return aISO === bISO;
}