import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

const FabContainer = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
  background-color: #6200ee;
  elevation: 4;
`;

const FabText = styled.Text`
  color: #ffffff;
  font-size: 32px;
  line-height: 32px;
  margin-bottom: 2px;
`;

type Props = TouchableOpacityProps;

const Fab: React.FC<Props> = (props) => (
  <FabContainer {...props}>
    <FabText>+</FabText>
  </FabContainer>
);

export default Fab;
