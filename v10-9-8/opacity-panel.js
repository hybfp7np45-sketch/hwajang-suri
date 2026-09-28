(() => {
  function initOpacityPanel() {
    const colorBtn = document.getElementById('colorbtn');
    const colorbar = document.getElementById('colorbar');
    const intensity = document.getElementById('intensity');
    const intensityVal = document.getElementById('intensityVal');
    if (!colorBtn || !colorbar || !intensity) return;

    const getSelected = () => document.querySelector('.brow.selected');

    colorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const brow = getSelected();
      if (!brow) return;
      colorbar.classList.add('show');
      const value = Math.round((parseFloat(brow.style.opacity || '1')) * 100);
      intensity.value = value;
      if (intensityVal) intensityVal.textContent = value + '%';
    }, true);

    intensity.addEventListener('input', (e) => {
      const brow = getSelected();
      if (!brow) return;
      const value = Number(e.target.value);
      brow.style.opacity = String(value / 100);
      brow.dataset.intensity = String(value);
      if (intensityVal) intensityVal.textContent = value + '%';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOpacityPanel);
  } else {
    initOpacityPanel();
  }
})();
