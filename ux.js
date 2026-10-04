const uxProjects=[
  {id:'legal-key',name:'Legal Key',kind:'DISEÑO UX/UI / ASESORÍA DE VISAS',description:'Una presencia digital sobria para comunicar asesoría y trámites de visas con claridad, confianza y una navegación directa.',tags:['Diseño UX/UI','Asesoría de visas'],address:'legal-key.vercel.app',url:'https://legal-key.vercel.app',color:'#1c344c',type:'site'},
  {id:'alaya',name:'Alaya',kind:'DISEÑO UX/UI / SEGUROS & FIANZAS',description:'Una experiencia cercana para explorar soluciones de protección. Jerarquía visual, servicios y puntos de contacto en una misma interfaz.',tags:['Diseño UX/UI','Seguros & fianzas'],address:'alaya-home.vercel.app',url:'https://alaya-home.vercel.app',color:'#15404a',type:'site'},
  {id:'energy',name:'Energy Opening',kind:'DISEÑO UX/UI / ENERGÍA',description:'Una propuesta visual que transmite la escala del sector energético, con una portada inmersiva y acceso directo a sus soluciones.',tags:['Diseño UX/UI','Energía'],address:'Energy Opening / Figma',url:'https://www.figma.com/proto/lYSEJyV8M5ULR5GhvwFCOj/Energy-Opening?node-id=18-2899&scaling=scale-down-width&content-scaling=fixed',color:'#563817',type:'figma'},
  {id:'trevor',name:'DB Trevor',kind:'DISEÑO UX/UI / SERVICIOS INDUSTRIALES',description:'Diseño para Cleaner Finish Blasting: servicios industriales con imágenes protagonistas, información organizada y llamadas a la acción visibles.',tags:['Diseño UX/UI','Industria'],address:'DB Trevor / Figma',url:'https://www.figma.com/proto/h6MQaiBEVhtOao4CRsHYDm/DB-Trevor?node-id=10-1415&t=Wx2tOke6Md7yZpmJ-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1',color:'#203853',type:'figma'},
  {id:'cero-uno',name:'Cero Uno Software',kind:'DISEÑO UX/UI / TECNOLOGÍA',description:'Una interfaz que conecta software, consultoría y seguridad. Espacios abiertos y una identidad tecnológica con una lectura clara.',tags:['Diseño UX/UI','Software'],address:'Cero Uno Software / Figma',url:'https://www.figma.com/proto/u9VXZzQ1HjOInflc9JNZhI/Cero-Uno-Software?node-id=180-285&starting-point-node-id=180%3A285&scaling=scale-down-width&content-scaling=fixed',color:'#16434d',type:'figma'}
];
let uxCurrent=0;
const uxSelector=document.querySelector('#ux-selector'),uxShowcase=document.querySelector('#ux-showcase'),uxDialog=document.querySelector('#ux-dialog');
const uxReducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
uxProjects.forEach((project,index)=>{
  const button=document.createElement('button');button.type='button';button.className='ux-choice';button.setAttribute('aria-pressed',String(index===0));
  const number=document.createElement('span');number.className='ux-choice-number';number.textContent=String(index+1).padStart(2,'0');
  const img=document.createElement('img');img.src=`assets/ux/${project.id}-preview.webp`;img.alt='';img.loading='lazy';img.width=1280;img.height=720;
  const name=document.createElement('span');name.className='ux-choice-name';name.textContent=project.name;
  const type=document.createElement('span');type.className='ux-choice-type';type.textContent='DISEÑO UX/UI · VER CAPTURA';
  button.append(number,img,name,type);button.addEventListener('click',()=>{selectUx(index);if(matchMedia('(max-width:650px)').matches)uxShowcase.scrollIntoView({behavior:uxReducedMotion.matches?'instant':'smooth',block:'start'})});uxSelector.append(button);
});
function selectUx(index){
  uxCurrent=(index+uxProjects.length)%uxProjects.length;const project=uxProjects[uxCurrent];
  uxShowcase.style.setProperty('--ux-color',project.color);
  document.querySelector('#ux-position').textContent=`${String(uxCurrent+1).padStart(2,'0')} / 05`;
  document.querySelector('#ux-kind').textContent=project.kind;
  document.querySelector('#ux-name').textContent=project.name;
  document.querySelector('#ux-description').textContent=project.description;
  document.querySelector('#ux-address').textContent=project.name+' / Diseño UX/UI';
  const img=document.querySelector('#ux-image');img.src=`assets/ux/${project.id}-preview.webp`;img.alt=`Diseño de la página de inicio de ${project.name}`;
  const tags=document.querySelector('#ux-tags');tags.replaceChildren();project.tags.forEach(tag=>{const span=document.createElement('span');span.textContent=tag;tags.append(span)});
  document.querySelector('#ux-expand').setAttribute('aria-label',`Ampliar diseño de ${project.name}`);
  [...uxSelector.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===uxCurrent)));
  if(!uxReducedMotion.matches){document.querySelector('.ux-copy').animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});img.animate([{opacity:.25},{opacity:1}],{duration:400})}
}
document.querySelector('#ux-prev').addEventListener('click',()=>selectUx(uxCurrent-1));
document.querySelector('#ux-next').addEventListener('click',()=>selectUx(uxCurrent+1));
uxSelector.addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();selectUx(event.key==='Home'?0:event.key==='End'?4:uxCurrent+(event.key==='ArrowRight'?1:-1));uxSelector.children[uxCurrent].focus()});
document.querySelector('#ux-expand').addEventListener('click',()=>{
  const project=uxProjects[uxCurrent];document.querySelector('#ux-dialog-title').textContent=project.name;
  const img=document.querySelector('#ux-dialog-image');img.src=`assets/ux/${project.id}-full.webp`;img.alt=`Diseño de la página de inicio de ${project.name}`;
  uxDialog.showModal();uxDialog.scrollTop=0;document.body.classList.add('modal-open');
});
uxDialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
uxDialog.addEventListener('click',event=>{if(event.target===uxDialog){const r=uxDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)uxDialog.close()}});
const uxSpace=document.querySelector('#ux-device-space');
uxSpace.addEventListener('pointermove',event=>{if(uxReducedMotion.matches||event.pointerType!=='mouse')return;const rect=uxSpace.getBoundingClientRect();uxSpace.style.setProperty('--tilt-x',`${-(event.clientY-rect.top-rect.height/2)/rect.height*5}deg`);uxSpace.style.setProperty('--tilt-y',`${(event.clientX-rect.left-rect.width/2)/rect.width*6}deg`)});
uxSpace.addEventListener('pointerleave',()=>{uxSpace.style.setProperty('--tilt-x','0deg');uxSpace.style.setProperty('--tilt-y','0deg')});
selectUx(0);
