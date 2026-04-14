<template>
	<Sheet class="bSheet" wide center close title="BSheet" @close="close($attrs.index as number, true)">
		<Box h="560">
			<Center>
				<Typography font-size="120" extrabold center>
					B
				</Typography>
			</Center>
		</Box>
	</Sheet>
</template>

<script setup lang="ts">
const { close } = useSheet()
</script>
