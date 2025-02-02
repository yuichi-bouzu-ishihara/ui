<template>
  <div class="pageElementsTypography">
    <Typography large-title>
      <FormattedText v-bind="{ text, marks, strongs }" />
    </Typography>
  </div>
</template>

<script setup>
const text = 'Hello, World!'
const marks = ['Hello']
const strongs = ['He', 'W']
</script>

<style lang="scss"></style>
