/**
 * Apple Music Style — Vanta.js WebGL 动态背景
 * 每页不同效果，模仿 Apple Music / visionOS / WWDC
 */
(function () {
  function init () {
    if (typeof VANTA === 'undefined') { setTimeout(init, 200); return }

    const pageType = (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType) || 'home'
    const bgDiv = document.createElement('div')
    bgDiv.id = 'vanta-bg'
    bgDiv.style.cssText = 'position:fixed;inset:0;z-index:-2;pointer-events:none;'
    document.body.insertBefore(bgDiv, document.body.firstChild)

    const base = { el: bgDiv, mouseControls: true, touchControls: true, gyroControls: false }

    // ============ 每页不同效果 ============
    const configs = {
      // 🏠 首页 — 🌊 青蓝流体波浪
      home: () => VANTA.WAVES({ ...base,
        color: 0x267780, shininess: 45, waveHeight: 18, waveSpeed: 0.7, zoom: 0.85 }),

      // 💬 Notes — 🌫️ 迷雾梦境 (Sleep Meditation 云海)
      notes: () => VANTA.FOG({ ...base,
        highlightColor: 0xB83B8D, midtoneColor: 0x4A2060,
        lowlightColor: 0x1A1028, baseColor: 0x0A0A0F,
        blurFactor: 0.55, speed: 0.8, zoom: 0.9 }),

      // 🎨 Gallery — 🕊️ 飞鸟粒子 (艺术流动)
      gallery: () => VANTA.BIRDS({ ...base,
        backgroundColor: 0x0A0A0F, color1: 0xD2C3B8, color2: 0xB83B8D,
        colorMode: 'variance', birdSize: 1.2, wingSpan: 20,
        speedLimit: 4, separation: 30, alignment: 30, cohesion: 25, quantity: 3 }),

      // 📚 Library — 🕸️ 几何网络 (visionOS)
      library: () => VANTA.NET({ ...base,
        color: 0x3A8891, backgroundColor: 0x0A0A0F,
        points: 10, maxDistance: 20, spacing: 16, showDots: true }),

      // 🔬 Projects — 🌐 3D 科技球体
      projects: () => VANTA.GLOBE({ ...base,
        color: 0x4A8891, color2: 0xB83B8D, backgroundColor: 0x0A0A0F,
        size: 1.2, points: 12, maxDistance: 28, spacing: 18 }),

      // 📦 Archives — 🕸️ 时间刻线网络
      archives: () => VANTA.NET({ ...base,
        color: 0x5A7080, backgroundColor: 0x0A0A0F,
        points: 8, maxDistance: 22, spacing: 20, showDots: false }),

      // 📝 文章页 — 🌊 柔和深蓝波
      post: () => VANTA.WAVES({ ...base,
        color: 0x1A3A40, shininess: 25, waveHeight: 10, waveSpeed: 0.4, zoom: 1.0 })
    }

    const fn = configs[pageType] || configs.home
    fn()
  }

  init()
})()
