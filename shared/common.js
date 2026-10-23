// 1. 自动注入网站图标（Favicon）
(function () {
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = '/shared/favicon.png';
  document.head.appendChild(link);
})();

// 2. 色觉模式 + 顶部栏（无障碍增强版）
(function () {
  var THEMES = {
    normal:        { name: '普通',   ray1: '#e74c3c', ray2: '#27ae60', ray3: '#f39c12', normal: '#7f8c8d', obj: '#e74c3c', img: '#2980b9', lens: '#3498db', mirror: '#34495e' },
    protanopia:    { name: '红色盲', ray1: '#3498db', ray2: '#f1c40f', ray3: '#9b59b6', normal: '#7f8c8d', obj: '#2980b9', img: '#8e44ad', lens: '#34495e', mirror: '#2c3e50' },
    deuteranopia:  { name: '绿色盲', ray1: '#2980b9', ray2: '#f39c12', ray3: '#8e44ad', normal: '#7f8c8d', obj: '#2980b9', img: '#8e44ad', lens: '#34495e', mirror: '#2c3e50' },
    tritanopia:    { name: '蓝色盲', ray1: '#e74c3c', ray2: '#16a085', ray3: '#e91e63', normal: '#7f8c8d', obj: '#c0392b', img: '#e91e63', lens: '#2c3e50', mirror: '#2c3e50' },
    achromatopsia: { name: '全色盲', ray1: '#000000', ray2: '#777777', ray3: '#999999', normal: '#aaaaaa', obj: '#222222', img: '#666666', lens: '#444444', mirror: '#111111' }
  };

  function getThemeName() { return localStorage.getItem('colorTheme') || 'normal'; }
  function getTheme() { return THEMES[getThemeName()] || THEMES.normal; }
  function setThemeName(name) {
    localStorage.setItem('colorTheme', name);
    window.dispatchEvent(new Event('themechange'));
  }

  function injectTopbar() {
    if (document.getElementById('labTopbar')) return;
    var box = document.createElement('div');
    box.id = 'labTopbar';
    box.className = 'lab-topbar';
    
    // 加上了 aria-label 供读屏器识别
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', '无障碍与视觉设置');
    
    var themeOpts = Object.keys(THEMES).map(function (k) {
      return '<option value="' + k + '"' + (k === getThemeName() ? ' selected' : '') + '>' + THEMES[k].name + '</option>';
    }).join('');
    
    // 替换文字：👁 普通 -> 👁️ 视光无障碍
    box.innerHTML = '<label for="labThemeSel">👁️ 视光无障碍 </label><select id="labThemeSel" aria-label="选择视觉色彩模式">' + themeOpts + '</select>';
    document.body.appendChild(box);
    box.querySelector('#labThemeSel').addEventListener('change', function (e) {
      setThemeName(e.target.value);
    });
  }

  window.App = {
    getTheme: getTheme,
    getThemeName: getThemeName,
    setTheme: setThemeName,
    injectTopbar: injectTopbar
  };
})();

// 3. 自动注入"回到顶部"按钮（无障碍增强版）
(function () {
  if (document.getElementById('backToTopBtn')) return;

  var btn = document.createElement('button');
  btn.id = 'backToTopBtn';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', '回到页面顶部');
  btn.style.cssText = `
    position: fixed; bottom: 30px; right: 30px;
    width: 44px; height: 44px; border-radius: 50%;
    background: #3498db; color: #fff; font-size: 22px;
    display: flex; justify-content: center; align-items: center;
    cursor: pointer; box-shadow: 0 4px 12px rgba(52,152,219,0.3);
    opacity: 0; pointer-events: none; transition: 0.3s; z-index: 999;
    border: none;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 200) {
      btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
    }
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();