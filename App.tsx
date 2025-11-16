import React, { useEffect, useState, createContext } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { Place } from './src/types/Place';
import { loadPlaces, savePlaces } from './src/storage/placesStorage';

export type PlacesContextType = {
  places: Place[];
  isLoading: boolean;
  addPlace: (place: Omit<Place, 'id'>) => void;
  updatePlace: (place: Place) => void;
  removePlace: (id: string) => void;
};

export const PlacesContext = createContext<PlacesContextType | null>(null);

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlaces().then(loadedPlaces => {
      if(loadedPlaces) {
        setPlaces(loadedPlaces);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      savePlaces(places);
    }
  }, [places, isLoading]);

  const addPlace = (newPlaceData: Omit<Place, 'id'>) => {
    const newPlace: Place = {
      id: Date.now().toString(),
      ...newPlaceData,
    };
    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
  };

  const updatePlace = (placeToUpdate: Place) => {
    const updatedPlaces = places.map(p => {
      if (p.id === placeToUpdate.id) {
        return placeToUpdate;
      }
      return p;
    });
    setPlaces(updatedPlaces);
  };

  const removePlace = (idToRemove: string) => {
    const filteredPlaces = places.filter(p => p.id !== idToRemove);
    setPlaces(filteredPlaces);
  };

  return (
    <PlacesContext.Provider value={{ places, isLoading, addPlace, updatePlace, removePlace }}>
      <RootNavigator />
    </PlacesContext.Provider>
  );
};

export default App;
