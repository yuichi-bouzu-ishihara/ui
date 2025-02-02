<template>
  <div class="pageComposablesScroll">
    <Column gap="20">
      <Row gap="20" nowrap>
        <Box w="60">
          <Typography body bold right>
            isScrollLock
          </Typography>
        </Box>
        <Typography body>
          {{ useScroll().isScrollLock.value }}
        </Typography>
      </Row>
      <Row gap="20" nowrap>
        <Button @click="useScroll().lock()">
          lock
        </Button>
        <Button @click="useScroll().unlock()">
          unlock
        </Button>
      </Row>
    </Column>
  </div>
</template>

<script setup>
</script>

<style lang="scss"></style>
