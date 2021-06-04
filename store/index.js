import firebase from 'firebase'
import { auth, usersCollection } from '~/plugins/firebase.js'

export const strict = false

export const state = () => ({
  user: null,
  username: null,
  userId: null,
  loadingLogin: false,
  loadingAuthChanged: false,
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USERNAME(state, username) {
    state.username = username
  },
  SET_USERID(state, id) {
    state.userId = id
  },
  SET_LOADING_LOGIN(state, loading) {
    state.loadingLogin = loading
  },
  SET_LOADING_AUTH(state, loading) {
    state.loadingAuthChanged = loading
  },
}

export const actions = {
  async logout({ commit }) {
    await auth.signOut()
    commit('SET_USERNAME', null)
    commit('SET_USERID', null)
    commit('SET_USER', null)
  },

  async register({ commit }, { email, password }) {
    // eslint-disable-next-line no-useless-catch
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      const user = auth.currentUser
      await user.sendEmailVerification()
      commit('SET_USER', user)
      usersCollection
        .where('UID_auth', '==', user.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            commit('SET_USERNAME', doc.data().username)
            commit('SET_USERID', doc.id)
          })
        })
    } catch (error) {
      throw error
    }
  },

  login({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING_LOGIN', true)
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          auth
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
              usersCollection
                .where('UID_auth', '==', user.user.uid)
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    commit('SET_USERNAME', doc.data().username)
                    commit('SET_USERID', doc.id)
                    commit('SET_USER', user)
                    commit('SET_LOADING_LOGIN', false)
                  })
                  resolve()
                })
                .catch((e) => {
                  commit('SET_LOADING_LOGIN', false)
                  reject(e)
                })
            })
            .catch((e) => {
              commit('SET_LOADING_LOGIN', false)
              reject(e)
            })
        })
        .catch((e) => {
          commit('SET_LOADING_LOGIN', false)
          reject(e)
        })
    })
  },

  async checkUsername({ commit }, { username }) {
    await usersCollection
      .where('username', '==', username)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0) {
          // eslint-disable-next-line no-throw-literal
          throw { message: 'Usurname already exists.' }
        }
      })
  },
}
