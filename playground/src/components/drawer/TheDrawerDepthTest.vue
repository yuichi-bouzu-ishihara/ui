<template>
	<Drawer name="depthTest">
		<Center class="theDrawerDepthTest">
			<Row gap="16">
				<Button @click="closeOne('depthTest')">
					Close This Drawer
				</Button>
			</Row>
		</Center>
	</Drawer>
</template>

<script setup lang="ts">
const { closeOne } = useDrawer()
</script>
