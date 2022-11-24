import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import auth from 'firebase/compat/auth';
import "firebase/compat/storage"


export default function PostScreen() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [cameraPermission, setCameraPermission] = React.useState(false);

  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled === true) {
      return;
    }
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
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
    Alert.alert('Image uploaded successfully')
    setSelectedImage(null)

  }

  if(selectedImage !== null)
  {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
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
    );
  }
  
  return (

    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Select Image</Text>
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
  }
});