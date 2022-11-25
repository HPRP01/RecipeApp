import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

export default function HomeScreen({ navigation }) {

  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [images, setImages] = React.useState(null);

  const getPosts = async () => {
    let imageArr = [];

    await firebase.firestore()
    .collectionGroup('userPosts')
    .get()
    .then(snap => {
      snap.forEach(doc => {
          imageArr.push(doc.data().url)
          console.log(doc.data());
      });
      setImages(imageArr);
      console.log(images);
      setImagesLoaded(true);
    });
  }


  if (imagesLoaded !== false)
  {
    return (
      <View style={styles.container}>
        <FlatList 
          style={styles.list}
          data={images}
          renderItem={({item}) => 
            <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item}}/>
          }
          extraData={images}
        />
        <Button 
          title="Refresh"
          onPress={getPosts}
        />
      </View>
    );
  }

  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button 
        title="Load Posts"
        onPress={getPosts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  list: {
    flex:1
  }
})