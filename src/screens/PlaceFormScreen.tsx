import React, { useState, useContext, useEffect } from 'react';
import { Button, Alert, ActivityIndicator, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import styled from 'styled-components/native';

import { PlacesContext, PlacesContextType } from '../../App';
import { RootStackParamList } from '../navigation/RootNavigator';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

type PlaceFormScreenRouteProp = RouteProp<RootStackParamList, 'PlaceForm'>;

const PlaceFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PlaceFormScreenRouteProp>();
  const placesContext = useContext(PlacesContext);

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [color, setColor] = useState('#FF0000');

  const placeId = route.params?.placeId;

  useEffect(() => {
    if (placeId && placesContext) {
      const existingPlace = placesContext.places.find(p => p.id === placeId);
      if (existingPlace) {
        setName(existingPlace.name);
        setLatitude(existingPlace.latitude.toString());
        setLongitude(existingPlace.longitude.toString());
        setColor(existingPlace.color);
      }
    } else if (route.params?.latitude) {
      setLatitude(route.params.latitude.toString());
      setLongitude(route.params.longitude.toString());
    }
  }, [placeId, placesContext]);

  if (!placesContext) {
    return <Text>Erro no contexto de locais</Text>;
  }
  
  const { addPlace, updatePlace, removePlace } = placesContext;

  const handleSave = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (!name || !latitude || !longitude) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const placeData = { name, latitude: lat, longitude: lon, color };

    if (placeId) {
      updatePlace({ ...placeData, id: placeId });
    } else {
      addPlace(placeData);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (placeId) {
      Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que quer apagar este lugar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Apagar', style: 'destructive', onPress: () => {
            removePlace(placeId);
            navigation.goBack();
          }},
        ]
      );
    }
  };

  return (
    <Container>
      <Label>Nome do Local</Label>
      <Input value={name} onChangeText={setName} placeholder="Ex: Minha Casa" />

      <Label>Latitude</Label>
      <Input value={latitude} onChangeText={setLatitude} keyboardType="numeric" />

      <Label>Longitude</Label>
      <Input value={longitude} onChangeText={setLongitude} keyboardType="numeric" />

      <Label>Cor do Marcador (Hex)</Label>
      <Input value={color} onChangeText={setColor} placeholder="Ex: #FF0000" autoCapitalize="none" />

      <ButtonContainer>
        <Button title={placeId ? 'Atualizar' : 'Salvar'} onPress={handleSave} />
      </ButtonContainer>

      {placeId && (
        <ButtonContainer>
          <Button title="Apagar Lugar" color="#FF3B30" onPress={handleDelete} />
        </ButtonContainer>
      )}
    </Container>
  );
};

export default PlaceFormScreen;
