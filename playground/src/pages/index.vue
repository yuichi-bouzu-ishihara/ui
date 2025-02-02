<template>
	<div class="pageIndex">
		<Container wide>
			<Column justify="stretch" align="stretch" v-bind="{ gap }">
				<Row justify="stretch" align="stretch" split="4" v-bind="{ gap }">
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
							<IconButton primary small :icon="{ name: 'arrowLeft' }" />
							<IconButton secondary small :icon="{ name: 'arrowUp' }" />
							<IconButton tertiary small :icon="{ name: 'arrowRight' }" />
							<!-- <IconButton quaternary small :icon="{ name: 'arrowLeft' }" /> -->
							<IconButton info small :icon="{ name: 'arrowDown' }" />
							<IconButton link small :icon="{ name: 'arrowLeft' }" />
							<IconButton minimal small :icon="{ name: 'arrowUp' }" />
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
					<Row justify="stretch" align="stretch" v-bind="{ gap }">
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
						<Box w="100%" h="100%" overflow>
							<DevSection title="LoaderShaps" :to="'/elements/skeleton-shapes'">
								<Column justify="center" gap="8">
									<SkeletonShape avatar w="72" delay="100" animation />
									<SkeletonShape rect w="120" h="12" delay="150" animation />
									<SkeletonShape rect w="80" h="12" delay="200" animation />
								</Column>
							</DevSection>
						</Box>
					</Row>
				</Row>
				<DevSection title="Typography" :to="'/elements/typography'">
					<Column gap="2">
						<Typography body>
							This is a <strong>body</strong> text.
						</Typography>
						<Typography title3>
							This is a Title3 text.
						</Typography>
						<Typography large-title>
							It's <Mark>Mark</Mark> text.
						</Typography>
					</Column>
				</DevSection>
			</Column>
		</Container>
	</div>
</template>

<script setup lang="ts">
import iconList from '../../../src/runtime/assets/bouzu-ui/icons/list.json'

const gap = 12

const inputValue = ref('Input')
const textareaValue = ref('Textarea')
const switchValue = ref(true)
const checkboxValue = ref(true)
</script>

<style lang="scss"></style>
