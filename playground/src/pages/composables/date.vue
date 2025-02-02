<template>
  <div class="pageComposablesDate">
    <Column gap="20">
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            default
          </Typography>
        </Box>
        <Typography body>
          {{ targetDate }}
        </Typography>
      </Row>
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            format
          </Typography>
        </Box>
        <Typography body>
          {{ useDate().format(targetDate, 'yyyy.MM.dd') }}
        </Typography>
      </Row>
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            localize
          </Typography>
        </Box>
        <Typography body>
          {{ useDate().localize(targetDate, true, 'en-US') }}
        </Typography>
      </Row>
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            elapsed
          </Typography>
        </Box>
        <Typography body>
          {{ useDate().elapsed(targetDate) }}
        </Typography>
      </Row>
    </Column>
  </div>
</template>

<script setup>
const targetDate = '2024-05-01T00:00:00.000000Z'
</script>

<style lang="scss"></style>
