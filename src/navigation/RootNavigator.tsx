import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import PlaceFormScreen from '../screens/PlaceFormScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import { Place } from '../types/Place';

export type RootStackParamList = {
  Map: undefined;
  PlaceForm: { placeId?: string; latitude?: number; longitude?: number } | undefined;
  PlacesList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
        <Stack.Screen 
          name="PlaceForm" 
          component={PlaceFormScreen} 
          options={({ route }) => ({ 
            title: route.params?.placeId ? 'Editar Lugar' : 'Novo Lugar' 
          })} 
        />
        <Stack.Screen name="PlacesList" component={PlacesListScreen} options={{ title: 'Lugares Salvos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
