<template>
  <div class="pageOverLaysProcessingLock">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button @click="simple">
          Processing Lock Simple
        </Button>
        <Button @click="percent">
          Processing Lock Percent
        </Button>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const simple = async () => {
  useProcessing().open({ message: 'Processing...', spinner: true })
  await useUtils().wait(3000)
  useProcessing().update({ icon: 'check', message: 'Done!', spinner: false })
  await useUtils().wait(3000)
  useProcessing().close()
}
const percent = async () => {
  useProcessing().open({ message: 'Starting...', spinner: true })
  await useUtils().wait(3000)
  useProcessing().update({ message: 'Processing...', percent: 1 })
  await useUtils().wait(1000)
  useProcessing().update({ message: 'Processing...', percent: 33 })
  await useUtils().wait(1000)
  useProcessing().update({ message: 'Processing...', percent: 66 })
  await useUtils().wait(1000)
  useProcessing().update({ message: 'Processing...', percent: 100 })
  await useUtils().wait(1000)
  useProcessing().update({ message: 'Done!', spinner: true })
  await useUtils().wait(3000)
  useProcessing().close()
}
</script>

<style lang="scss"></style>
