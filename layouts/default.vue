<template>
  <div v-show="!loadingAuthChanged">
    <Nuxt />
  </div>
</template>

<script>
export default {
  computed: {
    loadingAuthChanged() {
      return this.$store.state.loadingAuthChanged
    },
  },
}
</script>
