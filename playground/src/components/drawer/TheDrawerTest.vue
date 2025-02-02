<template>
	<Drawer name="test">
		<Center class="theDrawerTest">
			<Row gap="16">
				<Button @click="open({ name: 'depthTest' })">
					Open Drawer
				</Button>
				<Button @click="closeOne('test')">
					Close This Drawer
				</Button>
			</Row>
		</Center>
	</Drawer>
</template>

<script setup lang="ts">
const { open, closeOne } = useDrawer()
</script>
