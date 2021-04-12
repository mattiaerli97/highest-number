<template>
  <div>
    <div v-if="countDownStart > 0" class="container tipography">
      {{ countDownStart }}
    </div>
    <div
      v-else-if="countDownStart === 0 && showLoadingPanel"
      class="container tipography"
    >
      GO!
    </div>
    <template v-else>
      <div class="header-title-page">
        <div class="current-score tipography">SCORE: {{ score }}</div>
        <div class="time tipography">
          TIME:
          {{ parseMillisecondsIntoReadableTime(timeRemainingMilliseconds) }}
        </div>
      </div>
      <div v-if="maxPaddingLeft > 0" id="area_1" class="numbers-area">
        <div
          v-for="(number, index) in numbersArray"
          :key="index"
          class="number tipography"
          :style="{
            'padding-left': arrayPaddingLeft[index] + 'px',
            'padding-top': paddingTopNumbers + 'px',
          }"
        >
          <button
            class="number-text"
            :style="{
              'font-size': arrayFontSize[index] + 'px',
            }"
            @click="verifyCorrectNumber(number)"
          >
            {{ number }}
          </button>
        </div>
      </div>
      <div v-else id="area_1" class="numbers-area"></div>
    </template>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      totNumbers: 5,
      arrayPaddingLeft: [],
      arrayFontSize: [],
      paddingTopNumbers: 0,
      intervalCountDown: null,
      intervalTimeRemaining: null,
      countDownStart: 3,
      showLoadingPanel: true,
      numbersArray: [],
      maxNumber: null,
      maxPaddingLeft: 0,
      maxPaddingTop: 0,
      timeRemainingMilliseconds: 60000,
      score: 0,
    }
  },
  watch: {
    countDownStart(newVal) {
      if (!newVal) {
        this.intervalTimeRemaining = setInterval(() => {
          this.timeRemainingMilliseconds = this.timeRemainingMilliseconds - 1000
        }, 1000)
      }
    },
    timeRemainingMilliseconds(newVal) {
      if (!newVal) {
        clearInterval(this.intervalTimeRemaining)
        this.$router.push({
          name: 'endGame',
          query: { score: this.score, success: true },
        })
      }
    },
  },
  mounted() {
    this.intervalCountDown = setInterval(() => {
      if (this.countDownStart > 0) this.countDownStart--
      else if (this.showLoadingPanel) {
        this.generateNumbersAndFindMax()
        this.showLoadingPanel = false
      }
    }, 1000)
  },
  destroyed() {
    clearInterval(this.intervalCountDown)
  },
  methods: {
    generateNumbersAndFindMax() {
      // randomly generated N = 40 length array 0 <= A[N] <= 39
      // this.numbersArray = Array.from({length: 40}, () => Math.floor(Math.random() * 40));

      const app = this

      this.numbersArray = Array.from({ length: this.totNumbers }, () =>
        Math.floor(Math.random() * 70)
      )
      this.maxNumber = Math.max(...this.numbersArray)
      app.maxPaddingLeft = 0

      setTimeout(() => {
        app.maxPaddingLeft = document.getElementById('area_1').offsetWidth
        app.maxPaddingTop = document.getElementById('area_1').offsetHeight

        app.arrayPaddingLeft = Array.from(
          { length: app.totNumbers },
          () => Math.floor(Math.random() * (app.maxPaddingLeft - 80)) + 10
        )
        app.paddingTopNumbers = app.maxPaddingTop / app.totNumbers - 70
        app.arrayFontSize = Array.from(
          { length: app.totNumbers },
          () => Math.floor(Math.random() * 30) + 12
        )
      }, 0)
    },
    parseMillisecondsIntoReadableTime(duration) {
      // const milliseconds = parseInt((duration % 1000) / 100)
      let seconds = Math.floor((duration / 1000) % 60)
      let minutes = Math.floor((duration / (1000 * 60)) % 60)
      // let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

      // hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
      return minutes + ':' + seconds
    },
    verifyCorrectNumber(numberSelected) {
      if (numberSelected === this.maxNumber) {
        this.score = this.score + 1
        this.generateNumbersAndFindMax()
      } else {
        this.$router.push({
          name: 'endGame',
          query: { score: this.score, success: false },
        })
      }
    },
  },
}
</script>

<style>
.current-score {
  padding-left: 10px;
  font-size: 20px;
}

.time {
  padding-right: 10px;
  font-size: 20px;
}

.numbers-area {
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}

.number-text {
  padding: 4px 16px;
  border: none;
}

.number-text:hover {
  background-color: white;
  color: #35495e;
}
</style>
