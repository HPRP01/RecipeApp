import React from 'react';
import { View, Text, Button } from 'react-native';

export default function FollowingScreen({ navigation }) {
  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Following</Text>
      <Button 
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  ); 
}