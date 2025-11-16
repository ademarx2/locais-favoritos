import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
  PermissionsAndroid,
  Platform,
  useWindowDimensions,
  Text,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { PlacesContext } from '../../App';
import Fab from '../components/Fab';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const placesContext = useContext(PlacesContext);
  const navigation = useNavigation<Nav>();
  const [region, setRegion] = useState<Region | null>(null);
  const { width } = useWindowDimensions();

  if (!placesContext) {
    return (
      <View style={styles.loading}>
        <Text>Erro: Contexto de Lugares não encontrado!</Text>
      </View>
    );
  }
  const { places } = placesContext;

  const isTablet = width >= 600;

  useEffect(() => {
    const requestLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setRegion({
              latitude: -23.5505,
              longitude: -46.6333,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
            return;
          }
        } catch (err) {
          console.error('Erro ao solicitar permissão:', err);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
        (error) => {
          console.error('Erro ao obter posição:', error);
          setRegion({
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    };

    requestLocation();
  }, []);

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Obtendo localização...</Text>
      </View>
    );
  }

  const mapContent = (
    <>
      <MapView style={styles.map} region={region}>
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            pinColor={place.color}
            onPress={() =>
              navigation.navigate('PlaceForm', {
                placeId: place.id,
                latitude: place.latitude,
                longitude: place.longitude,
              })
            }
          />
        ))}
      </MapView>
      <Fab onPress={() => navigation.navigate('PlaceForm', undefined)} />
    </>
  );

  if (isTablet) {
    return <View style={styles.container}>{mapContent}</View>;
  }

  return (
    <View style={styles.container}>
      {mapContent}
      <Button title="Ver Lista" onPress={() => navigation.navigate('PlacesList')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
});

export default MapScreen;
