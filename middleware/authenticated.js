import firebase from 'firebase'
import { usersCollection } from '../plugins/firebase'

// eslint-disable-next-line func-names
export default function ({ store, redirect, route }) {
  if (!store.state.user) {
    store.commit('SET_LOADING_AUTH', true)
    firebase.auth().onAuthStateChanged((user) => {
      if (!user && route.name !== 'index') {
        store.commit('SET_LOADING_AUTH', false)
        redirect('/')
      } else if (user) {
        usersCollection
          .where('UID_auth', '==', user.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              store.commit('SET_USERNAME', doc.data().username)
              store.commit('SET_USERID', doc.id)
              store.commit('SET_USER', user)
              store.commit('SET_LOADING_LOGIN', false)
            })
            store.commit('SET_LOADING_AUTH', false)
          })
      } else if (route.name === 'index') {
        store.commit('SET_LOADING_AUTH', false)
      }
    })
  }
}
