<template>
  <div id="replace" class="replace">
    <!-- <DecayHeader /> -->
    <main class="dmain" role="main">
      <Suspense>
        <template #default>
          <Items />
        </template>
        <template #fallback>
          Loading...
        </template>
        <template #error>
          Failed to load!
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script>
import Items from '/src/components/Items.vue'
export default {
  name: 'Home',
  components: {
    Items
  },
  setup () {
    

    return {}
  }
}
</script>

<style lang="postcss">

</style>