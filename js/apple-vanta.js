/**
 * Apple Music Style — Vanta.js WebGL 动态背景
 * 每页不同效果，模仿 Apple Music / visionOS / WWDC
 */
(function () {
  function init () {
    if (typeof VANTA === 'undefined') { setTimeout(init, 200); return }

    // 用 URL 路径判断当前页面（pageType 对自定义页全是 'page'）
    const path = window.location.pathname
    const pgType = GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType
    let pageKey = 'home'

    if (path.startsWith('/home')) pageKey = 'home'
    else if (path.startsWith('/notes')) pageKey = 'notes'
    else if (path.startsWith('/gallery')) pageKey = 'gallery'
    else if (path.startsWith('/library')) pageKey = 'library'
    else if (path.startsWith('/projects')) pageKey = 'projects'
    else if (path.startsWith('/archives')) pageKey = 'archives'
    else if (pgType === 'post') pageKey = 'post'
    else if (pgType === 'archive') pageKey = 'archives'

    const bgDiv = document.createElement('div')
    bgDiv.id = 'vanta-bg'
    bgDiv.style.cssText = 'position:fixed;inset:0;z-index:-2;pointer-events:none;'
    document.body.insertBefore(bgDiv, document.body.firstChild)

    const base = { el: bgDiv, mouseControls: true, touchControls: true, gyroControls: false }

    // ============ 每页不同效果 ============
    const configs = {
      home: () => VANTA.WAVES({ ...base,
        color: 0x267780, shininess: 45, waveHeight: 18, waveSpeed: 0.7, zoom: 0.85 }),

      notes: () => VANTA.FOG({ ...base,
        highlightColor: 0xB83B8D, midtoneColor: 0x4A2060,
        lowlightColor: 0x1A1028, baseColor: 0x0A0A0F,
        blurFactor: 0.55, speed: 0.8, zoom: 0.9 }),

      gallery: () => VANTA.BIRDS({ ...base,
        backgroundColor: 0x0A0A0F, color1: 0xD2C3B8, color2: 0xB83B8D,
        colorMode: 'variance', birdSize: 1.2, wingSpan: 20,
        speedLimit: 4, separation: 30, alignment: 30, cohesion: 25, quantity: 3 }),

      library: () => VANTA.NET({ ...base,
        color: 0x3A8891, backgroundColor: 0x0A0A0F,
        points: 10, maxDistance: 20, spacing: 16, showDots: true }),

      projects: () => VANTA.HALO({ ...base,
        baseColor: 0x0A0A0F, backgroundColor: 0x0A0A0F,
        amplitudeFactor: 2.0, xOffset: 0.2, yOffset: 0.2, size: 1.5 }),

      archives: () => VANTA.FOG({ ...base,
        highlightColor: 0x908070, midtoneColor: 0x3A3030,
        lowlightColor: 0x1A1510, baseColor: 0x0A0A0F,
        blurFactor: 0.6, speed: 0.4, zoom: 0.85 }),

      post: () => VANTA.WAVES({ ...base,
        color: 0x1A3A40, shininess: 25, waveHeight: 10, waveSpeed: 0.4, zoom: 1.0 })
    }

    const fn = configs[pageKey] || configs.home
    fn()
  }

  init()
})()
