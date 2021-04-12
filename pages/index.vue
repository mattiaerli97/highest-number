<template>
  <div>
    <Header v-if="username"
      ><span class="mdi mdi-power" @click="logout"></span
    ></Header>
    <div :class="['container', { 'with-header': username }]">
      <div>
        <h1>Highest Number</h1>
        <div v-if="user" class="links">
          <button @click="startNewGame">New Game</button>
        </div>
        <div v-if="user && loadingHighscore" class="highscore with-loader">
          {{ 'Highscore: ' }} <Loader class="loader-score" />
        </div>
        <div v-else-if="user" class="highscore">
          {{
            highscore !== null
              ? 'Highscore: ' + highscore
              : 'Highscore: no score'
          }}
        </div>
        <button v-if="!user" @click="login(true)">Register</button>
        <button v-if="!user" @click="login(false)">Login</button>
      </div>
    </div>
    <div v-if="user" class="actions">
      <div @click="goToStandings">
        <span class="mdi mdi-podium"></span>
        <p>Standings</p>
      </div>
      <div @click="goToFriends">
        <span class="mdi mdi-account-multiple-plus"></span>
        <p>Friends</p>
      </div>
    </div>
  </div>
</template>

<script>
import { usersCollection } from '../plugins/firebase.js'
import Loader from '../components/Loader.vue'
import Header from '../components/Header.vue'

export default {
  components: { Loader, Header },
  middleware: 'authenticated',
  data() {
    return {
      highscore: null,
      loadingHighscore: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    username() {
      return this.$store.state.username
    },
    userId() {
      return this.$store.state.userId
    },
  },
  watch: {
    userId(newVal) {
      if (newVal) {
        this.getHighScore()
      }
    },
  },
  created() {
    if (this.userId) {
      this.getHighScore()
    }
  },
  methods: {
    startNewGame() {
      this.$router.push({ name: 'startGame' })
    },
    login(withRegister) {
      this.$router.push({
        name: 'login',
        query: { withRegister },
      })
    },
    logout() {
      this.$store.dispatch('logout')
    },
    getHighScore() {
      this.loadingHighscore = true
      usersCollection
        .doc(this.userId)
        .get()
        .then((doc) => {
          this.highscore = doc.data().highScore
          this.loadingHighscore = false
        })
    },
    goToStandings() {
      this.$router.push({ name: 'standings' })
    },
    goToFriends() {
      this.$router.push({ name: 'friendsHome' })
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 40px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  min-height: 57px;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
}

.highscore {
  font-size: 24px;
}

.with-header {
  min-height: calc(100vh - 150px);
}

.mdi-power {
  font-size: 24px;
  cursor: pointer;
  color: #35495e;
}

.with-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
}

.loader-score {
  padding-left: 10px;
}

.actions {
  display: flex;
  justify-content: center;
  font-size: 24px;
}

.actions > div {
  color: #35495e;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actions > div:last-child {
  padding-left: 40px;
}
</style>
