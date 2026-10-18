<template>
	<Box w="100vw" pt="40">
		<Row gap="40" nowrap>
			<Container narrow no-padding>
				<Typography color="light">
					<Column justify="center" gap="20">
						<Ratio paper>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Paper
							</Box>
						</Ratio>
						<Ratio ultra-wide-gaming>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Ultra Wide Gaming
							</Box>
						</Ratio>
						<Ratio cinema>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Cinema
							</Box>
						</Ratio>
						<Ratio golden>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Golden
							</Box>
						</Ratio>
						<Ratio square>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Square
							</Box>
						</Ratio>
						<Ratio per="33.333">
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Per 33.333%
							</Box>
						</Ratio>
						<!-- 幅 100% を当てた FileUpload が、Ratio の幅いっぱいに広がること（#7） -->
						<Ratio golden>
							<FileUpload class="pageLayoutRatio-fileUpload" accept="image/png,image/jpeg"
								:label="{ idle: 'Ratio の中の FileUpload' }" />
						</Ratio>
					</Column>
				</Typography>
			</Container>

			<Container narrow no-padding>
				<Typography color="light">
					<Column justify="center" gap="20">
						<Ratio paper portrait>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Paper Portrait
							</Box>
						</Ratio>
						<Ratio ultra-wide-gaming portrait>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Ultra Wide Gaming Portrait
							</Box>
						</Ratio>
						<Ratio cinema portrait>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Cinema Portrait
							</Box>
						</Ratio>
						<Ratio golden portrait>
							<Box color="text-060" w="100%" h="100%" pt="4" pl="8">
								Golden Portrait
							</Box>
						</Ratio>
					</Column>
				</Typography>
			</Container>
		</Row>
	</Box>
</template>

<script setup>
</script>

<style lang="scss">
.pageLayoutRatio-fileUpload {
	width: 100%;
	height: 100%;
}
</style>
