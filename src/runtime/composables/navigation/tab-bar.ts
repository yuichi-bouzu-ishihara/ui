import { readonly, useState } from '#imports'

export const useTabBar = () => {
	// State -----------------------------------------------
	const height = useState('tabBarHeight', () => 0)

	// Return -----------------------------------------------
	return {
		height: readonly(height),
		setHeight: (value: number) => {
			height.value = value
		},
	}
}
