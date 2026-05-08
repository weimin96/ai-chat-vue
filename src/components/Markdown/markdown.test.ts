import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('默认转义原始 HTML', () => {
    const html = renderMarkdown('<img src=x onerror=alert(1)>')

    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })

  it('净化不安全链接协议', () => {
    const html = renderMarkdown('[链接](javascript:alert(1))')

    expect(html).not.toContain('javascript:')
    expect(html).toContain('链接')
  })

  it('允许受控 HTML 时仍会移除危险属性', () => {
    const html = renderMarkdown('<span onclick="alert(1)">内容</span>', { allowHtml: true })

    expect(html).toContain('<span>内容</span>')
    expect(html).not.toContain('onclick')
  })
})
