const projects = [
  {id:'eurobike',name:'Eurobike',category:'Motociclismo & ciclismo',color:'#3b2419',description:'Piezas para redes sociales que combinan producto, velocidad y el universo visual del motociclismo y el ciclismo.',captions:['Promoción de bicicletas: el ciclismo se pinta naranja','Comunicación de producto: KTM 390','Campaña de aniversario: 20 años','Composición visual de motocicletas: evolución','Comunicación de producto: Ready to Race']},
  {id:'evflex',name:'EVFLEX',category:'Movilidad eléctrica',color:'#263b28',description:'Composiciones visuales para comunicar vehículos eléctricos, accesorios y soluciones de movilidad a través de contenido digital.',captions:['Composición de producto y accesorios','Movilidad eléctrica e infraestructura de carga','Pieza de producto: cargador Wallbox','Contenido sobre costos de operación','Promoción de adaptador de carga']},
  {id:'alaya',name:'Alaya',category:'Seguros & protección',color:'#173b49',description:'Diseño para redes sociales y campañas que traducen temas de seguros y protección en mensajes visuales cercanos y claros.',captions:['Carrusel de riesgos: tu empresa no tiene siete vidas','Campaña de seguro de flotillas','Pieza de campaña para el sector minero','Contenido sobre protección de mercancías','Banner: tu tranquilidad también se hereda']},
  {id:'ktm',name:'KTM Bikes',category:'Ciclismo & producto',color:'#32312d',description:'Contenido de producto y estilo de vida para una marca ligada al ciclismo, el rendimiento y la aventura.',captions:['Presentación de bicicleta: Checa qué hermosa','Pieza de producto: calzado Leatt','Contenido de ciclismo de alto rendimiento','Pieza de estilo de vida: Dream it. Own it.','Presentación de bicicleta: Peaklane 271']},
  {id:'legal-key',name:'Legal Key',category:'Asesoría de visas',color:'#192f42',description:'Piezas de comunicación digital para asesoría de visas y orientación migratoria, con una línea visual sobria y composiciones conceptuales.',captions:['Composición conceptual con piezas de ajedrez','Contenido: no hay una sola forma de migrar','Comunicación de asesoría de visas','Pieza institucional: experiencia que abre fronteras','Contenido: migrar es un proyecto de vida']},
  {id:'dustless',name:'Dustless Blasting',category:'Industria & tecnología',color:'#20342d',description:'Diseño de contenido digital para presentar equipos, aplicaciones y ventajas técnicas de soluciones de tratamiento de superficies.',captions:['Comunicación de producto: cero riesgo de chispa','Presentación de la tolva DB500 Blastpot','Guía visual de flujo de aire','Trayectoria de marca: desde 1941','Contenido sobre mantenimiento y operaciones']},
  {id:'weiss',name:'Weiss Technik',category:'Tecnología & pruebas ambientales',color:'#1c2946',description:'Piezas de comunicación especializada para equipos de ensayo ambiental, soluciones de laboratorio y servicios técnicos.',captions:['Concepto visual: expertos en poner a prueba','Contenido sobre soluciones para data centers','Comunicación de servicios de reubicación','Servicios de puesta en marcha','Pieza de servicio técnico y reubicación']}
];

projects.forEach(project=>{
  project.media=project.captions.map((caption,index)=>({src:`assets/${project.id}-${index+1}.webp`,thumb:`assets/${project.id}-${index+1}.webp`,type:'image',caption}));
  project.media.push(...(additionalGallery[project.id]||[]));
});
const editorialProjects=newClientProjects.map(project=>({...project,category:'Branding & diseño editorial',description:'Flyers, trípticos, infografías y publicaciones. Explora cada documento con el visor interactivo.',media:project.media.filter(item=>item.type==='pdf')})).filter(project=>project.media.length);
projects.push(...newClientProjects.map(project=>({...project,media:project.media.filter(item=>item.type==='image')})));
const projectList = document.querySelector('#projects');
projects.forEach((project,index)=>{
  const article=document.createElement('article');
  article.className='project';
  const button=document.createElement('button');
  button.type='button';button.className='project-button';
  button.setAttribute('aria-label',`Ver las ${project.media.length} piezas de ${project.name}`);
  button.setAttribute('aria-haspopup','dialog');
  const art=document.createElement('div');art.className='project-art';art.style.setProperty('--card-bg',project.color);
  const number=document.createElement('span');number.className='project-number';number.textContent=`0${index+1} / ${project.name.toUpperCase()}`;art.append(number);
  const covers=project.covers||[2,1,3].map(n=>({src:`assets/${project.id}-${n}.webp`,caption:project.captions[n-1]}));
  covers.forEach(cover=>{const img=document.createElement('img');img.src=cover.src;img.alt=cover.caption;img.loading=index===0?'eager':'lazy';img.decoding='async';art.append(img)});
  const open=document.createElement('span');open.className='project-open';open.textContent='↗';open.setAttribute('aria-hidden','true');art.append(open);
  const meta=document.createElement('div');meta.className='project-meta';
  const label=document.createElement('div');const heading=document.createElement('h3');heading.className='project-name';heading.textContent=project.name;const category=document.createElement('span');category.className='project-category';category.textContent=`${project.category} / Diseño digital`;label.append(heading,category);
  const count=document.createElement('span');count.className='project-count';count.textContent=`${project.media.length} piezas ↗`;meta.append(label,count);
  button.append(art,meta);button.addEventListener('click',()=>openProject(project));article.append(button);
  const credit=document.createElement('p');credit.className='account-credit';credit.textContent='Diseño gráfico de todas las piezas: Luis Refugio.';article.append(credit);projectList.append(article);
});

