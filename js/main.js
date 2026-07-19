/* ==========================================================================
   Codex Theme · main.js
   3D 立方体导航 + 构建时数据渲染（__POSTS__ / __NOTES__ / __PROJECTS__）
   ========================================================================== */
(function () {
  'use strict';

  var cube = document.getElementById('cube');
  var scene = document.getElementById('scene');
  var prog = document.getElementById('prog');
  var kbHint = document.getElementById('kbHint');
  var faces = {
    center: document.getElementById('face-center'),
    top: document.getElementById('face-top'),
    bottom: document.getElementById('face-bottom'),
    left: document.getElementById('face-left'),
    right: document.getElementById('face-right')
  };

  var currentFace = 'center';
  var isTransitioning = false;

  /* ============ 3D 导航 ============ */

  function setActiveFace(target) {
    Object.keys(faces).forEach(function (k) {
      if (faces[k]) faces[k].classList.toggle('active', k === target);
    });
  }

  function navigateTo(target) {
    if (isTransitioning || target === currentFace) return;
    if (!faces[target]) return;
    isTransitioning = true;
    // 退出 settled：先无动画地恢复 3D 布局（当前面净变换不变，无视觉跳变），再翻转
    cube.classList.add('no-anim');
    cube.classList.remove('settled');
    void cube.offsetWidth;
    cube.classList.remove('no-anim');
    currentFace = target;
    cube.setAttribute('data-face', target);
    updateArrows(target);
    document.querySelectorAll('.face-dot').forEach(function (d) {
      d.classList.toggle('active', d.dataset.target === target);
    });
    document.querySelectorAll('.compass .cp-dot').forEach(function (d) {
      d.classList.remove('active');
    });
    var cd = document.getElementById('cd-' + target);
    if (cd) cd.classList.add('active');
    faces[target].scrollTop = 0;
    updateProgress();
    if (kbHint) kbHint.style.opacity = '0';
    try { localStorage.setItem('blog-flip-face', target); } catch (_) {}
    setTimeout(function () {
      // 翻转完成，进入 settled：目标面变成普通 2D 滚动容器
      setActiveFace(target);
      cube.classList.add('settled');
      isTransitioning = false;
      updateProgress();
    }, 900);
  }

  // 从对侧页面点箭头先回中心，再点才翻到对侧
  var OPPOSITES = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  function navigateDirection(dir) {
    if (isTransitioning) return;
    if (currentFace === OPPOSITES[dir]) {
      navigateTo('center');
    } else {
      navigateTo(dir);
    }
  }

  function updateArrows(face) {
    document.querySelectorAll('.dir-arrow').forEach(function (a) {
      a.classList.toggle('visible', a.dataset.dir !== face);
    });
  }

  function updateProgress() {
    var el = faces[currentFace];
    if (!el) return;
    var h = el.scrollHeight - el.clientHeight;
    prog.style.width = h > 0 ? ((el.scrollTop / h) * 100) + '%' : '0%';
  }

  Object.keys(faces).forEach(function (k) {
    var f = faces[k];
    if (!f) return;
    f.addEventListener('scroll', function () {
      if (faces[currentFace] === this) updateProgress();
    }, { passive: true });
  });

  /* ============ Keyboard ============ */
  document.addEventListener('keydown', function (e) {
    if (isTransitioning) return;
    var map = { ArrowUp: 'top', ArrowDown: 'bottom', ArrowLeft: 'left', ArrowRight: 'right' };
    if (e.key === 'Escape') { e.preventDefault(); navigateTo('center'); return; }
    var target = map[e.key];
    if (target) { e.preventDefault(); navigateDirection(target); }
  });

  /* ============ Touch ============ */
  var tsX = 0, tsY = 0;
  scene.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) { tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; }
  }, { passive: true });
  scene.addEventListener('touchend', function (e) {
    if (isTransitioning) return;
    var t = e.changedTouches[0];
    var dx = (t ? t.clientX : 0) - tsX;
    var dy = (t ? t.clientY : 0) - tsY;
    if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return;
    // 面内还能滚动时，纵向 swipe 不触发翻面
    var af = faces[currentFace];
    if (af && Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0 && af.scrollTop > 10) return;
      if (dy < 0 && af.scrollTop + af.clientHeight < af.scrollHeight - 10) return;
    }
    navigateDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'left' : 'right') : (dy > 0 ? 'top' : 'bottom'));
  });

  /* ============ Wheel ============ */
  scene.addEventListener('wheel', function (e) {
    var af = faces[currentFace];
    if (!af) return;
    var canDown = af.scrollTop + af.clientHeight < af.scrollHeight - 1;
    var canUp = af.scrollTop > 1;
    if (!e.shiftKey && ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp))) return;
    if (isTransitioning) return;
    if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      navigateDirection(e.shiftKey ? (e.deltaY > 0 ? 'bottom' : 'top') : (e.deltaX > 0 ? 'right' : 'left'));
    } else if (!canDown && e.deltaY > 30) { e.preventDefault(); navigateDirection('bottom'); }
    else if (!canUp && e.deltaY < -30) { e.preventDefault(); navigateDirection('top'); }
  }, { passive: false });

  /* ============ 工具函数 ============ */

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function cnDate(iso) {
    // "2026-05-24" → "2026年5月24日"
    if (!iso) return '';
    var p = iso.split('-');
    if (p.length < 3) return iso;
    return p[0] + '年' + parseInt(p[1], 10) + '月' + parseInt(p[2], 10) + '日';
  }

  function postCategory(p) {
    // categories 为空时兜底归入 Life
    var cats = p.categories || [];
    return cats.length ? cats : ['Life'];
  }

  function postsByCategory(category) {
    var all = window.__POSTS__ || [];
    return all.filter(function (p) {
      return postCategory(p).indexOf(category) !== -1;
    });
  }

  /* ============ Tech / Life 文章列表 ============ */

  function renderPostList(containerId, category) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var posts = postsByCategory(category);
    if (!posts.length) {
      el.innerHTML = '<div class="post-loading">暂无文章。<br><span style="font-size:12px">为文章 frontmatter 添加 categories: ' + category + ' 后重新 hexo generate。</span></div>';
      return;
    }
    var html = '';
    posts.forEach(function (p) {
      var tags = (p.tags || []).slice(0, 3).map(escapeHtml).join(' · ');
      html += '<a class="post-item" href="/' + encodeURI(p.path || '') + '">' +
        '<span class="p-date">' + cnDate(p.date) + '</span>' +
        '<h4>' + escapeHtml(p.title) + '</h4>' +
        (p.excerpt ? '<p class="p-excerpt">' + escapeHtml(p.excerpt) + '</p>' : '') +
        (tags ? '<span class="p-meta">' + tags + '</span>' : '') +
        '</a>';
    });
    el.innerHTML = html;
  }

  /* ============ 时间线侧边栏（按月分组） ============ */

  function monthLabel(ym) {
    var parts = ym.split('-');
    if (parts.length !== 2) return ym;
    return parts[0] + '年' + parseInt(parts[1], 10) + '月';
  }

  function renderTimeline(containerId, posts) {
    var tl = document.getElementById(containerId);
    if (!tl) return;
    if (!posts || !posts.length) {
      tl.innerHTML = '<div class="tl-empty">暂无归档</div>';
      return;
    }
    var groups = {};
    posts.forEach(function (p) {
      var ym = (p.date || '').substring(0, 7);
      if (!groups[ym]) groups[ym] = [];
      groups[ym].push(p);
    });
    var months = Object.keys(groups).sort().reverse();
    var html = '';
    months.forEach(function (ym) {
      html += '<div class="tl-month"><div class="tl-month-head">' + monthLabel(ym) + '</div>';
      groups[ym].forEach(function (p) {
        var tags = (p.tags || []).slice(0, 3).map(escapeHtml).join(' · ');
        html += '<a class="tl-post" href="/' + encodeURI(p.path || '') + '">' +
          '<span class="tl-date">' + escapeHtml(p.date || '') + '</span>' +
          '<div class="tl-title">' + escapeHtml(p.title) + '</div>' +
          (tags ? '<span class="tl-tags">' + tags + '</span>' : '') +
          '</a>';
      });
      html += '</div>';
    });
    tl.innerHTML = html;
  }

  /* ============ Notes 记忆卡片 ============ */

  function formatMemoTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso.substring(0, 10);
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    return mon + '月' + day + '日 ' + (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function renderNotes(notes) {
    var grid = document.getElementById('memo-grid');
    if (!grid) return;
    if (!notes || !notes.length) {
      grid.innerHTML = '<div class="memo-loading">暂无记忆卡片。<br><span style="font-size:12px">确保 source/_data/notes.json 存在，然后运行 hexo generate。</span></div>';
      return;
    }
    var sorted = notes.slice().sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
    var html = '';
    sorted.forEach(function (n) {
      var time = formatMemoTime(n.date);
      var author = escapeHtml(n.author || 'zzmLeslie');
      var replyCount = n.reply_count || (n.replies ? n.replies.length : 0);
      var repliesLabel;
      if (replyCount > 0) {
        repliesLabel = '<span class="memo-replies" onclick="toggleReplies(this)">' + replyCount + ' 条回复 ▸</span>';
      } else {
        repliesLabel = '<span class="memo-replies" style="color:var(--paper-faint);cursor:default">0 回复</span>';
      }
      var replyListHtml = '';
      if (n.replies && n.replies.length) {
        replyListHtml = '<div class="memo-reply-list">';
        n.replies.forEach(function (r) {
          var rt = formatMemoTime(r.date);
          replyListHtml += '<div class="memo-reply-item">' +
            '<span class="rauthor">' + escapeHtml(r.author || '') + '</span>' +
            (rt ? '<span class="rtime">' + rt + '</span>' : '') +
            '<span class="rbody">' + escapeHtml(r.body || '') + '</span>' +
            '</div>';
        });
        replyListHtml += '</div>';
      }
      html += '<div class="memo-card">' +
        '<div class="memo-head"><span class="memo-author">' + author + '</span><span class="memo-time">' + time + '</span></div>' +
        '<div class="memo-body">' + escapeHtml(n.body || '') + '</div>' +
        '<div class="memo-foot"><span></span><div class="memo-actions"><span class="memo-more hidden" onclick="toggleMemoBody(this)">展开全文 ▾</span>' + repliesLabel + '</div></div>' +
        replyListHtml +
        '</div>';
    });
    grid.innerHTML = html;
    initMemoCollapse(grid);
  }

  function initMemoCollapse(grid) {
    var MAX_HEIGHT = 220;
    var cards = grid.querySelectorAll('.memo-card');
    cards.forEach(function (card) {
      var body = card.querySelector('.memo-body');
      var more = card.querySelector('.memo-more');
      if (!body || !more) return;
      // 先重置，再测量是否超过最大高度
      body.classList.remove('collapsible');
      card.classList.remove('expanded');
      more.classList.add('hidden');
      more.textContent = '展开全文 ▾';
      if (body.scrollHeight > MAX_HEIGHT + 2) {
        body.classList.add('collapsible');
        more.classList.remove('hidden');
      }
    });
  }

  var NOTES_FALLBACK = [
    { author: 'zzmLeslie', body: '喵的，这java怎么这么难啊，润去写作业了', date: '2026-05-14T13:11:44Z', reply_count: 3, replies: [
      { author: 'zzmLeslie', date: '2026-05-14T14:27:00Z', body: 'woc 一直觉得gpt呆呆的（5.5也还是有点木木的）居然实际还是比gemini强嘛（我错了gpt老师qwq）。还有，吐槽一下这个java作业查了半天的bug。' },
      { author: 'KaihangShen', date: '2026-05-15T09:27:47Z', body: '！？强强！？' },
      { author: 'zzmLeslie', date: '2026-05-16T04:10:25Z', body: '这期拉了' }
    ] },
    { author: 'zzmLeslie', body: '沉浸在自己的情绪里，总想向外表达什么。回过神来，却总是觉得自己说的太多，暴露了太多。然而，然而......', date: '2026-05-28T06:39:32Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: 'Monster Siren Records 这次的 相變臨界 震撼美味！！最喜欢 諾言 这首！！好吃好吃！！', date: '2026-05-28T07:14:48Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: '我好像之前一直把蓝莓的屁股当作蓝莓的头', date: '2026-05-29T05:25:12Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: '好累好累，不会做像素图找素材画了一晚上结果不太理想。感谢gpt image2救了我', date: '2026-05-30T17:17:52Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: '语言是人与人交流最直接的也是最主要的方式，所以不要说"就是问一问嘛"这样的话来掩饰你那说不出口的动机。', date: '2026-05-27T09:44:17Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: '又活了一天', date: '2026-05-22T14:47:25Z', reply_count: 0, replies: [] },
    { author: 'zzmLeslie', body: '感恩！不会剪视频，剪到11:00（蠢蠢的）akn大佬帮我远程修改了一下www感动', date: '2026-05-27T15:21:39Z', reply_count: 0, replies: [] }
  ];

  function loadNotes() {
    // 优先使用构建时嵌入的全局变量（零网络请求，兼容 file://）
    if (window.__NOTES__ && window.__NOTES__.length) {
      renderNotes(window.__NOTES__);
      return;
    }
    fetch('/notes.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(renderNotes)
      .catch(function () { renderNotes(NOTES_FALLBACK); });
  }

  /* ============ Projects 项目卡片 ============ */

  function renderProjects(projects) {
    var grid = document.getElementById('proj-grid');
    if (!grid) return;
    if (!projects || !projects.length) {
      grid.innerHTML = '<div class="proj-empty">Coming soon — 项目整理中。<br>' +
        '<span style="font-size:12px">在 source/projects/ 下添加 .md 文件后重新 hexo generate。</span></div>';
      return;
    }
    var html = '';
    projects.forEach(function (p) {
      var tag = (p.tags && p.tags.length) ? p.tags.join(' · ') : 'Project';
      var href = p.link || ('/' + encodeURI(p.path || ''));
      var external = !!p.link;
      html += '<a class="proj-card" href="' + href + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' +
        '<span class="pc-tag">' + escapeHtml(tag) + '</span>' +
        '<h4>' + escapeHtml(p.title) + '</h4>' +
        (p.excerpt ? '<p>' + escapeHtml(p.excerpt) + '</p>' : '') +
        '<span class="pc-link">View Project →</span>' +
        '</a>';
    });
    grid.innerHTML = html;
  }

  function loadProjects() {
    renderProjects(window.__PROJECTS__ || []);
  }

  /* ============ Posts 加载（Tech / Life 双面） ============ */

  function renderAllPostPanels() {
    renderPostList('tech-list', 'Tech');
    renderPostList('life-list', 'Life');
    renderTimeline('tech-timeline', postsByCategory('Tech'));
    renderTimeline('life-timeline', postsByCategory('Life'));
  }

  function loadPosts() {
    if (window.__POSTS__ && window.__POSTS__.length) {
      renderAllPostPanels();
      return;
    }
    fetch('/posts.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (posts) {
        window.__POSTS__ = posts;
        renderAllPostPanels();
      })
      .catch(function () {
        window.__POSTS__ = [];
        renderAllPostPanels();
      });
  }

  /* ============ 初始化 ============ */

  updateArrows('center');
  setActiveFace('center');
  cube.classList.add('settled');
  setTimeout(function () { if (kbHint) kbHint.style.opacity = '0'; }, 8000);
  loadPosts();
  loadNotes();
  loadProjects();

  // 恢复上次所在面板
  try {
    var saved = localStorage.getItem('blog-flip-face');
    if (saved && faces[saved] && saved !== 'center') {
      setTimeout(function () { navigateTo(saved); }, 500);
    }
  } catch (_) {}

  // 暴露给 onclick
  window.navigateTo = navigateTo;
  window.navigateDirection = navigateDirection;
  window.toggleReplies = function (el) {
    var card = el.closest('.memo-card');
    var list = card ? card.querySelector('.memo-reply-list') : null;
    if (list) {
      var isOpen = list.classList.toggle('open');
      el.textContent = isOpen ? el.textContent.replace('▸', '▾') : el.textContent.replace('▾', '▸');
    }
  };
  window.toggleMemoBody = function (el) {
    var card = el.closest('.memo-card');
    if (!card) return;
    var expanded = card.classList.toggle('expanded');
    el.textContent = expanded ? '收起全文 ▴' : '展开全文 ▾';
  };
})();
