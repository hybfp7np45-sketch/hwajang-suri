(() => {
  function loadIosPicker(){
    if(document.querySelector('script[data-suri-ios-picker]')) return;
    const s=document.createElement('script');
    s.src='./ios-color-picker.js?cb=picker0929brow7363';
    s.dataset.suriIosPicker='1';
    document.head.appendChild(s);
  }
  function openIosPicker(){
    const open=()=>{const modal=document.getElementById('suriIosPicker');if(modal){modal.classList.add('open');return true}return false};
    if(open()) return;
    loadIosPicker();
    let tries=0;const timer=setInterval(()=>{tries++;if(open()||tries>40)clearInterval(timer)},25);
  }
  function initPanelFlow(){
    const sheet=document.getElementById('sheet'),color=document.getElementById('colorbar'),layers=document.getElementById('layers'),edit=document.getElementById('editbar'),colorBtn=document.getElementById('colorbtn'),layerBtn=document.getElementById('layerbtn'),browTab=document.getElementById('browTab'),design=document.getElementById('designRail'),rail=document.getElementById('rail');
    if(!sheet||!layers||!edit)return;
    if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}
    const hideBrowSheet=()=>{sheet.className='sheet level1';sheet.style.setProperty('height','0','important');if(design)design.style.display='none';if(rail)rail.style.display='none'};
    const pinEditTop=()=>requestAnimationFrame(()=>{const st=document.getElementById('stage');if(!st)return;const r=st.getBoundingClientRect();edit.style.setProperty('position','fixed','important');edit.style.setProperty('top',(r.top+6)+'px','important');edit.style.setProperty('bottom','auto','important');edit.style.setProperty('align-items','center','important')});
    const openBrow=()=>{if(color)color.classList.remove('show');layers.classList.remove('show');sheet.style.removeProperty('height');if(design)design.style.display='flex';if(rail)rail.style.display='none';sheet.className='sheet level2';pinEditTop()};
    const openColor=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}if(!document.querySelector('.brow.selected'))return;hideBrowSheet();layers.classList.remove('show');if(color){color.style.removeProperty('display');color.classList.add('show')}pinEditTop()};
    const openLayer=e=>{if(e){e.preventDefault();e.stopImmediatePropagation()}hideBrowSheet();const wasOpen=layers.classList.contains('show');if(color){color.classList.remove('show');color.style.setProperty('display','none','important')}layers.classList.toggle('show',!wasOpen);pinEditTop()};
    if(colorBtn)colorBtn.addEventListener('click',openColor,true);
    if(color){color.addEventListener('click',e=>{const rainbow=e.target.closest('.pickerwrap,.brow-rainbow');if(!rainbow)return;e.preventDefault();e.stopImmediatePropagation();openIosPicker()},true)}
    if(layerBtn)layerBtn.addEventListener('click',openLayer,true);if(browTab){browTab.addEventListener('pointerup',openBrow,true);browTab.addEventListener('click',openBrow,true)}window.addEventListener('resize',pinEditTop,{passive:true});pinEditTop();
  }
  function initAll(){loadIosPicker();initPanelFlow()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll();
})();