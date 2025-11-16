
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from '../types/Place';

const KEY = '@places';

export async function loadPlaces(): Promise<Place[]> {
  const data = await AsyncStorage.getItem(KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Place[];
  } catch {
    return [];
  }
}

export async function savePlaces(places: Place[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(places));
}

