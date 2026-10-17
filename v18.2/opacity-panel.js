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