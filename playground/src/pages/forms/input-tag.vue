<template>
  <div class="pageFormsInput">
    <Container>
      <Row justify="center" gap="8">
        <Typography body bold>
          <InputTag v-model="value" name="inputTagTest" placeholder="プレースホルダープレースホルダー" focus />
        </Typography>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const value = ref(['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'])
</script>

<style lang="scss"></style>
