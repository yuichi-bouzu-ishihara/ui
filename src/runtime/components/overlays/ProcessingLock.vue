<template>
	<div class="processingLock">
		<Box pt="20" pr="20" pb="20" pl="20">
			<Column justify="center" align="center" gap="20">
				<Box v-if="icon || spinner || percent > 0" w="56" h="56" mb="-8" relative>
					<Center>
						<template v-if="icon">
							<Icon :name="icon" size="48" color="light" />
						</template>
						<template v-else-if="spinner">
							<Spinner size="56" stroke="5.2" color="light" />
						</template>
						<template v-else-if="percent > 0">
							<RoundProgressBar v-bind="{ percent }" size="56" stroke="4" color="light" />
							<Typography class="processingLock-percent" caption3 color="light" center bold>
								{{ percent }}%
							</Typography>
						</template>
					</Center>
				</Box>
				<Typography caption2 color="light" center bold linebreak>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<span v-html="message" />
				</Typography>
			</Column>
		</Box>
		<Backdrop />
	</div>
</template>

<script setup lang="ts">
import { useProcessing } from '../../composables/overlays/processing'
import Spinner from '../elements/Spinner.vue'
import RoundProgressBar from '../elements/RoundProgressBar.vue'
import Typography from '../elements/Typography.vue'
import Icon from '../elements/Icon.vue'
import Column from '../layout/Column.vue'
import Box from '../layout/Box.vue'
import Center from '../layout/Center.vue'
import Backdrop from './Backdrop.vue'

const { spinner, percent, icon, message } = useProcessing()
</script>

<style lang="scss">
@use '../../scss/_mixins.scss' as mix;
@use '../../scss/_functions.scss' as func;
$cn: '.processingLock'; // コンポーネントセレクタ名

@include mix.component-styles($cn) using ($mode) {
	@if $mode =='base' {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;

		&-percent {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	@if $mode =='darkmode' {}

	@if $mode =='auto' {}
}
</style>
