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

  it('does not render ControlLabel when Switch/Checkbox have no label, description, or slot', async () => {
    const html = await $fetch('/')
    // 対象の行（<div class="row ... switch|checkbox">…</div>）だけを、次の行が始まる直前まで切り出す
    const extractRow = (marker: string): string => {
      const start = html.indexOf(marker)
      const nextRowStart = html.indexOf('<div class="row', start + marker.length)
      return html.slice(start, nextRowStart === -1 ? html.length : nextRowStart)
    }

    // label が無いときは ControlLabel（controlLabel クラス）を出力しない
    expect(extractRow('name="switch-no-label"')).not.toContain('controlLabel')
    expect(extractRow('name="checkbox-no-label"')).not.toContain('controlLabel')
  })

  it('still renders ControlLabel when Switch/Checkbox have a label', async () => {
    const html = await $fetch('/')
    // label があるときは、これまでどおり ControlLabel と文言が出力される
    expect(html).toContain('switch label')
    expect(html).toContain('checkbox label')
  })
})
