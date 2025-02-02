<template>
  <div class="pageFormsInputRange">
    <Column justify="center" gap="8">
      <Container>
        <InputRange v-model="value" min="0" max="100" controls />
      </Container>
      <Typography title3 center>
        {{ Math.floor(value) }}
      </Typography>
    </Column>
  </div>
</template>

<script setup>
const value = ref(10)
</script>

<style lang="scss"></style>
