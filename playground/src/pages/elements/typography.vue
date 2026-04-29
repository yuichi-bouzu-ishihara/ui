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
				<!-- Linebreak: 狭い幅で英語が単語境界で改行されることを確認 -->
				<Typography title3>
					Linebreak (狭い幅での折り返し検証)
				</Typography>
				<Box color="light010" w="280px">
					<Column gap="1em">
						<Typography caption2 color="text-secondary">
							長い英文 — 単語境界で改行され、単語の途中では切れない
						</Typography>
						<Typography body linebreak>
							The implementation requires comprehensive understanding of internationalization and accessibility standards.
						</Typography>
						<Typography caption2 color="text-secondary">
							長い和文 — 文字単位で自然に折り返す
						</Typography>
						<Typography body linebreak>
							これは日本語の長い文章で、文字単位で自然に折り返されることを確認するためのサンプルテキストです。
						</Typography>
						<Typography caption2 color="text-secondary">
							和英混植 — 英単語は割らず、和文は文字単位で改行
						</Typography>
						<Typography body linebreak>
							このAPIのimplementationは複雑で、internationalizationの考慮が必要です。
						</Typography>
						<Typography caption2 color="text-secondary">
							長い URL — ボックス内に収まる
						</Typography>
						<Typography body linebreak>
							https://example.com/very/long/path/that-should-still-wrap-inside-the-box?query=value&another=parameter
						</Typography>
					</Column>
				</Box>

				<CodeHighlighter title="Typography Config" lang="json" :code="JSON.stringify(useTypography().font, null, 2)" />
			</Column>
		</Container>
	</div>
</template>

<script setup>
</script>

<style lang="scss"></style>
