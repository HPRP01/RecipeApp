import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { useEffect } from 'react';

export default function HomeScreen({ navigation }) {

  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [images, setImages] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(null);
  const [following, setFollowing] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if(imagesLoaded !== true)
      { 
        getFollowing();
      }
    });

    return unsubscribe;
  }, [navigation])

  const getFollowing = async () => {
    let followingArr = [];

    await firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("following")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        followingArr.push(doc.id)
      });
      setFollowing(followingArr);
    })
    
  }

  useEffect(() => {
    getPosts();
  }, [following])

  const getPosts = async () => {
    let imageArr = [];
    setRefreshing(true);
    await firebase.firestore()
    .collectionGroup('userPosts')
    .orderBy('time', 'desc')
    .get()
    .then(snap => {
      snap.forEach(doc => {
        if(doc.data() != null && following != null && following.includes(doc.data().uid))
        {
          imageArr.push(doc.data())
          setImages(imageArr);
          console.log(doc.data())
          setImagesLoaded(true);
        }
      });
    });
    setRefreshing(false)
  }

  if (imagesLoaded !== false)
  {
    return (
      <View style={styles.container}>
        <FlatList 
          style={styles.list}
          data={images}
          initialNumToRender={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getPosts}
            />
          }
          renderItem={({item}) => {
            return (
            <View style={styles.postContainer}>
              <Text style={styles.titleText}>{item.title}</Text>
              <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item.url}}/>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={()=>{}}>
                  <View>
                    <MaterialCommunityIcons name="heart-outline" size={30}/>
                  </View>
                </TouchableOpacity>
              </View>
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
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button 
        title="Load Posts"
        onPress={getFollowing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    paddingLeft: 8
  }
})