import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('renders FieldFooter border by default and applies _noBorder with no-border prop', async () => {
    const html = await $fetch('/')
    // default: hairline element is rendered
    expect(html).toContain('fieldFooter-border')
    // no-border: the modifier class is applied to the component root
    expect(html).toContain('_noBorder')
  })
})
