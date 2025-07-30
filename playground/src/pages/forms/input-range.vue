<template>
  <div class="pageFormsInputRange">
    <Column justify="center" gap="40">
      <Column justify="center" gap="8">
        <Typography caption1 bold center>
          Default
        </Typography>
        <Container>
          <InputRange v-model="value" min="0" max="100" controls />
        </Container>
        <Typography title3 center>
          {{ Math.floor(value) }}
        </Typography>
      </Column>
      <Column justify="center" gap="8">
        <Typography caption1 bold center>
          Custom
        </Typography>
        <Container>
          <InputRange v-model="value" min="0" max="100" controls
            :color="{ handle: 'var(--color-text)', bar: 'var(--color-text)', barBackground: 'var(--color-text-010)' }" />
        </Container>
        <Typography title3 center>
          {{ Math.floor(value) }}
        </Typography>
      </Column>
    </Column>
  </div>
</template>

<script setup>
const value = ref(10)
</script>

<style lang="scss"></style>
