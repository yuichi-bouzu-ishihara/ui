<template>
  <div class="pageComposablesFetchClient">
    <Container>
      <Column gap="40" justify="stretch">
        <Typography subheadline extrabold>
          <Input v-model="url" type="text" name="api" autocomplete label="API URL" />
        </Typography>
        <TransitionAcordion>
          <Column v-if="url" gap="20" justify="stretch">
            <Typography caption1>
              <Textarea v-model="params" label="パラメータをjson形式で入力してください" name="params" rows="6" />
            </Typography>
            <Row justify="stretch" gap="1">
              <Button secondary :loading="processing" :disabled="disabled" @click="post">
                POST
              </Button>
              <Button secondary :loading="processing" :disabled="disabled" @click="get">
                GET
              </Button>
            </Row>
          </Column>
        </TransitionAcordion>
      </Column>
      <Box mt="80">
        <TransitionAcordion>
          <CodeHighlighter v-if="response" title="Response" lang="json" :code="JSON.stringify(response, null, 4)" />
          <CodeHighlighter v-if="error" title="Error" lang="json" :code="JSON.stringify(error, null, 4)" />
        </TransitionAcordion>
      </Box>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { CustomError, CustomErrorCode } from '../../../../src/runtime/classes/error'

// Composables -------------------
const { request } = useFetchClient()

// Data -------------------
const url: Ref<string> = ref('')
const params: Ref<string> = ref('')
const response: Ref<object | null> = ref(null)
const error: Ref<unknown> = ref(null)
const processing: Ref<boolean> = ref(false)

const post = async () => {
  let p: object = {}
  try {
    p = params.value ? JSON.parse(params.value) : {}
  }
  catch (e: unknown) {
    await useDialog().error(new CustomError(CustomErrorCode.ValidationError, '', `パラメータに問題があります。${e}`))
    return
  }

  try {
    response.value = null
    processing.value = true
    response.value = await request(url.value, { method: 'POST', body: p, csrf: true })
  }
  catch (e: unknown) {
    error.value = e
  }
  finally {
    processing.value = false
  }
}
const get = async () => {
  try {
    response.value = null
    processing.value = true
    const p: object = params.value ? JSON.parse(params.value) : null
    response.value = await request(url.value, { body: p })
  }
  catch (e: unknown) {
    error.value = e
  }
  finally {
    processing.value = false
  }
}

const disabled = computed(() => {
  return !url.value
})
</script>

<style lang="scss"></style>
