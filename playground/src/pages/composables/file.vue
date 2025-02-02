<template>
  <div class="pageComposablesImage">
    <Center>
      <Button @click="handleUrlToFile">
        URL to File
      </Button>
    </Center>
  </div>
</template>

<script setup>
const { urlToFile } = useFile()

const handleUrlToFile = async () => {
  const res = await urlToFile('https://cdn.pixabay.com/photo/2024/01/10/13/13/ai-generated-8499585_1280.png')
  console.log(res)
}
</script>

<style lang="scss"></style>
