import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceFormScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Formulário do Lugar</Text>
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

export default PlaceFormScreen;
