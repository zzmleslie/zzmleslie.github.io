/**
 * Serene Theme — Sidebar accordion + enhancements
 * Adapted from Butterfly version for new theme DOM.
 */
(function () {
  // Add page-type class to body and site-wrap
  try {
    var pt = document.body.dataset.pageType
    if (pt) {
      var cls = 'type-' + (pt === 'archive' ? 'archives' : pt)
      var wrap = document.getElementById('site-wrap')
      if (wrap) wrap.classList.add(cls)
      document.body.classList.add(cls)
    }
  } catch (e) {}

  var aside = document.querySelector('.site-sidebar')
  if (!aside) return

  // 1. Collapsible sidebar cards
  var collapsibleCards = [
    '.sidebar-recent',
    '.sidebar-archives',
    '.sidebar-tags',
    '.sidebar-info'
  ]

  collapsibleCards.forEach(function (selector) {
    var card = aside.querySelector(selector)
    if (!card) return

    var headline = card.querySelector('.sidebar-card-header')
    if (!headline) return

    headline.style.cursor = 'pointer'
    headline.style.userSelect = 'none'
    headline.classList.add('accordion-headline')

    var content = document.createElement('div')
    content.className = 'accordion-content'
    while (headline.nextSibling) {
      content.appendChild(headline.nextSibling)
    }
    card.appendChild(content)

    var cardType = selector.replace('.sidebar-', '')
    var savedState = localStorage.getItem('aside-collapse-' + cardType)
    var defaultOpen = (cardType === 'recent' || cardType === 'tags')
    var isOpen = savedState !== null ? savedState === 'open' : defaultOpen

    if (!isOpen) {
      content.classList.add('collapsed')
      headline.classList.add('collapsed')
    }

    headline.addEventListener('click', function () {
      var collapsed = content.classList.toggle('collapsed')
      headline.classList.toggle('collapsed', collapsed)
      localStorage.setItem('aside-collapse-' + cardType, collapsed ? 'closed' : 'open')
    })
  })

  // 2. Tag glow colors
  var tagLinks = aside.querySelectorAll('.tagcloud .tag-item')
  var accentColors = [
    'rgba(100,206,220,0.3)',
    'rgba(184,59,141,0.25)',
    'rgba(210,195,184,0.25)',
    'rgba(120,180,220,0.25)',
    'rgba(200,140,180,0.25)'
  ]
  tagLinks.forEach(function (tag, i) {
    tag.style.setProperty('--tag-glow', accentColors[i % accentColors.length])
  })

  // 3. Archives item enhancement
  var archiveItems = aside.querySelectorAll('.archive-list-item')
  archiveItems.forEach(function (item) {
    item.classList.add('archive-item-enhanced')
  })

  // 4. Replace site-data with a quote
  var siteData = aside.querySelector('.site-data')
  if (siteData) {
    var quote = document.createElement('div')
    quote.className = 'site-quote'
    quote.innerHTML = '<p>" 有好些年，<br>我一直想要遵照所有人的道德标准来生活，<br>我强迫自己去过和所有人一样的日子，<br>强迫自己和所有人相似。<br>如今，<br>我在碎片中游荡，<br>没有任何法则，<br>四分五裂，<br>于是不再抗拒我的独特和残缺，<br>而且我也该去重建一个真相——<br>在某种谎言中过了一辈子之后。 "</p><span class="quote-author">—— 阿尔贝·加缪</span>'
    siteData.replaceWith(quote)
  }

  // 5. Recent post thumbnail hover zoom
  var recentThumbs = aside.querySelectorAll('.recent-post-thumb')
  recentThumbs.forEach(function (img) {
    img.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)'
    img.addEventListener('mouseenter', function () { img.style.transform = 'scale(1.08)' })
    img.addEventListener('mouseleave', function () { img.style.transform = 'scale(1)' })
  })
})();
