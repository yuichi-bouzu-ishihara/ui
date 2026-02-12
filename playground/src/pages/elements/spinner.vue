<template>
  <Container narrow>
    <Center>
      <Column justify="center" align="center" gap="20">
        <Spinner size="24" stroke="1" color="success-060" />
        <Spinner size="24" stroke="2" color="success" />
        <Spinner size="24" stroke="3" color="text-060" />
        <Spinner size="24" stroke="4" color="text" />
        <Spinner size="24" stroke="4.8" color="primary-060" />
        <Spinner size="24" stroke="5.6" color="primary" />
        <Spinner size="24" stroke="5.6" color="#00ff00" />
        <Spinner size="24" stroke="5.6" color="rgba(0, 255, 0, 0.2)" />

        <!-- complete prop のデモ -->
        <Row align="center" gap="12">
          <Button @click="toggleComplete">
            {{ isComplete ? 'リセット' : 'Complete' }}
          </Button>
        </Row>
        <Spinner size="32" stroke="3" color="success" :complete="isComplete" @complete="onComplete" />
        <Spinner size="48" stroke="3" color="primary" :complete="isComplete" @complete="onComplete" />
        <Spinner size="24" stroke="2" color="text" :complete="isComplete" @complete="onComplete" />
      </Column>
    </Center>
  </Container>
</template>

<script setup lang="ts">
// Data ------------------------------------------------
const isComplete = ref(false)

// Methods ------------------------------------------------
const toggleComplete = () => {
  isComplete.value = !isComplete.value
}

const onComplete = () => {
  console.log('CircleCheck アニメーション完了')
}
</script>

<style lang="scss"></style>
