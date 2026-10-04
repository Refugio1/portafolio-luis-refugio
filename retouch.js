const retouchPhotos=[
  {id:'7419',before:'assets/retouch/dsc_7419-before.webp',after:'assets/retouch/dsc_7419-after.webp',ratio:3/2},
  {id:'7504',before:'assets/retouch/dsc_7504-before.webp',after:'assets/retouch/dsc_7504-after.webp',ratio:2/3},
  {id:'7630',before:'assets/retouch/dsc_7630-before.webp',after:'assets/retouch/dsc_7630-after.webp',ratio:3/2},
  {id:'7656',before:'assets/retouch/dsc_7656-before.webp',after:'assets/retouch/dsc_7656-after.webp',ratio:2/3},
  {id:'7712',before:'assets/retouch/dsc_7712-before.webp',after:'assets/retouch/dsc_7712-after.webp',ratio:3/2},
  {id:'rdo_5',before:'assets/retouch/rdo_5-before.webp',after:'assets/retouch/rdo_5-after.webp',ratio:2/3},
  {id:'rdo_15',before:'assets/retouch/rdo_15-before.webp',after:'assets/retouch/rdo_15-after.webp',ratio:2/3},
  {id:'rdo_55',before:'assets/retouch/rdo_55-before.webp',after:'assets/retouch/rdo_55-after.webp',ratio:2/3}
].map((item,i)=>({...item,name:`Toma ${String(i+1).padStart(2,'0')}`}));
const compareStage=document.querySelector('#retouch-compare'),compareRange=document.querySelector('#retouch-range'),retouchChoices=document.querySelector('#retouch-choices');
let retouchIndex=0;
function setRetouchSplit(value){const split=Math.min(100,Math.max(0,Number(value)));compareRange.value=split;compareStage.style.setProperty('--split',split+'%');compareRange.setAttribute('aria-valuetext',`${Math.round(split)}% antes, ${100-Math.round(split)}% después`)}
function selectRetouch(index){
  retouchIndex=(index+retouchPhotos.length)%retouchPhotos.length;const item=retouchPhotos[retouchIndex];
  compareStage.style.setProperty('--photo-ratio',item.ratio);
  document.querySelector('#retouch-before').src=item.before;document.querySelector('#retouch-before').alt=`${item.name}: fotografía original, antes del retoque`;
  document.querySelector('#retouch-after').src=item.after;document.querySelector('#retouch-after').alt=`${item.name}: fotografía después del retoque`;
  document.querySelector('#retouch-position').textContent=`${item.name} / ${String(retouchPhotos.length).padStart(2,'0')}`;
  compareRange.setAttribute('aria-label',`Comparar antes y después de ${item.name}`);
  [...retouchChoices.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===retouchIndex)));setRetouchSplit(50);
}
retouchPhotos.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.className='retouch-choice';button.setAttribute('aria-label',`Comparar ${item.name}`);const img=document.createElement('img');img.src=item.after;img.alt='';img.loading='lazy';const label=document.createElement('span');label.textContent=item.name;button.append(img,label);button.addEventListener('click',()=>selectRetouch(i));retouchChoices.append(button)});
compareRange.addEventListener('input',()=>setRetouchSplit(compareRange.value));
function splitAtPointer(event){const bounds=compareStage.getBoundingClientRect();setRetouchSplit((event.clientX-bounds.left)/bounds.width*100)}
compareStage.addEventListener('pointerdown',event=>{if(event.button!==0)return;compareRange.focus({preventScroll:true});compareStage.setPointerCapture(event.pointerId);splitAtPointer(event)});
compareStage.addEventListener('pointermove',event=>{if(compareStage.hasPointerCapture(event.pointerId))splitAtPointer(event)});
compareStage.addEventListener('pointerup',event=>{if(compareStage.hasPointerCapture(event.pointerId))compareStage.releasePointerCapture(event.pointerId)});
document.querySelector('#retouch-prev').addEventListener('click',()=>selectRetouch(retouchIndex-1));document.querySelector('#retouch-next').addEventListener('click',()=>selectRetouch(retouchIndex+1));
selectRetouch(0);
