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
    .orderBy("time", "desc")
    .get()
    .then(snap => {
      snap.forEach(doc => {
          imageArr.push(doc.data())
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
          initialNumToRender={4}
          renderItem={({item}) => {
            return (
            <View style={styles.postContainer}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item.url}}/>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
            );
          }}
          extraData={images}
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
  },
  postContainer: {
    marginTop: 4,
    backgroundColor: 'white'
  },
  titleText: {
    fontSize: 18,
    paddingLeft: 12,
    paddingBottom: 4,
    fontWeight: 'bold'
  },
  descriptionText: {
    fontSize: 18,
    paddingLeft: 12,
    paddingBottom: 4
  },
})