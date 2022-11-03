import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import HomeScreen from './screens/home';
import AccountScreen from './screens/account';
import StartScreen from './screens/start';
import PostScreen from './screens/post';

import firebase from 'firebase/compat/app'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "recipeapp-1162e.firebaseapp.com",
  projectId: "recipeapp-1162e",
  storageBucket: "recipeapp-1162e.appspot.com",
  messagingSenderId: "252051719906",
  appId: "1:252051719906:web:f911b0c98b2087239580bb",
  measurementId: "G-LP1NBCVF89"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

//const app = firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarIcon:({color, size}) => (
            <MaterialCommunityIcons name="food" color={color} size={26}/>
          ), 
        }}/>
        <Tab.Screen name="Post" component={PostScreen} 
        options={{
          tabBarIcon:({color, size}) => (
            <MaterialCommunityIcons name="camera" color={color} size={26}/>
          ), 
        }}/>
        <Tab.Screen name="Account" component={AccountScreen} 
        options={{
          tabBarIcon:({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={26}/>
          ), 
        }}/>
      </Tab.Navigator>

    </NavigationContainer>
  );
}

export default MyTabs;