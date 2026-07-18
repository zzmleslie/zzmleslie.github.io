/**
 * Serene Theme — Scroll-driven header blur
 * Adapted from Butterfly version for new theme DOM.
 */
(function () {
  var header = document.querySelector('.site-header')
  if (!header) return

  var headerBg = header.style.backgroundImage || getComputedStyle(header).backgroundImage
  if (!headerBg || headerBg === 'none' || headerBg === '') return

  var headerHeight = header.offsetHeight
  header.style.position = 'relative'

  // 1. Blur overlay
  var blurLayer = document.createElement('div')
  blurLayer.className = 'apple-blur-layer'
  Object.assign(blurLayer.style, {
    position: 'absolute', top: '0', left: '0',
    width: '100%', height: '100%',
    backgroundImage: headerBg,
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    filter: 'blur(0px)',
    zIndex: '0', pointerEvents: 'none', willChange: 'filter'
  })
  header.insertBefore(blurLayer, header.firstChild)

  // 2. Bottom fade overlay
  var fadeOverlay = document.createElement('div')
  fadeOverlay.className = 'apple-fade-overlay'
  Object.assign(fadeOverlay.style, {
    position: 'absolute', bottom: '0', left: '0',
    width: '100%', height: '40%',
    background: 'linear-gradient(to bottom, transparent, var(--apple-body-bg, #0a0a0f))',
    zIndex: '0', pointerEvents: 'none', opacity: '0', willChange: 'opacity'
  })
  header.appendChild(fadeOverlay)

  // 3. Particle/glow overlay
  var particleOverlay = document.createElement('div')
  particleOverlay.className = 'apple-particle-overlay'
  Object.assign(particleOverlay.style, {
    position: 'absolute', top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '0', pointerEvents: 'none', opacity: '0.6',
    background: 'radial-gradient(ellipse at 30% 20%, rgba(100,206,220,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(184,59,141,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(210,195,184,0.08) 0%, transparent 40%)'
  })
  header.appendChild(particleOverlay)

  // Ensure nav sits above overlays
  var navEl = header.querySelector('.site-nav')
  if (navEl) { navEl.style.position = 'relative'; navEl.style.zIndex = '2' }

  function update () {
    var scrollY = window.scrollY
    var progress = Math.min(scrollY / (headerHeight * 0.6), 1)
    var eased = 1 - (1 - progress) * (1 - progress)

    blurLayer.style.filter = 'blur(' + (eased * 30) + 'px)'
    fadeOverlay.style.opacity = eased
    particleOverlay.style.opacity = 0.6 * (1 - eased * 0.7)
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
})();
