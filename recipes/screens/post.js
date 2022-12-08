import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import auth from 'firebase/compat/auth';
import "firebase/compat/storage";
import ImageManipulator from 'expo-image-manipulator'


export default function PostScreen() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [title, onChangeTitle] = React.useState(null);
  const [recipe, onRecipeChange] = React.useState(null);

  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled === true) {
      return;
    }
    onChangeTitle(false);
    onRecipeChange(false);
    setSelectedImage({ localUri: pickerResult.uri });
  }

  const uploadImg = async () => {
    const uri = selectedImage.localUri;
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref()
    .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
    .put(blob)

    const taskProgress = () => {
      console.log('Transferred');
    }
    const taskCompleted = () => {
    task.snapshot.ref.getDownloadURL().then((snapshot) => {
      console.log(snapshot)
      saveImage(snapshot);
    })
    }
    const taskError = snapshot => {
      console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);

  }

  const saveImage = (url) => {
    firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid).collection('userPosts')
    .add({
      url,
      title: title,
      description: recipe,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      uid: firebase.auth().currentUser.uid,
      userName: firebase.auth().currentUser.email
    })
    console.log(firebase.auth().currentUser.email)
    Alert.alert('Image uploaded successfully')
    setSelectedImage(null)
    onChangeTitle(null)
    onRecipeChange(null)
  }

  if(selectedImage !== null)
  {
    return (
      <KeyboardAvoidingView 
        style={{flex:1}} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={64}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={{ uri: selectedImage.localUri }}
              style={styles.thumbnail}
            />
            <TextInput 
              style={styles.title}
              value={title}
              placeholder="Title"
              onChangeText={onChangeTitle}
            />
            <TextInput 
              style={styles.title}
              value={recipe}
              placeholder="Recipe"
              onChangeText={onRecipeChange}
              multiline={true}
            />
            <View style={styles.buttons}>
              <Button 
                title="Reselect"
                onPress={openImagePickerAsync}
              />
              <Button 
                title="Upload"
                onPress={uploadImg}
              />
            </View>
          </View>

        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
    );
  }
  
  return (

    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Select Image to Upload</Text>
      <Button 
        title="Select"
        onPress={openImagePickerAsync}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    flex: 1,
    width: "100%",
    resizeMode: "contain"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  title: {
    fontSize: 18,
    borderBottomWidth: 1,
    padding: 12,
    width: "90%",
    margin: 4
  }
});