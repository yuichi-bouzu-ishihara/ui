<template>
  <div class="pageNavigationIconMenu">
    <Container narrow>
      <Center>
        <IconMenu v-bind="{ to, icon, size, scale, color, notice }" />
      </Center>
    </Container>
  </div>
</template>

<script setup>
const to = ref('')
const icon = ref('add')
const size = ref('32')
const scale = ref('1')
const color = ref('dark')
const notice = ref(true)
</script>

<style lang="scss"></style>
