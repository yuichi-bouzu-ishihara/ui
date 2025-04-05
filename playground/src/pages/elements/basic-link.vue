<template>
	<div class="pageElementsTypography">
		<Container>
			<Column gap="8">
				<BasicLink to="https://www.google.com">
					Google (No props)
				</BasicLink>
				<BasicLink to="https://www.google.com" blank>
					Google (blank)
				</BasicLink>
				<BasicLink to="https://www.google.com" :is-external-blank="false">
					Google (isExternalBlank: false)
				</BasicLink>
				<BasicLink to="https://www.google.com" :is-external-blank="false" blank>
					Google (isExternalBlank: false & blank)
				</BasicLink>
			</Column>
		</Container>
	</div>
</template>
