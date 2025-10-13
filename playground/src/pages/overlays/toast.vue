<template>
	<Center class="pageToast">
		<Container narrow>
			<Column justify="stretch" gap="20" fit-w>
				<Typography h3>
					基本のToast
				</Typography>
				<Row gap="12" wrap>
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
				</Row>

				<Typography h3>
					自動消去しないToast
				</Typography>
				<Row gap="12" wrap>
					<Button @click="show({ message: '永続的なSuccess', type: 'success', icon: 'check', persistent: true })">
						永続的なSuccess
					</Button>
					<Button @click="show({ message: '永続的なError', type: 'error', icon: 'exclamation', persistent: true })">
						永続的なError
					</Button>
					<Button @click="show({ message: '永続的なWarning', type: 'warning', persistent: true })">
						永続的なWarning
					</Button>
				</Row>

				<Typography h3>
					Toast制御
				</Typography>
				<Row gap="12" wrap>
					<Button variant="secondary" @click="hideByType('success')">
						全てのSuccessを消去
					</Button>
					<Button variant="secondary" @click="hideByType('error')">
						全てのErrorを消去
					</Button>
					<Button variant="secondary" @click="hideByType('warning')">
						全てのWarningを消去
					</Button>
					<Button variant="danger" @click="hideAll()">
						全てのToastを消去
					</Button>
				</Row>

				<Typography h3>
					Toast情報取得
				</Typography>
				<Row gap="12" wrap>
					<Button variant="secondary" @click="showToastInfo()">
						最初のToast情報を表示
					</Button>
				</Row>

				<Typography h3>
					IDを返す機能テスト
				</Typography>
				<Row gap="12" wrap>
					<Button @click="testIdReturn()">
						Toastを表示してIDを取得
					</Button>
					<Button variant="secondary" @click="hideSpecificToast()">
						最後に作成したToastを消去
					</Button>
				</Row>

				<Typography h3>
					Toast更新機能
				</Typography>
				<Row gap="12" wrap>
					<Button @click="createUpdateableToast()">
						更新可能Toastを作成
					</Button>
					<Button variant="secondary" @click="updateMessage()">
						メッセージを更新
					</Button>
					<Button variant="secondary" @click="updateType()">
						タイプを更新
					</Button>
					<Button variant="secondary" @click="updateImage()">
						画像を更新
					</Button>
				</Row>

				<Typography h3>
					デフォルトDuration設定
				</Typography>
				<Row gap="12" wrap>
					<Button @click="testDefaultDuration()">
						デフォルトDurationテスト
					</Button>
					<Button variant="secondary" @click="setDefaultDuration(1000)">
						1秒に設定
					</Button>
					<Button variant="secondary" @click="setDefaultDuration(5000)">
						5秒に設定
					</Button>
					<Button variant="secondary" @click="setDefaultDuration(3000)">
						3秒にリセット
					</Button>
				</Row>

				<Typography h3>
					下位置設定
				</Typography>
				<Row gap="12" wrap>
					<Button @click="testBottom()">
						下位置テスト
					</Button>
					<Button variant="secondary" @click="setBottom('8px')">
						8pxに設定
					</Button>
					<Button variant="secondary" @click="setBottom('32px')">
						32pxに設定
					</Button>
					<Button variant="secondary" @click="setBottom('16px')">
						16pxにリセット
					</Button>
				</Row>

				<Typography h3>
					消去不可Toast
				</Typography>
				<Row gap="12" wrap>
					<Button @click="showNonDismissibleToast()">
						消去不可Toast（重要メッセージ）
					</Button>
					<Button @click="showNonDismissiblePersistentToast()">
						消去不可永続Toast
					</Button>
				</Row>

				<Typography h3>
					画像付きToast
				</Typography>
				<Row gap="12" wrap>
					<Button @click="showImageToast()">
						画像付きToast
					</Button>
					<Button @click="showProcessingImageToast()">
						処理中画像Toast
					</Button>
					<Button @click="simulateImageProcessing()">
						画像処理シミュレーション
					</Button>
				</Row>
			</Column>
		</Container>
	</Center>
</template>

<script setup lang="ts">
const { show, hide, hideByType, hideAll, getToastById, update, updateConfig, config, list } = useToast()

// 最後に作成したtoastのIDを保存
const lastToastId = ref<number | null>(null)
// 更新可能なtoastのIDを保存
const updateableToastId = ref<number | null>(null)

const showToastInfo = () => {
	if (list.value.length > 0) {
		const firstToast = getToastById(list.value[0].id)
		if (firstToast) {
			show({
				message: `ID: ${firstToast.id}, Type: ${firstToast.type}, Persistent: ${firstToast.persistent}`,
				type: 'info',
			})
		}
	}
	else {
		show({
			message: 'Toastがありません',
			type: 'warning',
		})
	}
}

const testIdReturn = () => {
	const toastId = show({
		message: `Toast ID: ${Date.now()}`,
		type: 'info',
		persistent: true,
	})
	lastToastId.value = toastId
	show({
		message: `作成されたToastのID: ${toastId}`,
		type: 'success',
	})
}

const hideSpecificToast = () => {
	if (lastToastId.value !== null) {
		hide(lastToastId.value)
		show({
			message: `ID ${lastToastId.value} のToastを消去しました`,
			type: 'info',
		})
		lastToastId.value = null
	}
	else {
		show({
			message: '消去するToastがありません',
			type: 'warning',
		})
	}
}

