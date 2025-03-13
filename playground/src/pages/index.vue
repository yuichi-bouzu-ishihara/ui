<template>
	<div class="pageIndex">
		<Container wide>
			<Column justify="stretch" align="stretch" v-bind="{ gap }">
				<Row justify="stretch" align="stretch" split="2" v-bind="{ gap }">
					<DevSection title="Color" :to="'/color'">
						<Row :split="colors.length" gap="4" fit-w>
							<Ratio v-for="color in colors" :key="color" square>
								<Box w="100%" h="100%" r="4" v-bind="{ color }" />
							</Ratio>
						</Row>
					</DevSection>
					<DevSection title="Slider" :to="'/elements/slider'">
						<Slider centerd navigation>
							<Row gap="12" nowrap>
								<Box v-for="i in 8" :key="`slider-item-${i}`" w="80" h="80" r="4" color="light-005">
									<Center>
										<Typography center body bold color="light">
											{{ i }}
										</Typography>
									</Center>
								</Box>
							</Row>
							<template #prev>
								<IconButton :icon="{ name: 'arrowLeft', size: 16 }" :w="40" :h="40" link rounded
									:style="{ left: '-40px' }" />
							</template>
							<template #next>
								<IconButton :icon="{ name: 'arrowRight', size: 16 }" :w="40" :h="40" link rounded
									:style="{ right: '-40px' }" />
							</template>
						</Slider>
					</DevSection>
				</Row>
				<Row justify="stretch" align="stretch" split="3" v-bind="{ gap }">
					<DevSection title="Input" :to="'/forms/input'">
						<Typography headline>
							<Input v-model="inputValue" name="input" label="label" placeholder="Placeholder" />
						</Typography>
					</DevSection>
					<DevSection title="Textarea" :to="'/forms/textarea'">
						<Typography headline>
							<Textarea v-model="textareaValue" name="textareaTest" label="Textarea" placeholder="Placeholder" />
						</Typography>
					</DevSection>
					<DevSection title="Select" :to="'/forms/select'">
						<Typography headline>
							<Select v-model="selectValue" name="select" label="label" placeholder="Placeholder" />
						</Typography>
					</DevSection>
				</Row>
				<Row justify="stretch" align="stretch" split="2" v-bind="{ gap }">
					<DevSection title="Range" :to="'/forms/input-range'">
						<Box w="100%" h="100%">
							<Column align="center" fit>
								<InputRange v-model="rangeValue" name="rangeTest" />
							</Column>
						</Box>
					</DevSection>
					<Row justify="stretch" align="stretch" split="2" v-bind="{ gap }">
						<DevSection title="Switch" :to="'/forms/switch'">
							<Typography headline>
								<Switch v-model="switchValue" name="switchTest" />
							</Typography>
						</DevSection>
						<DevSection title="Checkbox" :to="'/forms/checkbox'">
							<Typography headline>
								<Checkbox v-model="checkboxValue" name="checkboxTest" />
							</Typography>
						</DevSection>
					</Row>
				</Row>
				<Row justify="stretch" align="stretch" split="2" v-bind="{ gap }">
					<DevSection title="Button" :to="'/elements/button'">
						<Row justify="center" gap="8">
							<Button primary small>
								Primary
							</Button>
							<Button secondary small>
								Secondary
							</Button>
							<Button tertiary small>
								Tertiary
							</Button>
							<!-- <Button quaternary small>Quaternary</Button> -->
							<Button info small>
								Info
							</Button>
							<Button link small>
								Link
							</Button>
							<Button minimal small>
								Minimal
							</Button>
						</Row>
					</DevSection>
					<DevSection title="IconButton" :to="'/elements/icon-button'">
						<Row justify="center" align="center" gap="8">
							<IconButton primary small :icon="{ name: 'home' }" />
							<IconButton secondary small :icon="{ name: 'home' }" />
							<IconButton tertiary small :icon="{ name: 'home' }" />
							<!-- <IconButton quaternary small :icon="{ name: 'home' }" /> -->
							<IconButton info small :icon="{ name: 'home' }" />
							<IconButton link small :icon="{ name: 'home' }" />
							<IconButton minimal small :icon="{ name: 'home' }" />
						</Row>
					</DevSection>
				</Row>
				<Row align="stretch" split="2" v-bind="{ gap }">
					<DevSection title="Icon" :to="'/elements/icon'">
						<Box w="100%" h="100%" overflow>
							<Row gap="8">
								<Icon v-for="icon in iconList" :key="icon" :name="icon" size="20" color="text" />
							</Row>
						</Box>
					</DevSection>
					<Row justify="stretch" align="stretch" split="2" v-bind="{ gap }">
						<DevSection title="Spinner" :to="'/elements/spinner'">
							<Center>
								<Box pt="20" pb="20">
									<Spinner size="72" stroke="4.8" />
								</Box>
							</Center>
						</DevSection>
						<DevSection title="RoundProgressBar" :to="'/elements/round-progress-bar'">
							<Center>
								<Box pt="20" pb="20">
									<RoundProgressBar size="72" stroke="4" :percent="72" />
								</Box>
							</Center>
						</DevSection>
						<DevSection title="LoaderShaps" :to="'/elements/skeleton-shapes'">
							<Column justify="center" gap="8">
								<SkeletonShape avatar w="72" delay-index="0" animation />
								<SkeletonShape rect w="120" h="12" delay-index="1" animation />
								<SkeletonShape rect w="80" h="12" delay-index="2" animation />
							</Column>
						</DevSection>
						<DevSection title="Avatar" :to="'/elements/avatar'">
							<Typography headline>
								<AvatarGroup
									:list="['https://cdn.pixabay.com/photo/2023/06/13/17/16/ai-generated-8061458_1280.png', 'https://cdn.pixabay.com/photo/2023/09/03/10/28/ai-generated-8230431_1280.png', 'https://cdn.pixabay.com/photo/2024/06/23/07/55/face-8847631_1280.jpg']"
									size="120" border="2" />
							</Typography>
						</DevSection>
					</Row>
				</Row>
				<Row align="stretch" split="2" v-bind="{ gap }">
					<DevSection title="Logo" :to="'/elements/logo'">
						<Logo size="40" color="text" />
					</DevSection>
					<DevSection title="Typography" :to="'/elements/typography'">
						<Column gap="2">
							<Typography body>
								This is a <strong>body</strong> text.
							</Typography>
							<Typography title3>
								This is a Title3 text.
							</Typography>
							<Typography large-title>
								It's <mark>Mark</mark> text.
							</Typography>
						</Column>
					</DevSection>
				</Row>
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
import iconList from '../../../src/runtime/assets/honoo-ui/icons/list.json'

const gap = 12
const colors = ['primary', 'secondary', 'background', 'text', 'link']

const inputValue = ref('Input')
const textareaValue = ref('Textarea')
const selectValue = ref('Select')
const switchValue = ref(true)
const checkboxValue = ref(true)
const rangeValue = ref(33)
</script>

<style lang="scss"></style>
