<template>
  <Box w="100vw">
    <Container full>
      <Box color="primary" w="100%" pt="20" pb="20">
        <Typography center color="light">
          Full
        </Typography>
      </Box>
    </Container>
    <Container wide>
      <Box color="primary" w="100%" pt="20" pb="20">
        <Typography center color="light">
          Wide {{ wide }}
        </Typography>
      </Box>
    </Container>
    <Container>
      <Box color="primary" w="100%" pt="20" pb="20">
        <Typography center color="light">
          {{ base }}
        </Typography>
      </Box>
    </Container>
    <Container narrow>
      <Box color="primary" w="100%" pt="20" pb="20">
        <Typography center color="light">
          Narrow {{ narrow }}
        </Typography>
      </Box>
    </Container>
  </Box>
</template>

<script setup>
const { base, wide, narrow, minSideSpace } = useContainer()
</script>

<style lang="scss"></style>
