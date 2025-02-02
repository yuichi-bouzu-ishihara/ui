<template>
  <div class="pageNavigationTabs">
    <Container>
      <Tabs :list="list" />
    </Container>
  </div>
</template>

<script setup>
// ver.Click
const list = ref([
  {
    name: 'Menu1',
    current: true,
    click: () => {
      list.value.forEach((item) => {
        item.current = item.name === 'Menu1'
      })
    }
  },
  {
    name: 'Menu2',
    current: false,
    click: () => {
      list.value.forEach((item) => {
        item.current = item.name === 'Menu2'
      })
    }
  },
])
// ver.Link
// const list = ref([
//   {
//     name: 'Menu1',
//     current: true,
//     path: '#menu1'
//   },
//   {
//     name: 'Menu2',
//     current: false,
//     path: '#menu2'
//   }
// ])
</script>

<style lang="scss"></style>
