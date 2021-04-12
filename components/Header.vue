<template>
  <div class="header-title-page">
    <p>{{ username }}</p>
    <slot v-if="!title"></slot>
    <p v-else class="title">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    username() {
      return this.$store.state.username
    },
  },
}
</script>

<style scoped>
.title {
  font-size: 24px;
}
</style>
