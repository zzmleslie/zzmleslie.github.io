/**
 * Apple Music Style - Scroll-Driven Header Blur
 * 滚动时头部图片渐进模糊 + 无缝渐变过渡
 */
(function () {
  const header = document.getElementById('page-header')
  if (!header) return

  // 获取头部的背景图
  const headerBg =
    header.style.backgroundImage ||
    getComputedStyle(header).backgroundImage
  if (!headerBg || headerBg === 'none' || headerBg === '') return

  const headerHeight = header.offsetHeight
  header.style.position = 'relative'

  // ---------- 1. 模糊覆盖层 ----------
  const blurLayer = document.createElement('div')
  blurLayer.className = 'apple-blur-layer'
  Object.assign(blurLayer.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundImage: headerBg,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(0px)',
    zIndex: '0',
    pointerEvents: 'none',
    willChange: 'filter'
  })
  header.insertBefore(blurLayer, header.firstChild)

  // ---------- 2. 底部渐变消失层 ----------
  const fadeOverlay = document.createElement('div')
  fadeOverlay.className = 'apple-fade-overlay'
  Object.assign(fadeOverlay.style, {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '40%',
    background: 'linear-gradient(to bottom, transparent, var(--apple-body-bg, #0a0a0f))',
    zIndex: '0',
    pointerEvents: 'none',
    opacity: '0',
    willChange: 'opacity'
  })
  header.appendChild(fadeOverlay)

  // ---------- 3. 微粒子光点覆盖 ----------
  const particleOverlay = document.createElement('div')
  particleOverlay.className = 'apple-particle-overlay'
  Object.assign(particleOverlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0',
    pointerEvents: 'none',
    opacity: '0.6',
    background: 'radial-gradient(ellipse at 30% 20%, rgba(100,206,220,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(184,59,141,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(210,195,184,0.08) 0%, transparent 40%)'
  })
  header.appendChild(particleOverlay)

  // ---------- 确保导航/标题在覆盖层上方 ----------
  const navEl = header.querySelector('#nav')
  const infoEl = header.querySelector('#site-info') || header.querySelector('#post-info')
  const scrollDown = header.querySelector('#scroll-down')
  if (navEl) { navEl.style.position = 'relative'; navEl.style.zIndex = '2' }
  if (infoEl) { infoEl.style.position = 'relative'; infoEl.style.zIndex = '2' }
  if (scrollDown) { scrollDown.style.position = 'relative'; scrollDown.style.zIndex = '2' }

  // ---------- 滚动更新 ----------
  function update () {
    const scrollY = window.scrollY
    // 滚过头部高度的60%就完全模糊
    const progress = Math.min(scrollY / (headerHeight * 0.6), 1)

    // easeOutQuad 缓动让模糊更自然
    const eased = 1 - (1 - progress) * (1 - progress)

    blurLayer.style.filter = `blur(${eased * 30}px)`
    fadeOverlay.style.opacity = eased
    particleOverlay.style.opacity = 0.6 * (1 - eased * 0.7)
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
})()
