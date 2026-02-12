<template>
  <div class="pageElementsTypography">
    <Container>
      <Column gap="8">
        <Row justify="center" :gap="[8, 8]">
          <Button @click="handleClick">
            Primary
          </Button>
          <Button secondary>
            Secondary
          </Button>
          <Button tertiary>
            Tertiary
          </Button>
          <Button quaternary>
            Quaternary
          </Button>
          <Button info>
            Info
          </Button>
        </Row>
        <Row justify="center" :gap="[8, 8]">
          <Row justify="center" :gap="[8, 8]">
            <Button large>
              Large
            </Button>
            <Button medium>
              Medium
            </Button>
            <Button small>
              Small
            </Button>
            <Button xsmall>
              XSmall
            </Button>
          </Row>
          <Row justify="center" :gap="[8, 8]">
            <Button large>
              大きい
            </Button>
            <Button medium>
              中くらい
            </Button>
            <Button small>
              小さい
            </Button>
            <Button xsmall>
              最小
            </Button>
          </Row>
        </Row>
        <Row justify="center" :gap="[8, 8]">
          <Button v-bind="{ loadingState }" large @loading-click="loadingStateToggle">
            Loading - L
          </Button>
          <Button v-bind="{ loadingState }" medium @loading-click="loadingStateToggle">
            Loading - M
          </Button>
          <Button v-bind="{ loadingState }" small @loading-click="loadingStateToggle">
            Loading - S
          </Button>
          <Button v-bind="{ loadingState }" xsmall @loading-click="loadingStateToggle">
            Loading - XSmall
          </Button>
          <Button v-bind="{ loadingState }" info @loading-click="loadingStateToggle">
            Loading - Info
          </Button>
        </Row>
        <Row justify="center" :gap="[8, 8]">
          <Button rounded>
            Rounded
          </Button>
          <Button disabled>
            Disabled
          </Button>
        </Row>
        <Row justify="center" :gap="[8, 8]">
          <Button :color="{ background: '#0000ff', text: '#ff0000' }">
            Custom Color
          </Button>
        </Row>
        <Row justify="center" :gap="[8, 8]">
          <Button rounded @click="update">
            Update
          </Button>
          <Button rounded @click="reset">
            Reset Default
          </Button>
        </Row>
      </Column>
    </Container>
  </div>
</template>

<script setup lang="ts">
const loadingState = ref('processing')
const loadingStateToggle = () => {
  console.log('loadingStateToggle')
  loadingState.value = loadingState.value === 'processing' ? 'completed' : 'processing'
}
const handleClick = () => {
  console.log('clicked')
}
const update = () => {
  const conf = useButton().config.value
  if (!conf) return

  useButton().update({
    ...conf,
    primary: {
      ...conf.primary,
      backgroundColor: '#0000ff',
      textColor: '#ff0000',
    },
  })
}
const reset = () => {
  const defaultConfig = useAppConfig().ui?.button
  if (!defaultConfig) return

  useButton().update(defaultConfig)
}
</script>

<style lang="scss"></style>
