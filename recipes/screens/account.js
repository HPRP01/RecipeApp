import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import firebase from 'firebase/compat/app';

export default function AccountScreen({ navigation }) {
  let signout = () =>
  {
    firebase.auth().signOut()
    .then(() => {
      console.log('Signed out')
    }).catch(error => {
      console.log('An error has occured')
    });
  }

  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Account Screen</Text>
      <Button 
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Button 
        title="My Posts"  
        onPress={() => Alert.alert('View posts')}
      />
      <Button 
        title="Sign out"
        onPress={signout}
      />
    </View>
  ); 
}