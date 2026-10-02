// Local page images keep the editorial reader available even when opened offline.
const magazine=document.createElement('section');
magazine.className='magazine';magazine.hidden=true;magazine.setAttribute('aria-label','Revista interactiva');
magazine.innerHTML='<div class="magazine-top"><span>DISEÑO EDITORIAL <i> / </i> PDF</span><a class="magazine-download" download>Descargar PDF ↓</a></div><div class="magazine-book" aria-label="Páginas de la publicación"></div><div class="magazine-controls"><button type="button" class="magazine-prev" aria-label="Página anterior">←</button><span class="magazine-count" role="status"></span><button type="button" class="magazine-next" aria-label="Página siguiente">→</button><label class="magazine-jump">Ir a página <select aria-label="Ir a página"></select></label><button type="button" class="magazine-enlarge">Ampliar página ↗</button></div><p class="magazine-hint"></p>';
stage.append(magazine);
const book=magazine.querySelector('.magazine-book'),pageSelect=magazine.querySelector('select');
let magazineItem=null,magazinePage=0,turnAnimation=null;
const smallBook=matchMedia('(max-width:700px)'),quietBook=matchMedia('(prefers-reduced-motion:reduce)');
function spreadMode(){return !smallBook.matches && magazineItem.pages.length>2 && magazineItem.pages.every(p=>p.width/p.height<1.05)}
function pageImage(n){const img=document.createElement('img');img.src=magazineItem.pages[n].src;img.alt=`${magazineItem.caption}, página ${n+1}`;img.decoding='async';return img}
function visibleBookPages(){return spreadMode()&&magazinePage>0?[magazinePage,magazinePage+1].filter(p=>p<magazineItem.pages.length):[magazinePage]}
function drawMagazine(direction=0){
  if(turnAnimation){turnAnimation.cancel();turnAnimation=null}book.querySelector('.turning-page')?.remove();
  const oldPage=book.querySelector(direction<0?'.book-page:first-child img':'.book-page:last-child img')?.cloneNode();
  book.replaceChildren();const visible=visibleBookPages(),spread=spreadMode();
  const dimensions=magazineItem.pages[magazinePage];book.style.setProperty('--book-ratio',String(dimensions.width/dimensions.height*(spread?2:1)));
  book.classList.toggle('is-spread',spread&&magazinePage>0);book.classList.toggle('is-cover',spread&&magazinePage===0);
  visible.forEach((n,i)=>{const page=document.createElement('button');page.type='button';page.className='book-page';page.setAttribute('aria-label',`Ampliar página ${n+1}`);page.append(pageImage(n));const folio=document.createElement('span');folio.textContent=String(n+1).padStart(2,'0');folio.className='page-folio';page.append(folio);page.addEventListener('click',()=>openPageZoom(n));book.append(page)});
  if(spread&&magazinePage>0&&visible.length===1){const blank=document.createElement('div');blank.className='book-end';blank.textContent='Fin de la publicación';book.append(blank)}
  magazine.querySelector('.magazine-count').textContent=`${visible.map(n=>n+1).join('–')} / ${magazineItem.pages.length}`;
  magazine.querySelector('.magazine-prev').disabled=magazinePage===0;
  magazine.querySelector('.magazine-next').disabled=visible.at(-1)>=magazineItem.pages.length-1;
  stage.querySelector('.previous').disabled=magazinePage===0;stage.querySelector('.next').disabled=visible.at(-1)>=magazineItem.pages.length-1;
  pageSelect.value=String(magazinePage);magazine.querySelector('.magazine-hint').textContent=magazineItem.pages.length===1?'Pieza de una página · Pulsa para ampliar':'Hojea con las flechas o desliza · Pulsa una página para ampliarla';
  if(direction&&oldPage&&!quietBook.matches){
    const leaf=document.createElement('div');leaf.className='turning-page '+(direction<0?'turn-back':'turn-forward');leaf.setAttribute('aria-hidden','true');leaf.append(oldPage);book.append(leaf);
    turnAnimation=leaf.animate([{transform:'rotateY(0deg)',opacity:1},{transform:`rotateY(${direction<0?85:-85}deg)`,opacity:.25}],{duration:480,easing:'cubic-bezier(.25,.6,.3,1)'});
    turnAnimation.onfinish=()=>{leaf.remove();turnAnimation=null};
  }
  // Preload only the next spread, not the whole document.
  for(let n=visible.at(-1)+1;n<Math.min(visible.at(-1)+3,magazineItem.pages.length);n++){const preload=new Image();preload.src=magazineItem.pages[n].src}
}
function turnMagazine(direction){
  if(!magazineItem)return;
  let next=magazinePage+direction;
  if(spreadMode())next=direction>0?(magazinePage===0?1:magazinePage+2):(magazinePage<=1?0:magazinePage-2);
  if(next<0||next>=magazineItem.pages.length)return;
  magazinePage=next;drawMagazine(direction);
}
magazine.querySelector('.magazine-prev').addEventListener('click',()=>turnMagazine(-1));
magazine.querySelector('.magazine-next').addEventListener('click',()=>turnMagazine(1));
pageSelect.addEventListener('change',()=>{const old=magazinePage;magazinePage=Number(pageSelect.value);if(spreadMode()&&magazinePage>0)magazinePage=1+Math.floor((magazinePage-1)/2)*2;drawMagazine(Math.sign(magazinePage-old))});
smallBook.addEventListener('change',()=>{if(magazineItem){if(spreadMode()&&magazinePage>0)magazinePage=1+Math.floor((magazinePage-1)/2)*2;drawMagazine()}});
const renderBeforeMagazine=renderImage;
renderImage=function(){
  renderBeforeMagazine();const item=currentProject.media[currentImage],isPdf=item.type==='pdf';
  stack.hidden=isPdf;magazine.hidden=!isPdf;stage.classList.toggle('has-magazine',isPdf);
  if(!isPdf){magazineItem=null;return}
  magazineItem=item;magazinePage=0;pageSelect.replaceChildren();
  item.pages.forEach((_,n)=>{const option=document.createElement('option');option.value=n;option.textContent=n+1;pageSelect.append(option)});
  magazine.querySelector('.magazine-download').href=item.src;drawMagazine();
};

