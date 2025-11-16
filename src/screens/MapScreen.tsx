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
  Alert,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Region, MapPressEvent, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlacesContext, PlacesContextType } from '../../App';
import Fab from '../components/Fab';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Place } from '../types/Place';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const PlacesList = () => {
  const placesContext = useContext(PlacesContext);
  const navigation = useNavigation<Nav>();

  if (!placesContext) {
    return <Text>Erro ao carregar locais.</Text>;
  }

  const { places } = placesContext;

  const renderItem = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('PlaceForm', { placeId: item.id })}
    >
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{`Lat: ${item.latitude.toFixed(4)}, Lon: ${item.longitude.toFixed(4)}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.listContainer}>
      {places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum lugar favorito adicionado.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const MapScreen: React.FC = () => {
  const placesContext = useContext(PlacesContext);
  const navigation = useNavigation<Nav>();
  const [region, setRegion] = useState<Region | null>(null);
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permissão Negada', 'A permissão de localização é necessária para mostrar o mapa.');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => {
          console.log(error);
          Alert.alert('Erro de Localização', error.message);
          setRegion({ latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  if (!placesContext) {
    return <Text>Contexto não encontrado!</Text>;
  }
  
  const { places, isLoading } = placesContext;

  const handleMapPress = (event: MapPressEvent) => {
    const coords = event.nativeEvent.coordinate;
    navigation.navigate('PlaceForm', { latitude: coords.latitude, longitude: coords.longitude });
  };

  if (!region || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Carregando mapa...</Text>
      </View>
    );
  }

  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        <View style={styles.mapContainer}>
          <MapView
            key={places.map(p => `${p.id}-${p.name}-${p.color}`).join(',')}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
            zoomControlEnabled={true}
          >
            {places.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                onPress={() => navigation.navigate('PlaceForm', { placeId: place.id })}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={[styles.customMarker, { backgroundColor: place.color || '#FF0000' }]}>
                  <Text style={styles.markerText}>{place.name}</Text>
                </View>
              </Marker>
            ))}
          </MapView>
          <Fab onPress={() => navigation.navigate('PlaceForm', {})} style={{ bottom: 20, right: 'auto', left: 20 }} />
        </View>
        <PlacesList />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={places.map(p => `${p.id}-${p.name}-${p.color}`).join(',')}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            onPress={() => navigation.navigate('PlaceForm', { placeId: place.id })}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={[styles.customMarker, { backgroundColor: place.color || '#FF0000' }]}>
              <Text style={styles.markerText}>{place.name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      {places.length > 0 && (
        <View style={styles.mobileButtonContainer}>
          <Button title="Ver Lista" onPress={() => navigation.navigate('PlacesList')} />
        </View>
      )}
      <Fab
        onPress={() => navigation.navigate('PlaceForm', {})}
        style={{ bottom: 80, right: 'auto', left: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabletContainer: { flex: 1, flexDirection: 'row' },
  mapContainer: { flex: 2 },
  listContainer: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#ccc' },
  map: { ...StyleSheet.absoluteFillObject },
  mobileButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(242, 242, 247, 0.8)',
  },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  colorIndicator: { width: 20, height: 20, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  itemSubtitle: { fontSize: 14, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
  customMarker: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MapScreen;
