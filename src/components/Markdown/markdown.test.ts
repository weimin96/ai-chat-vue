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

  it('为安全链接补充新窗口隔离属性', () => {
    const html = renderMarkdown('[链接](https://example.com)')

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('支持 GFM 表格和任务列表', () => {
    const html = renderMarkdown('| 名称 | 状态 |\n| --- | --- |\n| 文档 | 完成 |\n\n- [x] 已处理')

    expect(html).toContain('<table>')
    expect(html).toContain('<input')
    expect(html).toContain('checked')
  })

  it('允许受控 HTML 时仍会移除危险属性', () => {
    const html = renderMarkdown('<span onclick="alert(1)">内容</span>', { allowHtml: true })

    expect(html).toContain('<span>内容</span>')
    expect(html).not.toContain('onclick')
  })
})
