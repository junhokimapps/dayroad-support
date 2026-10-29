document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.asset').forEach(a=>a.hidden=button.dataset.filter!=='all'&&a.dataset.kind!==button.dataset.filter)}));
const motion=document.getElementById('motion'),video=document.querySelector('.hero video');
function syncMotion(){const playing=!video.paused&&!video.ended;motion.textContent=playing?'Ⅱ':'▶';motion.setAttribute('aria-label',playing?motion.dataset.pauseLabel:motion.dataset.playLabel);motion.title=motion.getAttribute('aria-label');motion.setAttribute('aria-pressed',String(playing));}
video.addEventListener('play',syncMotion);video.addEventListener('pause',syncMotion);video.addEventListener('ended',syncMotion);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){video.autoplay=false;video.pause();}
motion.addEventListener('click',()=>{if(video.paused){const pending=video.play();syncMotion();pending.then(syncMotion).catch(syncMotion);}else{video.pause();syncMotion();}});syncMotion();
document.getElementById('copy').addEventListener('click',async e=>{await navigator.clipboard.writeText(document.getElementById('press-copy').textContent);e.target.textContent=e.target.dataset.done;});
