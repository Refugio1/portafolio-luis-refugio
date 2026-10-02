const mediaIcons={heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',comment:'<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.4L3 21l2.1-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',send:'<path d="m22 2-7 20-4-9L2 9 22 2ZM22 2 11 13"/>',home:'<path d="m3 10 9-8 9 8v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',plus:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/>',reel:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 8h18M7 3l3 5m5-5 3 5m-8 4 6 4-6 3Z"/>',user:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/><path d="M5 20v-3c0-5 14-5 14 0v3"/>'};
function mediaIcon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${mediaIcons[name]}</svg>`}
function phoneShell(content,brand){
  const phone=document.createElement('div');phone.className='reel-phone';
  phone.innerHTML='<div class="phone-status" aria-hidden="true"><span>9:41</span><i></i><span>▥ ◔ ▰</span></div><div class="phone-account"><span class="phone-avatar">lr</span><span class="phone-brand"></span><span aria-hidden="true">···</span></div><div class="phone-display"></div><div class="phone-caption"><span class="phone-brand"></span><span class="phone-format"></span></div><div class="phone-nav" aria-hidden="true">'+['home','search','plus','reel','user'].map(mediaIcon).join('')+'</div><div class="phone-home" aria-hidden="true"></div>';
  phone.querySelectorAll('.phone-brand').forEach(el=>el.textContent=brand);phone.querySelector('.phone-display').append(content);return phone;
}
function createReelCarousel(containerId,items,label){
  const root=document.querySelector(containerId);let index=0;
  root.className='reel-carousel';root.setAttribute('role','region');root.setAttribute('aria-roledescription','carrusel');root.setAttribute('aria-label',label);
  const scene=document.createElement('div');scene.className='reel-scene';
  const makeNeighbor=(direction)=>{const button=document.createElement('button');button.type='button';button.className='reel-neighbor '+(direction<0?'reel-before':'reel-after');const img=document.createElement('img');img.alt='';img.decoding='async';button.append(phoneShell(img,''));button.addEventListener('click',()=>select(index+direction));return button};
  const before=makeNeighbor(-1),after=makeNeighbor(1);
  const current=document.createElement('div');current.className='reel-current';const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',label);current.append(phoneShell(video,''));
  scene.append(before,current,after);
  [-1,1].forEach(direction=>{
    const arrow=document.createElement('button');arrow.type='button';arrow.className='reel-side-arrow '+(direction<0?'reel-side-prev':'reel-side-next');arrow.textContent=direction<0?'←':'→';
    arrow.setAttribute('aria-label',`${direction<0?'Anterior':'Siguiente'} junto al teléfono de ${label}`);arrow.addEventListener('click',()=>select(index+direction));scene.append(arrow);
  });
  const toolbar=document.createElement('div');toolbar.className='reel-toolbar';toolbar.innerHTML='<div><p class="reel-eyebrow"></p><h3></h3></div><div class="reel-navigation"><button type="button" class="reel-prev">←</button><span class="reel-counter" aria-live="polite"></span><button type="button" class="reel-next">→</button></div>';
  const authorship=document.createElement('p');authorship.className='account-credit';authorship.textContent=containerId==='#videos'?'Edición y cortes: Luis Refugio. Material audiovisual proporcionado por la marca.':'Dirección visual y edición con IA: Luis Refugio.';toolbar.firstElementChild.append(authorship);
  toolbar.querySelector('.reel-prev').setAttribute('aria-label',`Video anterior de ${label}`);toolbar.querySelector('.reel-next').setAttribute('aria-label',`Video siguiente de ${label}`);
  toolbar.querySelector('.reel-prev').addEventListener('click',()=>select(index-1));toolbar.querySelector('.reel-next').addEventListener('click',()=>select(index+1));
  const strip=document.createElement('div');strip.className='reel-strip';strip.setAttribute('role','group');strip.setAttribute('aria-label',`Elegir video de ${label}`);
  items.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.className='reel-thumb';button.setAttribute('aria-label',`${i+1}. ${item.name}: ${item.label}`);const img=document.createElement('img');img.src=item.poster;img.alt='';img.loading='lazy';const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');button.append(img,number);button.addEventListener('click',()=>select(i));strip.append(button)});
  const error=document.createElement('p');error.className='reel-error';error.hidden=true;error.textContent='No se pudo cargar este video. Selecciona otra pieza o vuelve a intentarlo.';
  root.append(scene,toolbar,strip,error);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function fillPhone(parent,item){parent.querySelectorAll('.phone-brand').forEach(el=>el.textContent=item.name);parent.querySelector('.phone-format').textContent=item.label}
  function select(next){
    video.pause();index=(next+items.length)%items.length;const item=items[index];error.hidden=true;
    video.src=item.src;video.poster=item.poster;video.setAttribute('aria-label',`${label}: ${item.name}, ${item.label}`);video.load();fillPhone(current,item);
    [[before,-1],[after,1]].forEach(([el,offset])=>{const neighbor=items[(index+offset+items.length)%items.length];el.querySelector('img').src=neighbor.poster;el.setAttribute('aria-label',`${offset<0?'Anterior':'Siguiente'}: ${neighbor.name}, ${neighbor.label}`);fillPhone(el,neighbor)});
    toolbar.querySelector('h3').textContent=item.name;toolbar.querySelector('.reel-eyebrow').textContent=item.label;toolbar.querySelector('.reel-counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    [...strip.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    const active=strip.children[index];strip.scrollTo({left:active.offsetLeft-strip.offsetLeft-strip.clientWidth/2+active.clientWidth/2,behavior:reduced.matches?'instant':'smooth'});
    if(!reduced.matches)current.animate([{opacity:.65,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
  }
  video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()}));video.addEventListener('error',()=>{error.hidden=false});
  root.addEventListener('keydown',event=>{if(event.target===video)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(index+(event.key==='ArrowRight'?1:-1))}});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause()},{threshold:0}).observe(root);
  select(0);
}
createReelCarousel('#videos',reelCollections.motion,'Video & Motion');
createReelCarousel('#ai-videos',reelCollections.ai,'IA para marcas');

// Only the inside of the post gallery changes; the brand covers stay intact.
const stage=document.querySelector('.gallery-stage');
const stack=document.createElement('div');stack.className='social-stack';
function socialCard(className){const card=document.createElement('div');card.className='social-card '+className;card.innerHTML='<div class="social-top"><span class="social-avatar">lr</span><span class="social-brand"></span><span aria-hidden="true">···</span></div><div class="social-content"></div><div class="social-bottom" aria-hidden="true">'+['heart','comment','send'].map(mediaIcon).join('')+'<span>⋮</span></div>';return card}
const sideLeft=socialCard('social-left'),center=socialCard('social-center'),sideRight=socialCard('social-right');
[sideLeft,sideRight].forEach(card=>{card.setAttribute('aria-hidden','true');const img=document.createElement('img');img.alt='';card.querySelector('.social-content').append(img)});
center.querySelector('.social-content').append(document.querySelector('#gallery-image'),galleryVideo);stack.append(sideLeft,sideRight,center);stage.append(stack);
const originalRender=renderImage;
renderImage=function(){
  originalRender();
  stack.querySelectorAll('.social-brand').forEach(el=>el.textContent=currentProject.name);
  [[sideLeft,-1],[sideRight,1]].forEach(([card,offset])=>{const item=currentProject.media[(currentImage+offset+currentProject.media.length)%currentProject.media.length];const img=card.querySelector('img');img.hidden=item.type==='video';if(item.type!=='video')img.src=item.type==='pdf'?item.thumb:item.src;card.classList.toggle('social-video-preview',item.type==='video')});
  stack.classList.toggle('has-video',currentProject.media[currentImage].type==='video');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)center.animate([{opacity:.55,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});
};
