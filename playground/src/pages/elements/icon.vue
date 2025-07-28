<template>
  <Container class="pageElementsAvatar">
    <Column gap="56">
      <Column justify="center" gap="16">
        <Typography title2>
          PreInstall Icons
        </Typography>
        <Row justify="center" gap="8">
          <!-- <Icon v-for="icon in preinstalls" :key="icon" :name="icon" :size="24" original-color /> -->
        </Row>
      </Column>
      <Column justify="center" gap="16">
        <Typography title2>
          Custom Icons
        </Typography>
        <Row justify="center" gap="8">
          <!-- <Icon v-for="icon in customs" :key="icon" :name="icon" size="24" color="light" /> -->
        </Row>
      </Column>
    </Column>
  </Container>
</template>

<script setup>
// import preinstalls from '../src/runtime/assets/bouzu-ui/icons/list.json'
// import customs from '../src/assets/custom-icon-list.json'
</script>

<style lang="scss"></style>
