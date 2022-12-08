import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function LikedPostsScreen({ navigation }) {
  const [liked, setLiked] = React.useState(null);
  const [images, setImages] = React.useState(null);
  const [imagesLoaded, setImagesLoaded] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLiked();
    });

    return unsubscribe;
  }, [navigation])

  const removeLike = async (postId) => {
    firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("liked")
    .doc(postId)
    .delete()
    .then(() => {
      console.log('Post Unliked')
    })
  }

  const getLiked = async () => {
    let likedArr = [];

    await firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("liked")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        likedArr.push(doc.id)
      });
    })
    setLiked(likedArr);
  }

  useEffect(() => {
    if(liked != null)
    {
      getPosts();
    }
  }, [liked])

  const getPosts = async () => {
    let imageArr = [];

    await firebase.firestore()
    .collectionGroup('userPosts')
    .orderBy('time', 'desc')
    .get()
    .then(snap => {
      snap.forEach(doc => {
        if(liked.includes(doc.id))
        {
          imageArr.push({"id":doc.id, "data":doc.data()})
        }  
      });
      setImages(imageArr);
      setImagesLoaded(true);
    });
  }

  if (imagesLoaded !== false)
  {
    if(images==null || images.length === 0)
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
              <Text style={styles.titleText}>{item.data.title}</Text>
              <Image style={{height: 500, width: "100%"}} resizeMode="cover" source={{uri:item.data.url}}/>
              <View style={styles.buttonContainer}>
                <Text>{item.data.userName}</Text>
                <TouchableOpacity onPress={()=>{removeLike(item.id);}}>
                  <View>
                    <MaterialCommunityIcons name="heart-minus" color={false ? "red":"red"} size={30}/>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'flex-end'
  }
})