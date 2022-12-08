import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

export default function UserPostsScreen({ navigation }) {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [images, setImages] = React.useState(null);
  const [users, setUsers] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPosts();
    });

    return unsubscribe;
  }, [navigation])

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
      });
      setImages(imageArr);
      setImagesLoaded(true);
    });
  }

  const getUsers = async () => {
    let followersArr = [];

    await firebase.firestore()
    .collectionGroup("users")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        followersArr.push(doc.data())
      });
      setUsers(followersArr);
    })
  }

  let goBack = () => {
    setImagesLoaded(false);
  }

  if (imagesLoaded !== false)
  {
    if(images.length === 0)
    {
      return (<View style={{flex:1, justifyContent:'center',alignItems:'center'}}><Text>No Posts Yet</Text></View>)
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
      </View>
    );
  }

  return (
    <View>
      <Button 
        title="Load Posts"
        onPress={() => getPosts()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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