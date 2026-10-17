// 自动注入网站图标（Favicon）
(function () {
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = '/shared/favicon.png';
  document.head.appendChild(link);
})();

// 色觉模式 + 顶部栏
(function () {
  var THEMES = {
    normal:        { name: '普通',   ray1: '#e74c3c', ray2: '#27ae60', ray3: '#f39c12', normal: '#7f8c8d', obj: '#e74c3c', img: '#2980b9', lens: '#3498db', mirror: '#34495e' },
    protanopia:    { name: '红色盲', ray1: '#3498db', ray2: '#f1c40f', ray3: '#9b59b6', normal: '#7f8c8d', obj: '#2980b9', img: '#8e44ad', lens: '#34495e', mirror: '#2c3e50' },
    deuteranopia:  { name: '绿色盲', ray1: '#2980b9', ray2: '#f39c12', ray3: '#8e44ad', normal: '#7f8c8d', obj: '#2980b9', img: '#8e44ad', lens: '#34495e', mirror: '#2c3e50' },
    tritanopia:    { name: '蓝色盲', ray1: '#e74c3c', ray2: '#16a085', ray3: '#e91e63', normal: '#7f8c8d', obj: '#c0392b', img: '#e91e63', lens: '#2c3e50', mirror: '#2c3e50' },
    achromatopsia: { name: '全色盲', ray1: '#000000', ray2: '#777777', ray3: '#999999', normal: '#aaaaaa', obj: '#222222', img: '#666666', lens: '#444444', mirror: '#111111' }
  };

  var ZH = {
    'common.home': '← 返回主页',
    'common.play': '▶ 播放',
    'common.pause': '⏸ 暂停',
    'common.reset': '↺ 重置',
    'common.panel': '控制面板',
    'common.speed': '速度',
    'common.direction': '方向',
    'common.playMode': '播放模式',
    'common.cm': 'cm'
  };

  function getThemeName() { return localStorage.getItem('colorTheme') || 'normal'; }
  function getTheme() { return THEMES[getThemeName()] || THEMES.normal; }
  function setThemeName(name) {
    localStorage.setItem('colorTheme', name);
    window.dispatchEvent(new Event('themechange'));
  }
  function t(key) { return ZH[key] || key; }

  function injectTopbar() {
    if (document.getElementById('labTopbar')) return;
    var box = document.createElement('div');
    box.id = 'labTopbar';
    box.className = 'lab-topbar';
    var themeOpts = Object.keys(THEMES).map(function (k) {
      return '<option value="' + k + '"' + (k === getThemeName() ? ' selected' : '') + '>' + THEMES[k].name + '</option>';
    }).join('');
    box.innerHTML = '<label>👁 <select id="labThemeSel">' + themeOpts + '</select></label>';
    document.body.appendChild(box);
    box.querySelector('#labThemeSel').addEventListener('change', function (e) {
      setThemeName(e.target.value);
    });
  }

  window.App = {
    t: t,
    getTheme: getTheme,
    getThemeName: getThemeName,
    setTheme: setThemeName,
    injectTopbar: injectTopbar,
    applyLang: function () { /* 保留兼容，什么都不做 */ }
  };
})();