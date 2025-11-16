import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlacesContext, PlacesContextType } from '../../App';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Place } from '../types/Place';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PlacesList'>;

const PlacesListScreen: React.FC = () => {
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
        <Text style={styles.itemSubtitle}>{
          `Lat: ${item.latitude.toFixed(4)}, Lon: ${item.longitude.toFixed(4)}`
        }</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {placesContext.places.length > 0 ? (
        <FlatList
          data={placesContext.places}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum lugar favorito adicionado ainda.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default PlacesListScreen;
