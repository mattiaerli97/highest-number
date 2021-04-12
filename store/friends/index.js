import {
  friendshipRequests,
  usersCollection,
  friendsCollection,
} from '~/plugins/firebase.js'

export const state = () => ({
  loadingSendRequest: false,
  receivedRequests: [],
  sentRequests: [],
  friends: {},
  loadingReceived: true,
  loadingSent: true,
  loadingFriends: true,
  realTimeReceived: null,
  realTimeSent: null,
  realTimeFriends: null,
})

export const mutations = {
  SET_LOADING_REQUEST(state, loading) {
    state.loadingSendRequest = loading
  },
  SET_LOADING_RECEIVED(state, loading) {
    state.loadingReceived = loading
  },
  SET_LOADING_SENT(state, loading) {
    state.loadingSent = loading
  },
  SET_LOADING_FRIENDS(state, loading) {
    state.loadingFriends = loading
  },
  SET_RECEIVED_REQUESTS(state, request) {
    state.receivedRequests = request
  },
  SET_SENT_REQUESTS(state, request) {
    state.sentRequests = request
  },
  SET_FRIENDS(state, friends) {
    state.friends = friends
  },
  SET_REALTIME_RECEIVED(state, r) {
    state.realTimeReceived = r
  },
  SET_REALTIME_SENT(state, r) {
    state.realTimeSent = r
  },
  SET_REALTIME_FRIENDS(state, r) {
    state.realTimeFriends = r
  },
  UNSUBSCRIBE_REALTIME_RECEIVED(state) {
    if (state.realTimeReceived) {
      state.realTimeReceived()
    }
  },
  UNSUBSCRIBE_REALTIME_SENT(state) {
    if (state.realTimeSent) {
      state.realTimeSent()
    }
  },
  UNSUBSCRIBE_REALTIME_FRIENDS(state) {
    if (state.realTimeFriends) {
      state.realTimeFriends()
    }
  },
}

export const actions = {
  async sendRequest({ commit }, { sender, receiver }) {
    commit('SET_LOADING_REQUEST', true)

    // CHECK IF THE RECEIVER USERNAME EXISTS
    await usersCollection
      .where('username', '==', receiver)
      .get()
      .then((snapshot) => {
        if (snapshot.size === 0) {
          commit('SET_LOADING_REQUEST', false)
          throw new Error("Usurname doesn't exist.")
        }
      })

    // CHECK IF THE RECEIVER EQUALS THE SENDER
    if (sender === receiver) {
      commit('SET_LOADING_REQUEST', false)
      throw new Error("You can't send a request to yourself.")
    }

    // CHECK IF YOU ALREADY SENT A REQUEST TO THE RECEIVER
    await friendshipRequests
      .where('receiver', '==', receiver)
      .where('sender', '==', sender)
      .get()
      .then((snapshot) => {
        if (snapshot.size > 0) {
          commit('SET_LOADING_REQUEST', false)
          throw new Error('You already sent a request to this user.')
        }
      })

    await friendshipRequests.add({
      sender,
      receiver,
    })
    commit('SET_LOADING_REQUEST', false)
  },
  getReceivedRequests({ commit }, username) {
    commit('SET_LOADING_RECEIVED', true)
    const r = friendshipRequests
      .where('receiver', '==', username)
      .onSnapshot((snapshot) => {
        const arr = []
        snapshot.forEach(function (doc) {
          arr.push(Object.assign({}, doc.data(), { id: doc.id }))
        })
        commit('SET_RECEIVED_REQUESTS', arr)
        commit('SET_LOADING_RECEIVED', false)
      })
    commit('SET_REALTIME_RECEIVED', r)
  },
  getSentRequests({ commit }, username) {
    commit('SET_LOADING_SENT', true)
    const r = friendshipRequests
      .where('sender', '==', username)
      .onSnapshot((snapshot) => {
        const arr = []
        snapshot.forEach(function (doc) {
          arr.push(Object.assign({}, doc.data(), { id: doc.id }))
        })
        commit('SET_SENT_REQUESTS', arr)
        commit('SET_LOADING_SENT', false)
      })
    commit('SET_REALTIME_SENT', r)
  },
  getFriends({ commit }, username) {
    commit('SET_LOADING_FRIENDS', true)
    const r = friendsCollection
      .where('username', '==', username)
      .onSnapshot((snapshot) => {
        commit(
          'SET_FRIENDS',
          Object.assign({}, snapshot.docs[0].data(), {
            id: snapshot.docs[0].id,
          })
        )
        commit('SET_LOADING_FRIENDS', false)
      })
    commit('SET_REALTIME_FRIENDS', r)
  },
}
