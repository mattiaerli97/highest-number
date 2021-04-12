<template>
  <div class="message-container container">
    <div class="message">
      Welcome! We sent you an email to verify your account. Now you can play and
      compete with other players
    </div>
    <button @click="returnHome">Home</button>
  </div>
</template>

<script>
export default {
  methods: {
    returnHome() {
      this.$router.push({ name: 'index' })
    },
  },
}
</script>

<style>
.message-container {
  flex-direction: column;
  font-size: 20px;
}

.message {
  margin-bottom: 24px;
}
</style>
