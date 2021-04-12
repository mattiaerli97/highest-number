<template>
  <div>
    <div class="container overwrite">
      {{ !$route.query.success ? 'Wrong Number :-(' : 'Nice Job :-)' }}
      <p class="score">{{ 'SCORE: ' + $route.query.score }}</p>
      <div class="buttons">
        <button @click="playAgain">Play Again</button>
        <button class="return" @click="returnHome">Home</button>
      </div>
    </div>
  </div>
</template>

<script>
import { usersCollection } from '../plugins/firebase.js'

export default {
  middleware: 'authenticated',
  computed: {
    userId() {
      return this.$store.state.userId
    },
  },
  created() {
    this.updateHighScore()
  },
  methods: {
    playAgain() {
      this.$router.push({ name: 'startGame' })
    },
    returnHome() {
      this.$router.push({ name: 'index' })
    },
    updateHighScore() {
      usersCollection
        .doc(this.userId)
        .get()
        .then((doc) => {
          if (
            doc.data().highScore === null ||
            doc.data().highScore < this.$route.query.score
          ) {
            usersCollection.doc(this.userId).update({
              highScore: this.$route.query.score,
            })
          }
        })
    },
  },
}
</script>

<style>
.overwrite {
  font-size: 40px;
  flex-direction: column;
}

.score {
  padding-top: 20px;
  font-size: 20px;
}

.buttons {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
}

.return {
  margin-left: 10px;
}
</style>
