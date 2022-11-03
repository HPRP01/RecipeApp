import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PostScreen() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if(pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage({ localUri: pickerResult.uri });
  }

  if(selectedImage !== null)
  {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <Button 
          title="Choose"
          onPress={openImagePickerAsync}
        />
      </View>
    );
  }
  
  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Post Screen</Text>
      <Button 
        title="Choose"
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
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});