<template>
  <div class="pageOverLaysSheet">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button
          @click="open('message', { title: 'Title', content: 'Text Content is here.<br />Please Test Message.', icon: 'edit', buttonName: 'OK' })">
          SheetMessage
        </Button>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const open = async (name, options) => {
  const result = await useSheet().open({ name, options })
  console.log(result)
}
</script>

<style lang="scss"></style>
