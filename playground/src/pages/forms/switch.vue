<template>
  <div class="pageFormsSwitch">
    <Row justify="center" gap="8">
      <Switch v-model="value" name="switchTest">
        Label
      </Switch>
    </Row>
  </div>
</template>

<script setup>
const value = ref(false)
</script>

<style lang="scss"></style>
