<template>
  <div class="pageElementsNotice">
    <Center>
      <Notice v-bind="{ count }" />
    </Center>
  </div>
</template>

<script setup>
const count = ref(10)
</script>

<style lang="scss"></style>
