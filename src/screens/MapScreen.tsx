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
  const placesContext = useContext(PlacesContext) as PlacesContextType;
  const navigation = useNavigation<Nav>();

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
      {placesContext.places.length > 0 ? (
        <FlatList
          data={placesContext.places}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum lugar favorito adicionado.</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const MapScreen: React.FC = () => {
  const placesContext = useContext(PlacesContext) as PlacesContextType;
  const navigation = useNavigation<Nav>();
  const [region, setRegion] = useState<Region | null>(null);
  const { width } = useWindowDimensions();

  const { places } = placesContext;
  const isTablet = width >= 600;

  useEffect(() => {
    const requestLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permissão Negada');
          setRegion({ latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
          return;
        }
      }
      Geolocation.getCurrentPosition(
        (pos) => setRegion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }),
        (err) => {
          console.log(err);
          setRegion({ latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    requestLocation();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    navigation.navigate('PlaceForm', { latitude, longitude });
  };

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Obtendo localização...</Text>
      </View>
    );
  }

  const mapContent = (
    <View style={styles.mapContainer}>
      <MapView 
        key={places.length}
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        region={region} 
        onPress={handleMapPress}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            pinColor={place.color}
            onPress={() => navigation.navigate('PlaceForm', { placeId: place.id })}
            tracksViewChanges={false}
          />
        ))}
      </MapView>
      <Fab onPress={() => navigation.navigate('PlaceForm', {})} />
    </View>
  );

  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        {mapContent}
        <PlacesList />
      </View>
    );
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
  tabletContainer: { flex: 1, flexDirection: 'row' },
  mapContainer: { flex: 2 },
  listContainer: { flex: 1, borderLeftWidth: 1, borderLeftColor: '#ccc' },
  map: { flex: 1 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  colorIndicator: { width: 20, height: 20, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  itemSubtitle: { fontSize: 14, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
});

export default MapScreen;
