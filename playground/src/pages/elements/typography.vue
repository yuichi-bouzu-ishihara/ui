<template>
	<div class="pageElementsTypography">
		<Container wide>
			<Column gap="2em">
				<Box color="light010">
					<Typography footnote cap-height-baseline>
						Footnote : <mark>Becoming</mark> a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography callout cap-height-baseline color="rgb(255, 255, 0)">
						Callout : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography caption3 cap-height-baseline>
						Caption3 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography caption2 cap-height-baseline>
						Caption2 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography caption1 cap-height-baseline>
						Caption1 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography body cap-height-baseline>
						Body : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography lead cap-height-baseline>
						Lead : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography subheadline cap-height-baseline>
						Subheadline : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography headline cap-height-baseline>
						Headline : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography title3 cap-height-baseline>
						Title3 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography title2 cap-height-baseline>
						Title2 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography title1 cap-height-baseline>
						Title1 : Becoming a hero を夢見る A young man.
					</Typography>
				</Box>
				<Box color="light010">
					<Typography large-title cap-height-baseline>
						Large Title : Becoming を夢見る young man.
					</Typography>
				</Box>
				<Typography body>
					Becoming a hero を夢見る A young man.
				</Typography>
				<Typography headline>
					腕力は頼りないが、正義の心は誰よりも燃えている。- His physical strength is unreliable, but his sense of justice
					burns more fiercely than anyone else's.
				</Typography>
				<Typography large-title>
					ヒーローになるはずが、Dr.ドクロの改造手術を受けて凶悪なヴィランであるウィアードになってしまう。- He was supposed to become a hero, but after undergoing Dr.
					Dokuro's modification surgery, he ended up becoming the
					villainous Weird.
				</Typography>
				<CodeHighlighter title="Typography Config" lang="json" :code="JSON.stringify(useTypography().font, null, 2)" />
			</Column>
		</Container>
	</div>
</template>

<script setup>
</script>

<style lang="scss"></style>
