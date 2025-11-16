import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import PlaceFormScreen from '../screens/PlaceFormScreen';
import PlacesListScreen from '../screens/PlacesListScreen';

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
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Meus Lugares' }} />
        <Stack.Screen 
          name="PlaceForm" 
          component={PlaceFormScreen} 
          options={{ title: 'Salvar Lugar' }} 
        />
        <Stack.Screen name="PlacesList" component={PlacesListScreen} options={{ title: 'Lista de Lugares' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