const dialog=document.querySelector('#project-dialog');
let currentProject=null;let currentImage=0;
const galleryVideo=document.createElement('video');
galleryVideo.id='gallery-video';galleryVideo.controls=true;galleryVideo.playsInline=true;galleryVideo.preload='metadata';galleryVideo.hidden=true;
document.querySelector('.gallery-stage').append(galleryVideo);
galleryVideo.addEventListener('play',()=>document.querySelectorAll('video').forEach(video=>{if(video!==galleryVideo)video.pause()}));
const thumbnails=document.createElement('div');thumbnails.className='gallery-thumbnails';thumbnails.setAttribute('role','group');thumbnails.setAttribute('aria-label','Elegir una pieza');
document.querySelector('.gallery-bottom').after(thumbnails);
function openProject(project,initialIndex=0){
  document.querySelectorAll('video').forEach(video=>video.pause());
  currentProject=project;currentImage=initialIndex;
  document.querySelector('#dialog-title').textContent=project.name;
  document.querySelector('#dialog-category').textContent=project.category;
  document.querySelector('#dialog-description').textContent=project.description;
  thumbnails.replaceChildren();
  project.media.forEach((item,index)=>{
    const button=document.createElement('button');button.type='button';button.className='gallery-thumb';button.setAttribute('aria-label',`Ver pieza ${index+1}: ${item.caption}`);
    if(item.thumb){const img=document.createElement('img');img.src=item.thumb;img.alt='';img.loading='lazy';button.append(img);if(item.type==='pdf'){const badge=document.createElement('span');badge.className='pdf-badge';badge.textContent='PDF';button.append(badge)}}
    else{const icon=document.createElement('span');icon.className='gallery-video-icon';icon.textContent='▶';icon.setAttribute('aria-hidden','true');button.append(icon)}
    const number=document.createElement('span');number.className='thumb-number';number.textContent=String(index+1).padStart(2,'0');button.append(number);
    button.addEventListener('click',()=>{currentImage=index;renderImage()});thumbnails.append(button);
  });
  renderImage();dialog.showModal();dialog.scrollTop=0;thumbnails.scrollLeft=0;document.body.classList.add('modal-open');
}
function renderImage(){
  const item=currentProject.media[currentImage],img=document.querySelector('#gallery-image');
  const authorship=item.type==='video'?'Edición y cortes: Luis Refugio. Material audiovisual proporcionado por la marca.':'Diseño gráfico de todas las piezas: Luis Refugio.';
  document.querySelector('#dialog-authorship').textContent=authorship;
  document.querySelector('.dialog-credit').textContent=authorship+' Textos: equipo de contenido · Realizado en Estrasol.';
  document.querySelectorAll('.gallery-arrow').forEach(button=>{button.disabled=false;button.setAttribute('aria-label',`${item.type==='pdf'?'Hoja':'Pieza'} ${button.classList.contains('previous')?'anterior':'siguiente'}`)});
  galleryVideo.pause();galleryVideo.removeAttribute('src');galleryVideo.load();
  img.hidden=item.type!=='image';galleryVideo.hidden=item.type!=='video';
  if(item.type==='video'){galleryVideo.src=item.src;galleryVideo.setAttribute('aria-label',item.caption)}
  else if(item.type==='image'){img.src=item.src;img.alt=`${currentProject.name}: ${item.caption}`}
  document.querySelector('#gallery-caption').textContent=item.caption;
  document.querySelector('#gallery-counter').textContent=`${currentImage+1} / ${currentProject.media.length}`;
  [...thumbnails.children].forEach((button,index)=>button.setAttribute('aria-pressed',String(index===currentImage)));
  const active=thumbnails.children[currentImage];
  if(dialog.open)thumbnails.scrollTo({left:active.offsetLeft-thumbnails.offsetLeft-thumbnails.clientWidth/2+active.clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
function moveImage(direction){if(!currentProject)return;currentImage=(currentImage+direction+currentProject.media.length)%currentProject.media.length;renderImage()}
document.querySelector('.previous').addEventListener('click',()=>currentProject.media[currentImage].type==='pdf'?turnMagazine(-1):moveImage(-1));
document.querySelector('.next').addEventListener('click',()=>currentProject.media[currentImage].type==='pdf'?turnMagazine(1):moveImage(1));
dialog.addEventListener('keydown',event=>{if(event.target===galleryVideo||event.target.matches('select,input'))return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;if(currentProject.media[currentImage].type==='pdf')turnMagazine(direction);else moveImage(direction)}});
dialog.addEventListener('close',()=>{galleryVideo.pause();galleryVideo.removeAttribute('src');galleryVideo.load();document.body.classList.remove('modal-open')});
let touchStart=null;
document.querySelector('.gallery-stage').addEventListener('touchstart',event=>{touchStart=event.target===galleryVideo?null:{x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY}},{passive:true});
document.querySelector('.gallery-stage').addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){if(currentProject.media[currentImage].type==='pdf')turnMagazine(dx<0?1:-1);else moveImage(dx<0?1:-1)}touchStart=null},{passive:true});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});

document.querySelector('#year').textContent=new Date().getFullYear();
