import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from '../types/Place';

const STORAGE_KEY = '@favorite_places';

export const savePlaces = async (places: Place[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(places);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save places to storage', e);
  }
};

export const loadPlaces = async (): Promise<Place[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load places from storage', e);
    return [];
  }
};
