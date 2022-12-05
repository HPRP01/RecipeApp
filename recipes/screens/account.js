import React from 'react';
import { View, Button } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FollowingScreen from './following';
import UserPostsScreen from './userPosts';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  let signout = () =>
  {
    firebase.auth().signOut()
    .then(() => {
      console.log('Signed out')
    }).catch(error => {
      console.log('An error has occured' + error);
    });
  }

  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button 
        title="Following"
        onPress={() => navigation.navigate("Following")}
      />
      <Button 
        title="My Posts"  
        onPress={() => navigation.navigate("My Posts")}
      />
      <Button 
        title="Sign out"
        onPress={signout}
      />
    </View>
  ); 
}

export default function AccountScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Home}  
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Following"
        component={FollowingScreen}
      />
      <Stack.Screen
        name="My Posts"
        component={UserPostsScreen}
      />
    </Stack.Navigator>
  ); 
}