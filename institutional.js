const institutionalVideos=newClientProjects.flatMap(project=>project.media.filter(item=>item.type==='video').map(item=>({...item,brand:project.name})));
const institutionalTitles=['Cultura de calidad · Conny','Cultura de calidad · Ernestor Romero','Ambiente de trabajo y respeto','Semana de la Ética · Integridad','Política de conflicto de interés'];
const institutionalPlayer=document.querySelector('#institutional-player');
const institutionalChoices=document.querySelector('#institutional-choices');
let institutionalIndex=0;
function selectInstitutional(next){
  institutionalPlayer.pause();institutionalIndex=(next+institutionalVideos.length)%institutionalVideos.length;
  const item=institutionalVideos[institutionalIndex];
  institutionalPlayer.src=item.src+'#t=0.1';institutionalPlayer.setAttribute('aria-label',`${item.brand}: ${institutionalTitles[institutionalIndex]}`);institutionalPlayer.load();
  document.querySelector('#institutional-brand').textContent=item.brand;
  document.querySelector('#institutional-name').textContent=institutionalTitles[institutionalIndex];
  document.querySelector('#institutional-position').textContent=`${String(institutionalIndex+1).padStart(2,'0')} / ${String(institutionalVideos.length).padStart(2,'0')}`;
  document.querySelector('#institutional-error').hidden=true;
  [...institutionalChoices.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===institutionalIndex)));
}
institutionalVideos.forEach((item,i)=>{
  const button=document.createElement('button');button.type='button';button.className='institutional-choice';
  const number=document.createElement('span');number.className='institutional-number';number.textContent=String(i+1).padStart(2,'0');
  const brand=document.createElement('span');brand.className='institutional-choice-brand';brand.textContent=item.brand;
  const title=document.createElement('span');title.className='institutional-choice-title';title.textContent=institutionalTitles[i];
  button.setAttribute('aria-label',`Elegir video institucional ${i+1}: ${item.brand}, ${institutionalTitles[i]}`);button.append(number,brand,title);button.addEventListener('click',()=>selectInstitutional(i));institutionalChoices.append(button);
});
document.querySelector('#institutional-prev').addEventListener('click',()=>selectInstitutional(institutionalIndex-1));
document.querySelector('#institutional-next').addEventListener('click',()=>selectInstitutional(institutionalIndex+1));
document.querySelector('#institutional-carousel').addEventListener('keydown',event=>{if(event.target===institutionalPlayer)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();selectInstitutional(institutionalIndex+(event.key==='ArrowRight'?1:-1))}});
institutionalPlayer.addEventListener('play',()=>document.querySelectorAll('video').forEach(video=>{if(video!==institutionalPlayer)video.pause()}));
institutionalPlayer.addEventListener('error',()=>{document.querySelector('#institutional-error').hidden=false});
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)institutionalPlayer.pause()},{threshold:0}).observe(institutionalPlayer);
selectInstitutional(0);
