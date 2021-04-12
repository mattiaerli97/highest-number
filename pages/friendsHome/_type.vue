<template>
  <div>
    <Header
      :title="
        $route.params.type !== 'myfriends'
          ? $route.params.type.charAt(0).toUpperCase() +
            $route.params.type.slice(1)
          : 'My Friends'
      "
    ></Header>
    <div class="container container-table">
      <div :class="['table-wrapper', { 'loader-table': loadingTable }]">
        <table v-if="!loadingTable" class="base-table">
          <tr v-for="row in rows" :key="row.id">
            <td class="td-sender">{{ userDisplay(row) }}</td>
            <td
              v-if="$route.params.type === 'received'"
              @click="acceptRequest(row)"
            >
              <span class="mdi mdi-check"></span>
            </td>
            <td class="td-close" @click="deleteElement(row)">
              <span class="mdi mdi-close"></span>
            </td>
          </tr>
        </table>
        <Loader v-else :size="'big'" />
      </div>
      <button @click="back">Back</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import {
  usersCollection,
  friendshipRequests,
  friendsCollection,
} from '../../plugins/firebase.js'
import { trimElement } from '../../utils/index'
import Header from '../../components/Header.vue'

export default {
  components: { Header },
  middleware: 'authenticated',
  computed: {
    username() {
      return this.$store.state.username
    },
    loadingReceived() {
      return this.$store.state.friends.loadingReceived
    },
    receivedRequests() {
      return this.$store.state.friends.receivedRequests
    },
    loadingSent() {
      return this.$store.state.friends.loadingSent
    },
    sentRequests() {
      return this.$store.state.friends.sentRequests
    },
    loadingFriends() {
      return this.$store.state.friends.loadingFriends
    },
    friends() {
      return this.$store.state.friends.friends
    },
    rows() {
      switch (this.$route.params.type) {
        case 'received':
          return this.receivedRequests
        case 'sent':
          return this.sentRequests
        default:
          return this.friends.friends ? this.friends.friends : []
      }
    },
    loadingTable() {
      switch (this.$route.params.type) {
        case 'received':
          return this.loadingReceived
        case 'sent':
          return this.loadingSent
        default:
          return this.loadingFriends
      }
    },
  },
  created() {
    const app = this
    this.$store.commit('friends/SET_RECEIVED_REQUESTS', [])
    this.$store.commit('friends/SET_SENT_REQUESTS', [])
    this.$store.commit('friends/SET_FRIENDS', [])
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        usersCollection
          .where('UID_auth', '==', user.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach(function (doc) {
              app.loadData(doc.data().username)
            })
          })
      }
    })
  },
  destroyed() {
    this.$store.commit('friends/UNSUBSCRIBE_REALTIME_RECEIVED')
    this.$store.commit('friends/UNSUBSCRIBE_REALTIME_SENT')
    this.$store.commit('friends/UNSUBSCRIBE_REALTIME_FRIENDS')
  },
  methods: {
    userDisplay(row) {
      let name = ''
      switch (this.$route.params.type) {
        case 'received':
          name = row.sender
          break
        case 'sent':
          name = row.receiver
          break
        default:
          name = row
          break
      }
      return trimElement(name, 22)
    },
    back() {
      this.$router.push({ name: 'friendsHome' })
    },
    loadData(username) {
      switch (this.$route.params.type) {
        case 'received':
          this.$store.dispatch('friends/getReceivedRequests', username)
          break
        case 'sent':
          this.$store.dispatch('friends/getSentRequests', username)
          break
        case 'myfriends':
          this.$store.dispatch('friends/getFriends', username)
          break
      }
    },
    deleteElement(row) {
      const app = this
      if (
        this.$route.params.type === 'received' ||
        this.$route.params.type === 'sent'
      ) {
        friendshipRequests
          .doc(row.id)
          .delete()
          .then(() => {
            app.loadData(app.username)
          })
      } else {
        const arr = this.friends.friends.filter((v) => v !== row)
        friendsCollection
          .doc(this.friends.id)
          .update({
            username: this.friends.username,
            friends: arr,
          })
          .then(() => {
            app.loadData(app.username)
          })

        friendsCollection
          .where('username', '==', row)
          .get()
          .then((snapshot) => {
            const id = snapshot.docs[0].id
            const doc = snapshot.docs[0].data()
            friendsCollection.doc(id).update({
              username: row,
              friends: doc.friends.filter((v) => v !== this.username),
            })
          })
      }
    },
    acceptRequest(row) {
      const app = this
      friendshipRequests
        .doc(row.id)
        .delete()
        .then(() => {
          friendsCollection
            .where('username', '==', this.username)
            .get()
            .then((snapshot) => {
              snapshot.forEach(function (doc) {
                const obj = doc.data()
                obj.friends.push(row.sender)

                friendsCollection
                  .doc(doc.id)
                  .update(obj)
                  .then(() => {
                    app.loadData(app.username)
                  })
              })
            })

          friendsCollection
            .where('username', '==', row.sender)
            .get()
            .then((snapshot) => {
              snapshot.forEach(function (doc) {
                const obj = doc.data()
                obj.friends.push(row.receiver)

                friendsCollection
                  .doc(doc.id)
                  .update(obj)
                  .then(() => {
                    app.loadData(app.username)
                  })
              })
            })
        })
    },
  },
}
</script>

<style scoped>
.td-sender {
  text-align: left;
}
.td-close {
  text-align: right;
}
</style>
