<template>
  <div class="pageOverLaysModal">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button @click="openModal">
          モーダルを開く
        </Button>
        <Button @click="openModalWithBlur">
          モーダルを開く（ぼかし付き）
        </Button>
      </Row>
      <Row justify="center" :gap="[8, 8]" style="margin-top: 16px;">
        <Typography body>
          結果: {{ result }}
        </Typography>
      </Row>
    </Container>
  </div>
</template>

<script setup lang="ts">
import TestModal from '@/components/modal/TestModal.vue'

// Data -----------------------------------------------
const result = ref<unknown>(null)

// Methods -----------------------------------------------
const openModal = async () => {
  result.value = await useModal().open({
    component: TestModal,
    props: {
      title: 'テストモーダル',
      message: 'これはテストメッセージです。',
    },
    backdrop: 'medium',
  })
  console.log('Modal result:', result.value)
}

const openModalWithBlur = async () => {
  result.value = await useModal().open({
    component: TestModal,
    props: {
      title: 'ぼかし付きモーダル',
      message: 'ぼかし効果が有効です。',
    },
    backdrop: 'soft',
    blur: true,
  })
  console.log('Modal result:', result.value)
}
</script>

<style lang="scss"></style>
