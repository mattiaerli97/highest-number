<template>
  <div class="container">
    <label for="email">Enter recovery email:</label>
    <input
      id="email"
      v-model="recoveryMail"
      type="text"
      @keyup.enter="recovery"
    />
    <div class="btns-login">
      <button @click="returnHome">Home</button>
      <button :disabled="loadingRecovery" @click="recovery">
        <p v-if="!loadingRecovery">Reset</p>
        <Loader v-else />
      </button>
    </div>
    <p v-if="errorMessage">Error: {{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recoveryMail: '',
      errorMessage: '',
    }
  },
  computed: {
    loadingRecovery() {
      return this.$store.state.loadingRecovery
    },
  },
  methods: {
    returnHome() {
      this.$router.push({ name: 'index' })
    },
    recovery() {
      this.$store
        .dispatch('recovery', {
          email: this.recoveryMail,
        })
        .then(() => {
          this.returnHome()
        })
        .catch((e) => {
          this.errorMessage = e.message
        })
    },
  },
}
</script>

<style scoped>
@import '../assets/auth.css';
label {
  font-size: 32px;
}
</style>
