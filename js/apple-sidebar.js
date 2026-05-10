/**
 * Apple Music Style - Sidebar Accordion + Enhancements
 * 侧边栏折叠手风琴 + 交互增强
 */
(function () {
  const aside = document.getElementById('aside-content')
  if (!aside) return

  // ========================================
  // 1. Archives / Tags / Webinfo 折叠手风琴
  // ========================================
  const collapsibleCards = [
    '.card-recent-post',
    '.card-archives',
    '.card-tags',
    '.card-webinfo'
  ]

  collapsibleCards.forEach(selector => {
    const card = aside.querySelector(selector)
    if (!card) return

    const headline = card.querySelector('.item-headline')
    if (!headline) return

    // 给标题添加折叠指示箭头
    headline.style.cursor = 'pointer'
    headline.style.userSelect = 'none'
    headline.classList.add('accordion-headline')

    // 找到内容区（标题之后的所有兄弟元素包装起来）
    const content = document.createElement('div')
    content.className = 'accordion-content'
    while (headline.nextSibling) {
      content.appendChild(headline.nextSibling)
    }
    card.appendChild(content)

    // 默认折叠 Archives 和 Webinfo
    const cardType = selector.replace('.card-', '')
    const savedState = localStorage.getItem('aside-collapse-' + cardType)
    // 默认展开：recent-post, tags；默认折叠：archives, webinfo
    const defaultOpen = (cardType === 'recent-post' || cardType === 'tags')
    const isOpen = savedState !== null ? savedState === 'open' : defaultOpen

    if (!isOpen) {
      content.classList.add('collapsed')
      headline.classList.add('collapsed')
    }

    // 点击切换
    headline.addEventListener('click', () => {
      const collapsed = content.classList.toggle('collapsed')
      headline.classList.toggle('collapsed', collapsed)
      localStorage.setItem('aside-collapse-' + cardType, collapsed ? 'closed' : 'open')
    })
  })

  // ========================================
  // 2. Tags 交互增强 - 随机微光颜色
  // ========================================
  const tagLinks = aside.querySelectorAll('.card-tag-cloud a')
  const accentColors = [
    'rgba(100,206,220,0.3)',  // cyan
    'rgba(184,59,141,0.25)',   // pink
    'rgba(210,195,184,0.25)',  // warm
    'rgba(120,180,220,0.25)',  // blue
    'rgba(200,140,180,0.25)'   // lavender
  ]
  tagLinks.forEach((tag, i) => {
    tag.style.setProperty('--tag-glow', accentColors[i % accentColors.length])
  })

  // ========================================
  // 3. Archives 条目 hover 高亮指示条
  // ========================================
  const archiveItems = aside.querySelectorAll('.card-archive-list-item')
  archiveItems.forEach(item => {
    item.classList.add('archive-item-enhanced')
  })

  // ========================================
  // 4. 近期文章缩略图悬浮放大
  // ========================================
  const recentThumbs = aside.querySelectorAll('.aside-list-item .thumbnail img')
  recentThumbs.forEach(img => {
    img.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)'
    img.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.08)' })
    img.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)' })
  })
})()
