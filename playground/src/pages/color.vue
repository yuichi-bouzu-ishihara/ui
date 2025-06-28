<template>
	<div class="pageColor">
		<Container>
			<Column justify="center" gap="32">
				<Row justify="center" align="center" gap="8">
					<Typography caption1 bold cap-height-baseline :color="`text-${isDark ? '030' : '100'}`">
						Light
					</Typography>
					<Switch v-model="isDark" name="colorMode" />
					<Typography caption1 bold cap-height-baseline :color="`text-${isDark ? '100' : '030'}`">
						Dark
					</Typography>
				</Row>
				<Row :split="colorList.length" justify="center" gap="4" fit-w>
					<Ratio v-for="color in colorList" :key="color" square>
						<Box w="100%" h="100%" r="4" v-bind="{ color }" />
					</Ratio>
				</Row>
				<CodeHighlighter title="useColor().priorities" lang="json"
					:code="JSON.stringify(useColor().priorities, null, 2)" />
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
const colorList = ref<string[]>([])
const isDark = ref(true)

watch(() => isDark.value, (nv, ov) => {
	if (nv !== ov) {
		const primary = '#FE2622'
		const dark = '#383739'
		const darkblack = '#2C2C2E'
		const light = '#EFEFEF'
		const ultralight = '#FAFAFB'
		const danger = primary
		const success = '#277BDB'
		const link = success // リンク色
		const background = nv ? darkblack : light // 背景色
		const text = nv ? light : dark // テキスト色
		const control = nv ? light : dark // コントロール色。 e.g. checkbox background, switch UI background...
		const indicator = nv ? light : dark // インジケーター色。 e.g. checkbox check Icon, switch UI handle...
		const accent = primary // アクセント色
		useColor().update({
			primary,
			dark,
			darkblack,
			light,
			ultralight,
			danger,
			success,
			link,
			background,
			text,
			control,
			indicator,
			accent,
		})
	}
},
	{ immediate: true },
)

onMounted(() => {
	const priorities = useColor().priorities
	if (priorities) {
		colorList.value = Object.keys(priorities)
	}
})
</script>
