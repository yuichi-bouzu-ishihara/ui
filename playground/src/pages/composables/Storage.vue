<template>
  <div class="pageComposablesStorage">
    <Container narrow>
      <Column justify="stretch" gap="20">
        <Input v-model="value" name="storage-test" label="Set Value" placeholder="Input value ..." />
        <Row split="2" gap="20" nowrap>
          <Button @click="storage.local.set('test', value)">
            Set Local
          </Button>
          <Button @click="getValue()">
            Get Local
          </Button>
        </Row>
        <Row split="2" gap="20" nowrap>
          <Button @click="storage.session.set('test', value)">
            Set Session
          </Button>
          <Button @click="getSessionValue()">
            Get Session
          </Button>
        </Row>
      </Column>
    </Container>
  </div>
</template>

<script setup lang="ts">
const storage = useStorage()

const value = ref('')

const getValue = () => {
  const v = storage.local.get('test')
  console.log('get local value', v)
}

const getSessionValue = () => {
  const v = storage.session.get('test')
  console.log('get session value', v)
}
</script>

<style lang="scss"></style>
