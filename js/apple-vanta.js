/**
 * Serene Theme — Vanta.js WebGL dynamic backgrounds
 * Per-page effects, adapted from Butterfly version.
 */
(function () {
  function init () {
    if (typeof VANTA === 'undefined') { setTimeout(init, 200); return }

    var path = window.location.pathname
    var pageType = document.body.dataset.pageType || ''
    var pageKey = 'home'

    if (path.startsWith('/home'))            pageKey = 'home'
    else if (path.startsWith('/notes'))      pageKey = 'notes'
    else if (path.startsWith('/projects'))   pageKey = 'projects'
    else if (path.startsWith('/archives'))   pageKey = 'archives'
    else if (pageType === 'post')            pageKey = 'post'
    else if (pageType === 'archive')         pageKey = 'archives'

    var bgDiv = document.createElement('div')
    bgDiv.id = 'vanta-bg'
    bgDiv.style.cssText = 'position:fixed;inset:0;z-index:-2;pointer-events:none;'
    document.body.insertBefore(bgDiv, document.body.firstChild)

    var base = { el: bgDiv, mouseControls: true, touchControls: true, gyroControls: false }

    var configs = {
      home: function () { return VANTA.WAVES(Object.assign({}, base, {
        color: 0x267780, shininess: 45, waveHeight: 18, waveSpeed: 0.7, zoom: 0.85 })); },

      notes: function () { return VANTA.FOG(Object.assign({}, base, {
        highlightColor: 0xB83B8D, midtoneColor: 0x4A2060,
        lowlightColor: 0x1A1028, baseColor: 0x0A0A0F,
        blurFactor: 0.55, speed: 0.8, zoom: 0.9 })); },

      projects: function () { return VANTA.HALO(Object.assign({}, base, {
        baseColor: 0x0A0A0F, backgroundColor: 0x0A0A0F,
        amplitudeFactor: 2.0, xOffset: 0.2, yOffset: 0.2, size: 1.5 })); },

      archives: function () { return VANTA.FOG(Object.assign({}, base, {
        highlightColor: 0x908070, midtoneColor: 0x3A3030,
        lowlightColor: 0x1A1510, baseColor: 0x0A0A0F,
        blurFactor: 0.6, speed: 0.4, zoom: 0.85 })); },

      post: function () { return VANTA.WAVES(Object.assign({}, base, {
        color: 0x1A3A40, shininess: 25, waveHeight: 10, waveSpeed: 0.4, zoom: 1.0 })); }
    }

    var fn = configs[pageKey] || configs.home
    fn()
  }

  init()
})();
