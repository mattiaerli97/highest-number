<template>
  <div :class="['spring-spinner', { 'spring-spinner-big': size === 'big' }]">
    <div
      :class="[
        'spring-spinner-part',
        { 'spring-spinner-part-big': size === 'big' },
      ]"
    >
      <div
        :class="[
          'spring-spinner-rotator',
          { 'spring-spinner-rotator-big': size === 'big' },
        ]"
      ></div>
    </div>
    <div
      :class="[
        'spring-spinner-part bottom',
        { 'spring-spinner-part-big bottom': size === 'big' },
      ]"
    >
      <div
        :class="[
          'spring-spinner-rotator',
          { 'spring-spinner-rotator-big': size === 'big' },
        ]"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small',
    },
  },
}
</script>

<style scoped>
.spring-spinner,
.spring-spinner * {
  box-sizing: border-box;
}

.spring-spinner {
  height: 20px;
  width: 20px;
}

.spring-spinner .spring-spinner-part {
  overflow: hidden;
  height: calc(20px / 2);
  width: 20px;
}

.spring-spinner .spring-spinner-part.bottom {
  transform: rotate(180deg) scale(-1, 1);
}

.spring-spinner .spring-spinner-rotator {
  width: 20px;
  height: 20px;
  border: calc(60px / 23.33) solid transparent;
  border-right-color: #35495e;
  border-top-color: #35495e;
  border-radius: 50%;
  box-sizing: border-box;
  animation: spring-spinner-animation 3s ease-in-out infinite;
  transform: rotate(-200deg);
}

@keyframes spring-spinner-animation {
  50% {
    transform: rotate(115deg);
  }
}

.spring-spinner-big,
.spring-spinner-big * {
  box-sizing: border-box;
}

.spring-spinner-big {
  height: 40px;
  width: 40px;
}

.spring-spinner-big .spring-spinner-part-big {
  overflow: hidden;
  height: calc(40px / 2);
  width: 40px;
}

.spring-spinner-big .spring-spinner-part-big.bottom {
  transform: rotate(180deg) scale(-1, 1);
}

.spring-spinner-big .spring-spinner-rotator-big {
  width: 40px;
  height: 40px;
  border: calc(80px / 23.33) solid transparent;
  border-right-color: #35495e;
  border-top-color: #35495e;
  border-radius: 50%;
  box-sizing: border-box;
  animation: spring-spinner-animation 3s ease-in-out infinite;
  transform: rotate(-200deg);
}

@keyframes spring-spinner-animation {
  50% {
    transform: rotate(115deg);
  }
}
</style>
