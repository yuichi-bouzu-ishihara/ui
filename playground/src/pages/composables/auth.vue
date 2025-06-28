<template>
	<Box>
		<Button @click="login('test')">
			Login
		</Button>
		<Button @click="logout">
			Logout
		</Button>
	</Box>
</template>

<script setup>
const auth = useAuth()
const { login, logout } = auth
</script>

<style lang="scss"></style>
