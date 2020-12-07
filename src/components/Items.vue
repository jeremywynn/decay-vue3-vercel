<template>
  <div class="ditems">
    <Item v-for="item of items" :key="item._id" :item="item" />
  </div>
</template>

<script>
import { ref } from "vue"
import Item from '/src/components/Item.vue'

export default {
  name: 'Items',
  components: {
    Item
  },
  async setup () {
    const error = ref(null)
    // const groups = ref(null)
    const items = ref(null)

    const groupsResponse = await fetch('/api/get-categories')
    const itemsResponse = await fetch('/api/get-items')
    // groups.value = await groupsResponse.json()
    items.value = await itemsResponse.json()

    return { items, error }
  }
}
</script>

<style lang="postcss">

</style>