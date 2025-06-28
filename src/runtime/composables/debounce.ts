import { debounce } from 'ts-debounce'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
	return debounce(fn, ms, { maxWait: ms })
}
