import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './login';
import RegisterScreen from './register';

const Stack = createNativeStackNavigator();

export default function StartScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/> 
      <Stack.Screen name="Account" component={RegisterScreen} />
    </Stack.Navigator>
  );
}