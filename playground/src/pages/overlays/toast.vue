<template>
	<Center class="pageToast">
		<Container narrow>
			<Column justify="stretch" gap="20" fit-w>
				<Button @click="show({ message: 'Success' })">
					Success
				</Button>
				<Button @click="show({ message: 'Success', type: 'success', icon: 'check' })">
					Success /w Icon
				</Button>
				<Button @click="show({ message: 'Error', type: 'error', icon: 'exclamation' })">
					Error
				</Button>
				<Button @click="show({ message: 'Warning', type: 'warning' })">
					Warning
				</Button>
				<Button @click="show({ message: 'Info', type: 'info' })">
					Info
				</Button>
			</Column>
		</Container>
	</Center>
</template>

<script setup lang="ts">
const { show } = useToast()
</script>
