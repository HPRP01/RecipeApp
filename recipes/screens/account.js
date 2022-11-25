import React from 'react';
import { View, Text, Button, Alert, FlatList, Image, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

export default function AccountScreen({ navigation }) {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [images, setImages] = React.useState(null);
  // let images = [];

  let signout = () =>
  {
    firebase.auth().signOut()
    .then(() => {
      console.log('Signed out')
    }).catch(error => {
      console.log('An error has occured')
    });
  }

  const getPosts = async () => {
    let imageArr = [];

    await firebase.firestore()
    .collection("posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .orderBy("time", "asc")
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

  let goBack = () => {
    setImagesLoaded(false);
  }

  if (imagesLoaded !== false)
  {
    if(images.length === 0)
    {
      return (<View style={{flex:1, justifyContent:'center',alignItems:'center'}}><Text>No Posts Yet</Text><Button title="Back" onPress={goBack}/></View>)
    }
    return (
      <View style={styles.container}>
        <FlatList 
          style={styles.list}
          data={images}
          renderItem={({item}) => 
            <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item}}/>
          }
        />
        <Button 
          title="Back"
          onPress={goBack}
        />
      </View>
    );
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
        onPress={getPosts}
      />
      <Button 
        title="Sign out"
        onPress={signout}
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