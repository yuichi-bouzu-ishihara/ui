<template>
	<Sheet class="aSheet" wide center close title="ASheet" @close="close($attrs.index as number, true)">
		<Box h="560">
			<Center>
				<Typography font-size="120" extrabold center>
					A
				</Typography>
			</Center>
		</Box>
	</Sheet>
</template>

<script setup lang="ts">
const { close } = useSheet()
</script>
