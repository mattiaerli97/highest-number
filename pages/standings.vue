<template>
  <div>
    <Header :title="'Standings'"></Header>
    <div class="personal-rank-wrapper">
      <p>Your rank:</p>
      <p v-if="personalRecord && !loadingStandings">
        {{ personalRecord.position }} ({{
          personalRecord.highScore + ' points'
        }})
      </p>
      <p v-else-if="!personalRecord && !loadingStandings">No Score</p>
    </div>
    <div class="container container-table">
      <div :class="['table-wrapper', { 'loader-table': loadingStandings }]">
        <table v-if="!loadingStandings" class="base-table">
          <tr v-for="(row, i) in rows" :key="row.id">
            <td class="td-position">
              {{ row.position ? row.position : i + 1 }}
            </td>
            <td class="td-username">{{ row.username }}</td>
            <td class="td-score">{{ row.highScore }}</td>
          </tr>
        </table>
        <Loader v-else :size="'big'" />
      </div>
      <div class="filter-friends">
        <toggle-button @change="filterByFriends" />
        <p>Only Friends</p>
      </div>
      <button @click="returnHome">Home</button>
    </div>
  </div>
</template>

<script>
import { usersCollection, friendsCollection } from '../plugins/firebase.js'
import { trimElement } from '../utils/index'
import Loader from '../components/Loader.vue'
import Header from '../components/Header.vue'

export default {
  components: { Loader, Header },
  middleware: 'authenticated',
  data() {
    return {
      rows: [],
      loadingStandings: true,
      personalRecord: null,
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId
    },
    username() {
      return this.$store.state.username
    },
  },
  watch: {
    userId(newVal) {
      if (newVal) {
        this.getData()
      }
    },
  },
  created() {
    if (this.userId) {
      this.getData()
    }
  },
  methods: {
    returnHome() {
      this.$router.push({ name: 'index' })
    },
    getData() {
      const app = this
      this.rows = []
      this.loadingStandings = true
      let count = 0
      usersCollection
        .where('highScore', '!=', null)
        .orderBy('highScore', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach(function (doc) {
            count++
            const obj = doc.data()
            obj.position = count
            obj.username = trimElement(obj.username, 20)
            app.rows.push(obj)
            if (doc.id === app.userId) {
              app.personalRecord = obj
            }
          })
          app.loadingStandings = false
        })
    },
    filterByFriends(selected) {
      if (selected.value) {
        this.rows = []
        const app = this
        this.loadingStandings = true
        friendsCollection
          .where('username', '==', this.username)
          .get()
          .then((snapshot) => {
            const myFriends = snapshot.docs[0].data().friends
            let count = 0
            if (myFriends.length > 0) {
              myFriends.map((f) => {
                count++
                usersCollection
                  .where('username', '==', f)
                  .where('highScore', '!=', null)
                  .get()
                  .then((snap) => {
                    if (snap.size > 0) {
                      const obj = snap.docs[0].data()
                      obj.username = trimElement(obj.username, 20)
                      app.rows.push(obj)
                    }
                    count--
                    if (count === 0) {
                      usersCollection
                        .where('username', '==', app.username)
                        .where('highScore', '!=', null)
                        .get()
                        .then((s) => {
                          if (s.size > 0) {
                            const obj = s.docs[0].data()
                            obj.username = trimElement(obj.username, 20)
                            app.rows.push(obj)
                          }
                          app.rows.sort((a, b) =>
                            a.highScore > b.highScore
                              ? -1
                              : b.highScore > a.highScore
                              ? 1
                              : 0
                          )
                          app.personalRecord = {
                            position:
                              app.rows.findIndex(
                                (item) =>
                                  item.username ===
                                  trimElement(app.username, 20)
                              ) + 1,
                            highScore: s.docs[0].data().highScore,
                          }
                          app.loadingStandings = false
                        })
                    }
                  })
              })
            } else {
              app.loadingStandings = false
            }
          })
      } else {
        this.getData()
      }
    },
  },
}
</script>

<style scoped>
.td-username {
  text-align: left;
}

.td-score {
  text-align: center;
}

.personal-rank-wrapper {
  min-height: 50px;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 24px;
  justify-content: center;
}

.personal-rank-wrapper > p:last-of-type {
  padding-left: 8px;
}

button {
  margin-top: 64px;
}

.filter-friends {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.filter-friends > p {
  margin-left: 8px;
}
</style>
