import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyAKIALNHk42NdVGA9n8B5pgN2odWjXTrfI',
  authDomain: 'highest-number.firebaseapp.com',
  projectId: 'highest-number',
  storageBucket: 'highest-number.appspot.com',
  messagingSenderId: '307198240155',
  appId: '1:307198240155:web:307eac079b30fd15ce6d3e',
}

// eslint-disable-next-line no-unused-expressions
!firebase.apps.length ? firebase.initializeApp(config) : ''

export const auth = firebase.auth()
export const usersCollection = firebase.firestore().collection('users')
export const friendshipRequests = firebase
  .firestore()
  .collection('friendshipRequests')
export const friendsCollection = firebase.firestore().collection('friends')
export default firebase
