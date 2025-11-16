import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

export const PlacesContext = React.createContext<PlacesContextType | null>(null);

const App: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const loadedPlaces = await loadPlaces();
        setPlaces(loadedPlaces);
      } catch (e) {
        console.error("Failed to load places.", e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      savePlaces(places);
    }
  }, [places, isLoading]);

  const addPlace = useCallback((data: Omit<Place, 'id'>) => {
    setPlaces(currentPlaces => {
      const newPlace: Place = {
        id: new Date().toISOString() + Math.random().toString(), // Chave única e robusta
        ...data,
      };
      // Retorna um NOVO array, garantindo a atualização da interface
      return [...currentPlaces, newPlace];
    });
  }, []);

  const updatePlace = useCallback((updatedPlace: Place) => {
    setPlaces(currentPlaces => 
      // .map() já retorna um novo array
      currentPlaces.map(p => (p.id === updatedPlace.id ? updatedPlace : p))
    );
  }, []);

  const removePlace = useCallback((id: string) => {
    setPlaces(currentPlaces => 
      // .filter() já retorna um novo array
      currentPlaces.filter(p => p.id !== id)
    );
  }, []);

  // Memoiza o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(() => ({
    places,
    isLoading,
    addPlace,
    updatePlace,
    removePlace,
  }), [places, isLoading, addPlace, updatePlace, removePlace]);

  return (
    <PlacesContext.Provider value={contextValue}>
      <RootNavigator />
    </PlacesContext.Provider>
  );
};

export default App;