const showNonDismissibleToast = () => {
	show({
		message: 'これは重要なメッセージです。バツアイコンは表示されません。',
		type: 'error',
		icon: 'exclamation',
		dismissible: false,
	})
}

const showNonDismissiblePersistentToast = () => {
	show({
		message: 'これは消去不可の永続Toastです。自動消去もされません。',
		type: 'warning',
		icon: 'exclamation',
		persistent: true,
		dismissible: false,
	})
}

const showImageToast = () => {
	show({
		message: '画像がアップロードされました',
		type: 'success',
		image: {
			src: 'https://picsum.photos/100/100?random=1',
			icon: 'check',
		},
	})
}

const showProcessingImageToast = () => {
	show({
		message: '画像を処理中です...',
		type: 'info',
		image: {
			src: 'https://picsum.photos/100/100?random=2',
			processing: true,
		},
		persistent: true,
		dismissible: false,
	})
}

let processingToastId: number | null = null

const simulateImageProcessing = () => {
	// 処理中Toastを表示
	processingToastId = show({
		message: '画像を処理中です...',
		type: 'info',
		image: {
			src: 'https://picsum.photos/100/100?random=3',
			processing: true,
		},
		persistent: true,
	})

	// 3秒後に処理完了Toastに更新
	setTimeout(() => {
		if (processingToastId !== null) {
			hide(processingToastId)
		}
		show({
			message: '画像の処理が完了しました！',
			type: 'success',
			image: {
				src: 'https://picsum.photos/100/100?random=3',
				processing: false,
			},
		})
		processingToastId = null
	}, 3000)
}

const createUpdateableToast = () => {
	updateableToastId.value = show({
		message: '更新可能なToastです',
		type: 'info',
		persistent: true,
	})
	show({
		message: `更新可能Toastを作成しました（ID: ${updateableToastId.value}）`,
		type: 'success',
		icon: 'check',
	})
}

const updateMessage = () => {
	if (updateableToastId.value !== null) {
		const success = update(updateableToastId.value, {
			message: `メッセージが更新されました！時刻: ${new Date().toLocaleTimeString()}`,
		})
		if (success) {
			show({
				message: 'メッセージを更新しました',
				type: 'success',
				icon: 'check',
			})
		}
		else {
			show({
				message: 'Toastが見つかりません',
				type: 'error',
				icon: 'exclamation',
			})
		}
	}
	else {
		show({
			message: '更新可能なToastがありません',
			type: 'warning',
			icon: 'exclamation',
		})
	}
}

const updateType = () => {
	if (updateableToastId.value !== null) {
		const types = ['text', 'success', 'error', 'warning', 'info'] as const
		const currentToast = getToastById(updateableToastId.value)
		const currentTypeIndex = types.indexOf(currentToast?.type || 'text')
		const nextType = types[(currentTypeIndex + 1) % types.length]

		const success = update(updateableToastId.value, {
			type: nextType,
			message: `タイプが${nextType}に更新されました`,
		})
		if (success) {
			show({
				message: `タイプを${nextType}に更新しました`,
				type: 'success',
				icon: 'check',
			})
		}
	}
	else {
		show({
			message: '更新可能なToastがありません',
			type: 'warning',
			icon: 'exclamation',
		})
	}
}

const updateImage = () => {
	if (updateableToastId.value !== null) {
		const randomImage = Math.floor(Math.random() * 10) + 1
		const success = update(updateableToastId.value, {
			message: '画像が更新されました',
			image: {
				src: `https://picsum.photos/100/100?random=${randomImage}`,
				icon: 'image',
			},
		})
		if (success) {
			show({
				message: '画像を更新しました',
				type: 'success',
				icon: 'check',
			})
		}
	}
	else {
		show({
			message: '更新可能なToastがありません',
			type: 'warning',
			icon: 'exclamation',
		})
	}
}

const testDefaultDuration = () => {
	show({
		message: 'このToastはデフォルトDurationで表示されます',
		type: 'info',
		icon: 'clock',
	})
	show({
		message: `現在のデフォルトDuration: ${config.value?.defaultDuration || 3000}ms`,
		type: 'success',
		icon: 'check',
	})
}

const setDefaultDuration = (duration: number) => {
	updateConfig({
		color: {
			background: config.value?.color?.background || 'var(--color-text-005)',
			text: config.value?.color?.text || 'var(--color-text)',
		},
		defaultDuration: duration,
		bottom: config.value?.bottom || 16,
	})
	show({
		message: `デフォルトDurationを${duration}msに設定しました`,
		type: 'success',
		icon: 'settings',
	})
}

const testBottom = () => {
	show({
		message: 'このToastの下位置を確認してください',
		type: 'info',
		icon: 'arrow-down',
		persistent: true,
	})
	show({
		message: `現在の下位置: ${config.value?.bottom || 16}px`,
		type: 'success',
		icon: 'check',
	})
}

const setBottom = (bottom: string) => {
	updateConfig({
		color: {
			background: config.value?.color?.background || 'var(--color-text-005)',
			text: config.value?.color?.text || 'var(--color-text)',
		},
		defaultDuration: config.value?.defaultDuration || 3000,
		bottom,
	})
	show({
		message: `下位置を${bottom}pxに設定しました`,
		type: 'success',
		icon: 'settings',
	})
}

// Watches ---------------------------
watch(() => lastToastId.value, (newId) => {
	console.log('lastToastId', newId)
}, { immediate: true })
</script>
