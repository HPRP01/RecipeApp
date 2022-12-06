import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

export default function FollowingScreen({ navigation }) {
  const [users, setUsers] = React.useState(null);
  const [following, setFollowing] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUsers();
    });

    return unsubscribe;
  }, [navigation])

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
      getFollowing();
    })
  }

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
    })
    setFollowing(followingArr);
  }

  const addFollow = async (uid) => {
    firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("following")
    .doc(uid)
    .set({})
    .then(() => {
      getFollowing();
    })
  }

  const removeFollow = async (uid) => {
    firebase.firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("following")
    .doc(uid)
    .delete()
    .then(() => {
      getFollowing();
    })
  }

  if (users != null && following!= null)
  {
    return (
      <View>
        <FlatList 
          data={users}
          renderItem={({item}) => {
            return (
            <View style={styles.container}>
              <Text style={styles.text}>{item.name}</Text>
              <Button 
                title={following.includes(item.uid) ? 'Remove':'Add'}
                onPress={() => following.includes(item.uid) ? removeFollow(item.uid):addFollow(item.uid)}
              />
            </View>
            );
          }}
          extraData={users}
        />
      </View>
    )
  }

  return (
    <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading Users</Text>
    </View>
  ); 
}

const styles = StyleSheet.create({
  list: {
    flex:1
  },
  container: {
    marginTop: 4,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  text: {
    fontSize: 18,
  }
})