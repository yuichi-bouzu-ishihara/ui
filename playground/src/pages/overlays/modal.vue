<template>
  <div class="pageOverLaysModal">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button @click="open('test', 'soft', true, { content: 'Text Content is here.<br />Please Test Message.' })">
          ModalTest
        </Button>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const open = async (name, backdrop, blur, options) => {
  const result = await useModal().open({ name, backdrop, blur, options })
  console.log(result)
}
</script>

<style lang="scss"></style>
