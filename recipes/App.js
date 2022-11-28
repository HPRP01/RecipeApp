import { Text, View, Button } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import HomeScreen from './screens/home';
import AccountScreen from './screens/account';
import PostScreen from './screens/post';

import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import auth from 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDPQoYCILVBsLl0Blp3bdPMEcFzPGOT8VA',
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

const Tab = createBottomTabNavigator();

function MyTabs() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  let anonymous = () => {
    firebase.auth()
    .signInAnonymously()
    .then(() => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid).set({
        name: 'Anonymous'
      })
      console.log('User signed in anonymously');
    })
    .catch(error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
  
      console.error(error);
    });
  }

  let login = () => {
    firebase.auth()
    .signInWithEmailAndPassword('hudsonpanning@gmail.com', 'password')
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid).set({
        name: 'Admin'
      })
      console.log('Admin signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [])

  if (initializing) return null;

  if(!user) {
    return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome</Text>
      <Text>Please sign in</Text>
      <Button 
        title="Admin"
        onPress={login}
      />
      <Button 
        title="Anonymous"
        onPress={anonymous}
      />
    </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={HomeScreen} 
          options={{
            tabBarIcon:({color, size}) => (
              <MaterialCommunityIcons name="food" color={color} size={size}/>
            ), 
          }}/>
        <Tab.Screen name="Upload" component={PostScreen} 
          options={{
            tabBarIcon:({color, size}) => (
              <MaterialCommunityIcons name="camera" color={color} size={size}/>
            ), 
          }}/>
        <Tab.Screen name="Account" component={AccountScreen} 
          options={{
            tabBarIcon:({color, size}) => (
              <MaterialCommunityIcons name="chef-hat" color={color} size={size}/>
            ), 
          }}/>
      </Tab.Navigator>

    </NavigationContainer>
  );
}

export default MyTabs;