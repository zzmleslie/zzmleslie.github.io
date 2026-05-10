/**
 * Apple Music Style — Vanta.js WebGL 动态背景
 * 每页不同效果，模仿 Apple Music UI
 */
(function () {
  // 等待 three.js 和 vanta 加载
  function init () {
    if (typeof VANTA === 'undefined') {
      setTimeout(init, 200)
      return
    }

    const pageType = (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType) || 'home'
    const bgDiv = document.createElement('div')
    bgDiv.id = 'vanta-bg'
    bgDiv.style.cssText = 'position:fixed;inset:0;z-index:-2;pointer-events:none;'
    document.body.insertBefore(bgDiv, document.body.firstChild)

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || true

    // ============ 每页不同配置 ============
    const configs = {
      // 首页 — 青蓝粉流体波浪 (Apple Music 主风格)
      home: {
        effect: 'WAVES',
        color: 0x267780,
        shininess: 45,
        waveHeight: 18,
        waveSpeed: 0.7,
        zoom: 0.85
      },
      // Notes — 霓虹紫波 (Lo-Fi 私密)
      notes: {
        effect: 'WAVES',
        color: 0x5B1A50,
        shininess: 35,
        waveHeight: 15,
        waveSpeed: 0.55,
        zoom: 0.9
      },
      // Gallery — 暖金流体 (艺术画廊)
      gallery: {
        effect: 'WAVES',
        color: 0x6B4E3D,
        shininess: 40,
        waveHeight: 20,
        waveSpeed: 0.6,
        zoom: 0.8
      },
      // Library — 青蓝几何网络 (知识结构)
      library: {
        effect: 'NET',
        color: 0x3A8891,
        backgroundColor: 0x0a0a0f,
        points: 10,
        maxDistance: 20,
        spacing: 16,
        showDots: true
      },
      // Projects — 蓝图网络 (实验室)
      projects: {
        effect: 'NET',
        color: 0x4A8891,
        backgroundColor: 0x0a0a0f,
        points: 12,
        maxDistance: 18,
        spacing: 15,
        showDots: true
      },
      // Archives — 时间网络 (归档)
      archives: {
        effect: 'NET',
        color: 0x5A7080,
        backgroundColor: 0x0a0a0f,
        points: 8,
        maxDistance: 22,
        spacing: 20,
        showDots: false
      },
      // 文章页 — 柔和波浪
      post: {
        effect: 'WAVES',
        color: 0x1A3A40,
        shininess: 25,
        waveHeight: 10,
        waveSpeed: 0.4,
        zoom: 1.0
      }
    }

    const cfg = configs[pageType] || configs.home

    if (cfg.effect === 'WAVES') {
      VANTA.WAVES({
        el: bgDiv,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: cfg.color,
        shininess: cfg.shininess || 40,
        waveHeight: cfg.waveHeight || 18,
        waveSpeed: cfg.waveSpeed || 0.7,
        zoom: cfg.zoom || 0.85
      })
    } else if (cfg.effect === 'NET') {
      VANTA.NET({
        el: bgDiv,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: cfg.color,
        backgroundColor: cfg.backgroundColor || 0x0a0a0f,
        points: cfg.points || 10,
        maxDistance: cfg.maxDistance || 20,
        spacing: cfg.spacing || 16,
        showDots: cfg.showDots !== false
      })
    }
  }

  init()
})()
