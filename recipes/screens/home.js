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

  // This effect is tied to `navigation` so that then the home screen 
  // comes into focus for the first time the data is loaded automatically
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if(imagesLoaded !== true)
      { 
        getFollowing();
      }
    });

    return unsubscribe;
  }, [navigation])

  // This function gets all the accounts that the current user is following
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

  // Effect is tied to `following` so that when the followers are updated, `getPosts()` is called automatically
  useEffect(() => {
    getPosts();
  }, [following])

  // This function gets all posts and stores the ones from the accounts the current user is following
  const getPosts = async () => {
    let imageArr = [];
    let data = {};
    setRefreshing(true);
    await firebase.firestore()
    .collectionGroup('userPosts')
    .orderBy('time', 'desc')
    .get()
    .then(snap => {
      snap.forEach(doc => {
        if(doc.data() != null && following != null && following.includes(doc.data().uid))
        {
          imageArr.push({"id":doc.id, "liked":false, "data":doc.data()})
          setImages(imageArr);
          setImagesLoaded(true);
        }
      });
    });
    setRefreshing(false)
  }

  const likePost = async (postId) => {
    firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("liked")
    .doc(postId)
    .set({})
    .then(() => {
      console.log('Post Liked')
    })
  }
  

  // If imagesLoaded is True display the list of posts
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
            let isLiked = false;
            return (
            <View style={styles.postContainer}>
              <Text style={styles.titleText}>{item.data.title}</Text>
              <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item.data.url}}/>
              <View style={styles.buttonContainer}>
                <Text>{item.data.userName}</Text>
                <TouchableOpacity onPress={()=>{likePost(item.id); isLiked = true;}}>
                  <View>
                    <MaterialCommunityIcons name="heart" color={isLiked ? "red":"grey"} size={30}/>
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.descriptionText}>{item.data.description}</Text>
            </View>
            );
          }}
          extraData={images}
        />
      </View>
    );
  }

  // If no posts are found display reload button 
  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No Posts Found</Text>
      <Button 
        title="Reload"
        onPress={getFollowing}
      />
    </View>
  );
}

// Create styles for components in screen
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'flex-end'
  }
})