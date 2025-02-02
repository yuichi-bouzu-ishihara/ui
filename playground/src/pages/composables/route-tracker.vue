<template>
  <div class="pageComposablesRouteTracker">
    <Column gap="20">
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            To
          </Typography>
        </Box>
        <Typography body>
          {{ useRouteTracker().to.value.fullPath }}
        </Typography>
      </Row>
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            From
          </Typography>
        </Box>
        <Typography body>
          {{ useRouteTracker().from.value.fullPath }}
        </Typography>
      </Row>
    </Column>
  </div>
</template>

<script setup>
</script>

<style lang="scss"></style>
