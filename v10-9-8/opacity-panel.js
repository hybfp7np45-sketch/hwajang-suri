(() => {
  function initOpacityPanel() {
    const colorBtn = document.getElementById('colorbtn');
    const colorbar = document.getElementById('colorbar');
    const intensity = document.getElementById('intensity');
    const intensityVal = document.getElementById('intensityVal');
    const layers = document.getElementById('layers');
    const stage = document.getElementById('stage');
    if (!colorBtn || !colorbar || !intensity) return;

    const getSelected = () => document.querySelector('.brow.selected');
    const closePanels = () => {
      colorbar.classList.remove('show');
      colorbar.style.display = '';
      if (layers) layers.classList.remove('show');
    };

    function hexToFilter(hex) {
      const h = String(hex || '').replace('#','').trim();
      if (!/^[0-9a-fA-F]{6}$/.test(h)) return '';
      const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let hue = 0;
      if (max !== min) {
        if (max === r) hue = ((g-b)/(max-min))*60;
        else if (max === g) hue = (2+(b-r)/(max-min))*60;
        else hue = (4+(r-g)/(max-min))*60;
      }
      if (hue < 0) hue += 360;
      const light = (max+min)/510;
      const sat = max === min ? 0 : (max-min)/(255-Math.abs(max+min-255));
      return `brightness(0) saturate(100%) invert(${Math.round(light*100)}%) sepia(100%) saturate(${Math.max(100,Math.round(sat*900))}%) hue-rotate(${Math.round(hue-45)}deg) brightness(72%)`;
    }

    function applyColor(brow, color) {
      if (!brow || !color) return;
      brow.dataset.browColor = color;
      brow.querySelectorAll('svg path, svg g, svg polygon, svg rect, svg ellipse, svg circle').forEach(el => {
        if (el.getAttribute('fill') !== 'none') el.style.fill = color;
        if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') el.style.stroke = color;
      });
      brow.querySelectorAll('img').forEach(img => {
        img.style.filter = hexToFilter(color);
      });
    }

    colorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const brow = getSelected();
      if (!brow) return;
      if (layers) layers.classList.remove('show');
      colorbar.classList.add('show');
      colorbar.style.display = 'block';
      const value = Number(brow.dataset.intensity || 100);
      intensity.value = value;
      if (intensityVal) intensityVal.textContent = value + '%';
    }, true);

    colorbar.addEventListener('click', (e) => {
      const brow = getSelected();
      if (!brow) return;
      const swatch = e.target.closest('.swatch');
      if (!swatch || swatch.classList.contains('empty')) return;
      let color = swatch.dataset.color || swatch.getAttribute('data-value') || swatch.style.backgroundColor;
      if (!color) return;
      if (color.startsWith('rgb')) {
        const nums = color.match(/\d+/g);
        if (nums && nums.length >= 3) color = '#' + nums.slice(0,3).map(n => Number(n).toString(16).padStart(2,'0')).join('');
      }
      applyColor(brow, color);
      colorbar.querySelectorAll('.swatch').forEach(s => s.style.outline = '');
      swatch.style.outline = '2px solid #d95d84';
      swatch.style.outlineOffset = '2px';
    });

    colorbar.addEventListener('input', (e) => {
      if (e.target.matches('input[type="color"]')) applyColor(getSelected(), e.target.value);
    });

    const applyColor = (color) => {
      const brow = getSelected();
      if (!brow) return;
      brow.dataset.color = color;
      const img = brow.querySelector('img');
      if (!img) return;
      img.style.backgroundColor = color;
      img.style.mixBlendMode = 'multiply';
      img.style.filter = 'sepia(1) saturate(3)';
    };

    colorbar.querySelectorAll('.swatch[data-c]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyColor(btn.dataset.c);
      });
    });
    const picker = document.getElementById('colorpicker');
    if (picker) picker.addEventListener('input', (e) => applyColor(e.target.value));

    intensity.addEventListener('input', (e) => {
      const brow = getSelected();
      if (!brow) return;
      const value = Number(e.target.value);
      brow.dataset.intensity = String(value);
      const img = brow.querySelector('img');
      if (img) img.style.opacity = String(value / 100);
      else brow.style.opacity = String(value / 100);
      if (intensityVal) intensityVal.textContent = value + '%';
    });

    if (stage) {
      stage.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.brow')) return;
        closePanels();
      }, true);
    }

    document.addEventListener('pointerdown', (e) => {
      if (colorbar.contains(e.target) || colorBtn.contains(e.target)) return;
      if (e.target.closest('nav') || e.target.closest('.sheet') || e.target.closest('.design-card') || e.target.closest('.card')) closePanels();
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initOpacityPanel);
  else initOpacityPanel();
})();