import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlacesListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Lista de Lugares</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlacesListScreen;
