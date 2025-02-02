<template>
  <div class="pageOverLaysDialog">
    <Container>
      <Row justify="center" :gap="[8, 8]">
        <Button @click="openDialogAlert">
          DialogAlert
        </Button>
        <Button @click="openDialogConfirm">
          DialogConfirm
        </Button>
        <Button @click="openDialogError">
          DialogError
        </Button>
      </Row>
    </Container>
  </div>
</template>

<script setup>
const openDialogAlert = () => {
  useDialog().alert({ title: 'Title', message: 'Message', icon: 'edit', button: '理解しました' })
}

const openDialogConfirm = () => {
  useDialog().confirm({ title: 'Title', message: 'Message', icon: 'edit', buttons: { ok: 'はい', cancel: 'いいえ' } })
}

const openDialogError = () => {
  useDialog().error({ title: 'Title', message: 'Message', button: '閉じる' })
}
</script>

<style lang="scss"></style>
