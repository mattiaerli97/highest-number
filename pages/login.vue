<template>
  <div class="container">
    test build
    <label v-if="JSON.parse($route.query.withRegister)" for="username"
      >Username:</label
    >
    <input
      v-if="JSON.parse($route.query.withRegister)"
      id="username"
      v-model="username"
      type="text"
    />
    <label for="email">Email:</label>
    <input id="email" v-model="email" type="text" />
    <label for="password">Password:</label>
    <input id="password" v-model="password" type="password" />
    <div class="btns-login">
      <button
        v-if="JSON.parse($route.query.withRegister)"
        :disabled="loadingRegister"
        @click="register"
      >
        <p v-if="!loadingRegister">Register</p>
        <Loader v-else />
      </button>
      <button v-else :disabled="loadingLogin" @click="login">
        <p v-if="!loadingLogin">Login</p>
        <Loader v-else />
      </button>
      <button @click="returnHome">Home</button>
    </div>
    <p v-if="errorMessage">Error: {{ errorMessage }}</p>
  </div>
</template>

<script>
import { usersCollection, friendsCollection } from '../plugins/firebase.js'
import Loader from '../components/Loader.vue'

export default {
  components: {
    Loader,
  },
  data() {
    return {
      email: '',
      password: '',
      username: '',
      errorMessage: '',
      loadingRegister: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loadingLogin() {
      return this.$store.state.loadingLogin
    },
  },
  methods: {
    async register() {
      try {
        this.loadingRegister = true
        await this.$store.dispatch('checkUsername', {
          username: this.username,
        })

        await this.$store.dispatch('register', {
          email: this.email,
          password: this.password,
        })

        usersCollection
          .add({
            UID_auth: this.user.uid,
            username: this.username,
            highScore: null,
          })
          .then(() => {
            friendsCollection
              .add({
                username: this.username,
                friends: [],
              })
              .then(() => {
                this.loadingRegister = false
                this.$router.push({ name: 'confirmRegister' })
              })
          })
      } catch (error) {
        this.loadingRegister = false
        this.errorMessage = error.message
      }
    },
    login() {
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.returnHome()
        })
        .catch((e) => {
          this.errorMessage = e.message
        })
    },
    returnHome() {
      this.$router.push({ name: 'index' })
    },
  },
}
</script>

<style scoped>
.container {
  flex-direction: column;
}
.container > p {
  margin-top: 32px;
  font-size: 16px;
  color: red;
}
label {
  font-size: 40px;
}
input {
  width: 80%;
  font-size: 24px;
  margin: 10px;
  outline: none;
}
.btns-login {
  margin-top: 20px;
  justify-content: space-between;
  width: 80%;
  display: flex;
}
</style>
