<template>
  <div class="pageNavigationIconMenu">
    <Container narrow>
      <Center>
        <IconUI v-bind="{ to, icon }" />
      </Center>
    </Container>
  </div>
</template>

<script setup>
const to = ref('')
const icon = ref({ name: 'check', size: 32 })
</script>

<style lang="scss"></style>
