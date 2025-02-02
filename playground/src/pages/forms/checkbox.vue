<template>
  <div class="pageFormsCheckbox">
    <Row justify="center" gap="8">
      <Typography caption1>
        <Checkbox v-model="value" name="checkboxTest" label="ラベル" />
      </Typography>
    </Row>
  </div>
</template>

<script setup>
const value = ref(false)
</script>

<style lang="scss"></style>
