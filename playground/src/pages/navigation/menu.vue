<template>
  <div class="pageNavigationMenu">
    <Container narrow>
      <Center>
        <Menu v-bind="{ to, icon, face, iconSize, name, disabled }" />
      </Center>
    </Container>
  </div>
</template>

<script setup>
const to = ref('')
const icon = ref('add')
const face = ref('')
const iconSize = ref('')
const name = ref('Menu Text')
const disabled = ref(false)
</script>

<style lang="scss"></style>
