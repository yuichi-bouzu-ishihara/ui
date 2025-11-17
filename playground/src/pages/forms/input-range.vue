<template>
  <div class="pageFormsInputRange">
    <Container>
      <Column justify="center" gap="40">
        <Row justify="center" align="center" gap="40">
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              Default
            </Typography>
            <Container>
              <InputRange v-model="value1" min="0" max="100" controls />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value1) }}
            </Typography>
          </Column>
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              Custom
            </Typography>
            <Container>
              <InputRange v-model="value2" min="0" max="100" controls
                :color="{ handle: 'var(--color-text)', bar: 'var(--color-text)', barBackground: 'var(--color-text-010)' }" />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value2) }}
            </Typography>
          </Column>
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              No Controls
            </Typography>
            <Container>
              <InputRange v-model="value3" min="0" max="100" />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value3) }}
            </Typography>
          </Column>
        </Row>
        <Row justify="center" align="center" gap="40">
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              Disabled
            </Typography>
            <Container>
              <InputRange v-model="value4" min="0" max="100" controls disabled />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value4) }}
            </Typography>
          </Column>
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              Custom Range (0-50)
            </Typography>
            <Container>
              <InputRange v-model="value5" min="0" max="50" step="5" controls />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value5) }}
            </Typography>
          </Column>
          <Column justify="center" align="center" gap="8">
            <Typography caption1 bold center>
              Large Handle (24px)
            </Typography>
            <Container>
              <InputRange v-model="value6" min="0" max="100" controls :handle-size="24" />
            </Container>
            <Typography title3 center>
              {{ Math.floor(value6) }}
            </Typography>
          </Column>
        </Row>
      </Column>
    </Container>
  </div>
</template>

<script setup>
const value1 = ref(30)
const value2 = ref(50)
const value3 = ref(70)
const value4 = ref(40)
const value5 = ref(25)
const value6 = ref(60)
</script>

<style lang="scss"></style>
