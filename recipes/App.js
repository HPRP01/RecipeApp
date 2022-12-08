import { Text, View, Button, TextInput, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
  const [email_text, setEmailText] = React.useState(null);
  const [pass_text, setPassText] = React.useState(null);

  let login = () => {
    firebase.auth()
    .signInWithEmailAndPassword(email_text, pass_text)
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid).set({
        name: email_text,
        uid: firebase.auth().currentUser.uid
      })
      console.log('User signed in!');
      setEmailText(null);
      setPassText(null);
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        console.log('That email address is invalid!');
        Alert.alert('Account not found. Please register for account.');
      }
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Password is incorrect.')
      }
      console.error(error);
    });
  }

  let register = () => {
    firebase.auth()
    .createUserWithEmailAndPassword(email_text, pass_text)
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid).set({
        name: email_text,
        uid: firebase.auth().currentUser.uid
      })
      console.log('User account created!');
      setEmailText(null);
      setPassText(null);
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email already in use. Please log in.')
      }
      console.error(error);
    })
  }

  let loginAdmin = () => {
    firebase.auth()
    .signInWithEmailAndPassword('hudsonpanning@gmail.com', 'password')
    .then((result) => {
      firebase.firestore().collection("users")
      .doc(firebase.auth().currentUser.uid).set({
        name: 'Admin',
        uid: firebase.auth().currentUser.uid
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
    <KeyboardAvoidingView 
      style={{flex:1, backgroundColor: '#32a866'}} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style = {styles.startScreen}>
          <Text style={styles.title}>Recipes</Text>
          <TextInput 
            style={styles.loginData}
            value={email_text}
            placeholder="email"
            onChangeText={setEmailText}
            autoCapitalize="none"
            placeholderTextColor='white'
          />
          <TextInput 
            style={styles.loginData}
            value={pass_text}
            placeholder="password"
            onChangeText={setPassText}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholderTextColor='white'
          />
          <View style={styles.buttonContainer}>
            <Button 
              color='white'
              title="Log In"
              onPress={login}
            />
            <Button 
              color='white'
              title="Register"
              onPress={register}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              color='white'
              title="Admin"
              onPress={loginAdmin}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
            headerStyle: { backgroundColor: '#32a866'},
            headerTintColor: '#fff'
          }}/>
        <Tab.Screen name="Upload" component={PostScreen} 
          options={{
            tabBarIcon:({color, size}) => (
              <MaterialCommunityIcons name="camera" color={color} size={size}/>
            ), 
            headerStyle: { backgroundColor: '#32a866'},
            headerTintColor: '#fff'
          }}/>
        <Tab.Screen name="Account" component={AccountScreen} 
          options={{
            tabBarIcon:({color, size}) => (
              <MaterialCommunityIcons name="chef-hat" color={color} size={size}/>
            ), 
            headerStyle: { backgroundColor: '#32a866'},
            headerTintColor: '#fff'
          }}/>
      </Tab.Navigator>

    </NavigationContainer>
  );
}

export default MyTabs;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    color: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  loginData: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 12,
    width: "90%",
    margin: 4,
    color: '#fff'
  },
  startScreen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#32a866' 
  }
});