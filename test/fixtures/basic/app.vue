<template>
  <div>basic</div>
  <FieldFooter description="default footer" />
  <FieldFooter no-border description="no border footer" />
  <Switch v-model="switchNoLabel" name="switch-no-label" />
  <Switch v-model="switchWithLabel" name="switch-with-label" label="switch label" />
  <Checkbox v-model="checkboxNoLabel" name="checkbox-no-label" />
  <Checkbox v-model="checkboxWithLabel" name="checkbox-with-label" label="checkbox label" />
</template>

<script setup>
const switchNoLabel = ref(false)
const switchWithLabel = ref(false)
const checkboxNoLabel = ref(false)
const checkboxWithLabel = ref(false)
</script>