const pageZoom=document.createElement('dialog');pageZoom.id='page-zoom';pageZoom.setAttribute('aria-label','Lectura ampliada del PDF');
pageZoom.innerHTML='<div class="page-zoom-bar"><span class="zoom-label"></span><div><button type="button" class="zoom-prev" aria-label="Página ampliada anterior">←</button><button type="button" class="zoom-next" aria-label="Página ampliada siguiente">→</button><button type="button" class="zoom-close" aria-label="Cerrar página ampliada">✕</button></div></div><div class="page-zoom-content"></div>';
document.body.append(pageZoom);let zoomPage=0;
function drawZoom(){pageZoom.querySelector('.page-zoom-content').replaceChildren(pageImage(zoomPage));pageZoom.querySelector('.zoom-label').textContent=`Página ${zoomPage+1} de ${magazineItem.pages.length}`;pageZoom.querySelector('.zoom-prev').disabled=zoomPage===0;pageZoom.querySelector('.zoom-next').disabled=zoomPage===magazineItem.pages.length-1;pageZoom.scrollTop=0}
function openPageZoom(n){zoomPage=n;drawZoom();pageZoom.showModal()}
function stepZoom(d){const next=zoomPage+d;if(next>=0&&next<magazineItem.pages.length){zoomPage=next;drawZoom()}}
magazine.querySelector('.magazine-enlarge').addEventListener('click',()=>openPageZoom(magazinePage));
pageZoom.querySelector('.zoom-close').addEventListener('click',()=>pageZoom.close());
pageZoom.querySelector('.zoom-prev').addEventListener('click',()=>stepZoom(-1));
pageZoom.querySelector('.zoom-next').addEventListener('click',()=>stepZoom(1));
pageZoom.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stepZoom(event.key==='ArrowRight'?1:-1)}});
