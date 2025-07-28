<template>
  <div class="pageElementsIconButton">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <IconButton :icon="{ name: 'check' }" />
        <IconButton :icon="{ name: 'check' }" secondary />
        <IconButton :icon="{ name: 'check' }" tertiary />
        <IconButton :icon="{ name: 'check' }" quaternary />
        <IconButton :icon="{ name: 'check' }" info />
        <IconButton :icon="{ name: 'check' }" dark />
        <IconButton :icon="{ name: 'check' }" link />
        <IconButton :icon="{ name: 'check' }" minimal />
        <IconButton :icon="{ name: 'check' }" large />
        <IconButton :icon="{ name: 'check' }" medium />
        <IconButton :icon="{ name: 'check' }" small />
        <IconButton :icon="{ name: 'check' }" xsmall />
        <IconButton :icon="{ name: 'check' }" rounded loading large />
        <IconButton :icon="{ name: 'check' }" rounded loading medium />
        <IconButton :icon="{ name: 'check' }" rounded loading small />
        <IconButton :icon="{ name: 'check' }" rounded loading xsmall />
        <IconButton :icon="{ name: 'check' }" disabled />
      </Row>
      <Row justify="center" :gap="[8, 8]">
        <IconButton :icon="{ name: 'check' }" :color="{ background: '#0000ff', text: '#ff0000' }" rounded />
      </Row>
    </Container>
  </div>
</template>

<script setup>
</script>

<style lang="scss"></style>
