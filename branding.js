const editorialGrid=document.querySelector('#editorial-grid');
const editorialFilters=document.querySelector('#editorial-filters');
function editorialFormat(item){
  const title=item.caption.toLocaleLowerCase('es');
  if(title.includes('reporte'))return 'Reporte';
  if(title.includes('cómic'))return 'Cómic';
  if(title.includes('tríptico')||title.includes('triptico'))return 'Tríptico';
  if(title.includes('polidiptico')||title.includes('políptico'))return 'Políptico';
  if(title.includes('ficha'))return 'Ficha técnica';
  if(title.includes('brochure'))return 'Brochure';
  if(title.includes('opl')||title.includes('infografía'))return 'Infografía';
  if(title.includes('invitacion'))return 'Invitación';
  return 'Flyer / cartel';
}
function showEditorial(id='all'){
  editorialGrid.replaceChildren();
  [...editorialFilters.children].forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.brand===id)));
  editorialProjects.filter(project=>id==='all'||project.id===id).forEach(project=>project.media.forEach((item,index)=>{
    const card=document.createElement('article');card.className='editorial-card';
    const button=document.createElement('button');button.type='button';button.className='editorial-open';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',`Hojear ${item.caption} de ${project.name}`);
    const cover=document.createElement('div');cover.className='editorial-cover';cover.style.setProperty('--editorial-color',project.color);
    const image=document.createElement('img');image.src=item.pages[0].src;image.alt='Portada de '+item.caption;image.loading='lazy';image.decoding='async';
    const format=document.createElement('span');format.className='editorial-format';format.textContent=editorialFormat(item);
    const arrow=document.createElement('span');arrow.className='editorial-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');cover.append(image,format,arrow);
    const meta=document.createElement('div');meta.className='editorial-meta';
    const brand=document.createElement('span');brand.className='editorial-brand';brand.textContent=project.name;
    const title=document.createElement('h3');title.textContent=item.caption;
    const pages=document.createElement('span');pages.className='editorial-pages';pages.textContent=`${item.pages.length} ${item.pages.length===1?'página · Ver pieza':'páginas · Hojear'}`;
    meta.append(brand,title,pages);button.append(cover,meta);button.addEventListener('click',()=>openProject(project,index));card.append(button);editorialGrid.append(card);
  }));
  document.querySelector('#editorial-count').textContent=`${editorialGrid.children.length} publicaciones`;
}
[{id:'all',name:'Todos'},...editorialProjects].forEach(project=>{const button=document.createElement('button');button.type='button';button.dataset.brand=project.id;button.textContent=project.name;button.addEventListener('click',()=>showEditorial(project.id));editorialFilters.append(button)});
showEditorial();
