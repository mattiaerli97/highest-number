<template>
  <div>
    <Header :title="'Friends'"></Header>
    <div class="send-request-wrapper">
      <label for="username">Send request to:</label>
      <div class="send-request">
        <input
          id="username"
          v-model="usernameFriend"
          class="input-friends"
          type="text"
        />
        <button class="btn-send" @click="sendRequest">
          <p v-if="!loadingSendRequest">Send</p>
          <Loader v-else />
        </button>
      </div>
    </div>
    <div :class="['message-friend-request', { 'type-error': error }]">
      {{ messageFriendRequest }}
    </div>
    <div class="btn-long" @click="goToList('received')">
      Received
      <span
        v-if="!loadingReceived && receivedRequests.length > 0"
        class="notification-counter"
        >{{ receivedRequests.length }}</span
      >
      <Loader v-else-if="loadingReceived" />
    </div>
    <div class="btn-long" @click="goToList('sent')">
      Sent
      <span
        v-if="!loadingSent && sentRequests.length > 0"
        class="notification-counter"
        >{{ sentRequests.length }}</span
      >
      <Loader v-else-if="loadingSent" />
    </div>
    <div class="btn-long" @click="goToList('myfriends')">My Friends</div>
    <div class="buttons-friends">
      <button @click="returnHome">Home</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import Loader from '../../components/Loader.vue'
import Header from '../../components/Header.vue'
import { usersCollection } from '../../plugins/firebase.js'

export default {
  components: {
    Loader,
    Header,
  },
  middleware: 'authenticated',
  data() {
    return {
      usernameFriend: '',
      messageFriendRequest: '',
      error: false,
    }
  },
  computed: {
    username() {
      return this.$store.state.username
    },
    loadingSendRequest() {
      return this.$store.state.friends.loadingSendRequest
    },
    loadingReceived() {
      return this.$store.state.friends.loadingReceived
    },
    loadingSent() {
      return this.$store.state.friends.loadingSent
    },
    receivedRequests() {
      return this.$store.state.friends.receivedRequests
    },
    sentRequests() {
      return this.$store.state.friends.sentRequests
    },
  },
  created() {
    const app = this
    this.$store.commit('friends/SET_RECEIVED_REQUESTS', [])
    this.$store.commit('friends/SET_SENT_REQUESTS', [])
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        usersCollection
          .where('UID_auth', '==', user.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach(function (doc) {
              app.$store.dispatch(
                'friends/getReceivedRequests',
                doc.data().username
              )
              app.$store.dispatch(
                'friends/getSentRequests',
                doc.data().username
              )
            })
          })
      }
    })
  },
  destroyed() {
    this.$store.commit('friends/UNSUBSCRIBE_REALTIME_RECEIVED')
    this.$store.commit('friends/UNSUBSCRIBE_REALTIME_SENT')
  },
  methods: {
    returnHome() {
      this.$router.push({ name: 'index' })
    },
    goToList(type) {
      this.$router.push({ name: 'friendsHome-type', params: { type } })
    },
    async sendRequest() {
      const app = this
      try {
        await this.$store.dispatch('friends/sendRequest', {
          sender: this.username,
          receiver: this.usernameFriend,
        })
        this.messageFriendRequest =
          'Friend request sent to ' + this.usernameFriend + '!'
        this.usernameFriend = ''
        setTimeout(() => {
          app.messageFriendRequest = ''
        }, 3000)
        this.error = false
      } catch (error) {
        this.messageFriendRequest = error.message
        setTimeout(() => {
          app.messageFriendRequest = ''
        }, 3000)
        this.error = true
      }
    },
  },
}
</script>

<style>
.container-friends {
  align-items: unset;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 180px);
}

.send-request-wrapper {
  height: 100px;
  padding: 10px;
  font-size: 24px;
  display: flex;
  flex-direction: column;
}

.input-friends {
  margin-top: 16px;
  width: 100%;
  font-size: 24px;
  outline: none;
  height: 38px;
}

.btn-send {
  height: 38px;
  margin-top: 16px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-request {
  align-items: center;
  display: flex;
}

.message-friend-request {
  height: 30px;
  text-align: center;
  color: green;
}

.type-error {
  color: red;
}

.buttons-friends {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.btn-long {
  border: 1px solid #35495e;
  padding: 16px;
  margin: 0 8px 8px 8px;
  display: flex;
  justify-content: space-between;
}

.notification-counter {
  background-color: rgba(212, 19, 13, 1);
  color: #fff;
  border-radius: 3px;
  padding: 0 3px;
}
</style>
