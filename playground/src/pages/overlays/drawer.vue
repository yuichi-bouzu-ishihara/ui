<template>
  <div class="pageOverLaysSheet">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button @click="left">
          Left Open
        </Button>
        <Button @click="right">
          Right Open
        </Button>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const left = async () => {
  await useDrawer().open({ name: 'test', from: 'left' })
}
const right = async () => {
  await useDrawer().open({ name: 'test', from: 'right' })
}
</script>

<style lang="scss"></style>
