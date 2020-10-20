<template>
  <div id="decay" class="decay">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  setup () {

    return { }
  }
}
</script>

<style lang="postcss">
.decay {
  color: #f8feff;
  margin: 0 auto;
  max-width: 50rem;
  padding: calc(1rem + 3vw);
}
</style>