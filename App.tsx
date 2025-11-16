import React, { useEffect, useState } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { Place } from './src/types/Place';
import { loadPlaces, savePlaces } from './src/storage/placesStorage';

export type PlacesContextType = {
  places: Place[];
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (place: Place) => void;
  removePlace: (id: string) => void;
};

export const PlacesContext = React.createContext<PlacesContextType | null>(null);

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    // carrega do AsyncStorage
    loadPlaces().then(setPlaces);
  }, []);

  useEffect(() => {
    // salva sempre que mudar
    savePlaces(places);
  }, [places]);

  const addPlace = (data: Omit<Place, 'id'>) => {
    const newPlace: Place = {
      id: Date.now().toString(),
      ...data,
    };
    setPlaces((prev) => [...prev, newPlace]);
  };

  const updatePlace = (place: Place) => {
    setPlaces((prev) => prev.map((p) => (p.id === place.id ? place : p)));
  };

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PlacesContext.Provider value={{ places, addPlace, updatePlace, removePlace }}>
      <RootNavigator />
    </PlacesContext.Provider>
  );
};

export default App;
