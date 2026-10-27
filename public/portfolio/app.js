const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const escapeHTML = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const projectDialog=$('#project-dialog'), imageDialog=$('#image-dialog');
const content=$('#project-content');
let projects=[], imageSet=[], imageIndex=0, opener=null, imageOpener=null;
const dataReady=fetch('projects.json?v=portfolio5').then(r=>{if(!r.ok)throw Error('Project data unavailable');return r.json()}).then(p=>{projects=p});
dataReady.catch(()=>{const p=document.createElement('p');p.className='noscript';p.textContent='The project collection could not load. Please refresh this page to try again.';$('.project-grid').before(p)});

$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const filter=button.dataset.filter;
  let count=0;
  $$('.project').forEach(card=>{card.hidden=filter!=='All'&&card.dataset.category!==filter;if(!card.hidden)count++});
  $('#filter-status').textContent=`Showing ${count} ${filter==='All'?'':filter.toLowerCase()+' '}project${count===1?'':'s'}.`;
}));

function syncLock(){document.body.classList.toggle('locked',projectDialog.open||imageDialog.open)}
async function openProject(id,trigger){
  await dataReady;
  const p=projects.find(p=>p.id===id);if(!p)return;
  opener=trigger||document.activeElement;
  const metrics=p.results.length?`<div class="detail-metrics">${p.results.map(([n,label])=>`<div><strong>${escapeHTML(n)}</strong><p>${escapeHTML(label)}</p></div>`).join('')}</div>`:'';
  const links=p.links.length?`<div class="detail-links">${p.links.map(([label,url])=>`<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)} </a>`).join('')}</div>`:'';
  const visuals=p.assets.map((a,i)=>{const info=p.assetInfo?.[i]||{width:800};const caption=info.caption;const label=caption||`${p.label}, project image ${i+1}`;const asset=`<button class="original-asset" data-gallery-index="${i}" aria-label="Enlarge ${escapeHTML(label)}"><img src="${a}" alt="${escapeHTML(label)}" loading="lazy" width="${info.width}" height="${info.height||800}" style="--native-width:${info.width}px;--retina-width:${Math.round(info.width/2)}px"></button>`;return caption?`<figure class="asset-figure ${info.kind?'asset-'+info.kind:''}">${asset}<figcaption>${escapeHTML(caption)}</figcaption></figure>`:asset}).join('');
  content.innerHTML=`<article class="project-detail"><p class="eyebrow">${escapeHTML(p.category.toUpperCase())} / ${escapeHTML(p.label.toUpperCase())}</p><h2 id="dialog-title">${escapeHTML(p.title)}</h2><p class="detail-summary">${escapeHTML(p.summary)}</p><div class="detail-role"><span>THE SCOPE</span><p>${escapeHTML(p.role)}</p></div>${metrics}<section class="detail-process"><h3>What I set out to do</h3><p>${escapeHTML(p.process||p.summary)}</p></section><section class="detail-process"><h3>The decisions behind the work</h3><p>${escapeHTML(p.decisions||p.process)}</p></section><section class="detail-outcomes"><h3>What came out of it</h3><ul>${(p.outcomes||[]).map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul></section>${links}<section class="project-visuals"><h3>The work itself</h3><div class="detail-gallery native-gallery native-${p.id}">${visuals}</div></section></article>`;
  $$('[data-gallery-index]',content).forEach(button=>button.addEventListener('click',()=>openImages(p.assets.map((src,i)=>({src,caption:p.assetInfo?.[i]?.caption||`${p.label} · ${i+1} / ${p.assets.length}`})),Number(button.dataset.galleryIndex),button)));
  if(!projectDialog.open)projectDialog.showModal();
  projectDialog.scrollTop=0;syncLock();
  history.replaceState(null,'',`#project/${p.id}`);
}
function closeProject(){projectDialog.close();history.replaceState(null,'','#work');syncLock();if(opener?.isConnected)opener.focus({preventScroll:true})}
$$('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project,button)));
$$('[data-jump-project]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();openProject(link.dataset.jumpProject,link)}));
$('.dialog-close').addEventListener('click',closeProject);
projectDialog.addEventListener('cancel',e=>{e.preventDefault();closeProject()});
projectDialog.addEventListener('click',e=>{if(e.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProject()}});

function openImages(set,index,trigger){imageSet=set;imageIndex=index;imageOpener=trigger||document.activeElement;renderImage();if(!imageDialog.open)imageDialog.showModal();syncLock()}
function renderImage(){ $('.image-stage').classList.remove('zoomed');const current=imageSet[imageIndex];$('#full-image').src=current.src;$('#full-image').alt=current.caption;$('#image-caption').textContent=current.caption;$('#image-prev').disabled=imageSet.length<2;$('#image-next').disabled=imageSet.length<2}
function changeImage(delta){imageIndex=(imageIndex+delta+imageSet.length)%imageSet.length;renderImage()}
function closeImage(){imageDialog.close();syncLock();if(imageOpener?.isConnected)imageOpener.focus({preventScroll:true})}
$('#image-prev').addEventListener('click',()=>changeImage(-1));$('#image-next').addEventListener('click',()=>changeImage(1));$('.image-close').addEventListener('click',closeImage);
imageDialog.addEventListener('cancel',e=>{e.preventDefault();closeImage()});
imageDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();changeImage(-1)}if(e.key==='ArrowRight'){e.preventDefault();changeImage(1)}});

const menu=$('.menu-toggle'),mobileNav=$('#mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));mobileNav.hidden=open;menu.textContent=open?'Menu':'Close menu'});
$$('a',mobileNav).forEach(link=>link.addEventListener('click',()=>{mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.textContent='Menu'}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.textContent='Menu';menu.focus()}});
let scrollQueued=false;
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.reading-progress').style.width=(max>0?scrollY/max*100:0)+'%';scrollQueued=false})}},{passive:true});
if(location.hash.startsWith('#project/'))openProject(location.hash.split('/')[1]);


$('#full-image').addEventListener('click',()=>$('.image-stage').classList.toggle('zoomed'));

(() => {
 const data={
 strategy:{index:'01',hook:'Give the brand a spine.',description:'I turn positioning, brand narrative, visual direction, and community building into a brand people can recognise and give a damn about.',tags:['Positioning','Brand narrative','Community'],proof:[['narc','Narc Executive'],['personal-brand','Personal branding']],note:'Choose a project to see what that looks like when it leaves the brief.'},
 writing:{index:'02',hook:'I make the copy sound like a person worth listening to.',description:'I find the human voice in your press kit, launch, email, or editorial brief and give it something worth saying.',tags:['Copywriting','Ghostwriting','Editorial strategy'],proof:[['never-settle','Mario Armstrong'],['publishing','Newsletters & publishing']],note:'Sounding like you is occasionally the entire job.'},
 content:{index:'03',hook:'The feed gets a job description.',description:'I give your content plan, platform strategy, collaborations, and community a reason to exist beyond filling another square.',tags:['Content strategy','Social media','Creator partnerships'],proof:[['arkademi','Brand Collaborations'],['nft','The 30-day event plan']],note:'I give your content a reason to exist beyond filling the calendar.'},
 making:{index:'04',hook:'The idea leaves the notes app.',description:'I take original frameworks, paid products, learning experiences, and websites through design, development, marketing, and the unglamorous bit where they have to work.',tags:['Digital products','Experience design','AI-assisted development'],proof:[['digital-products','The product ecosystem'],['masterclasses','Independent masterclasses'],['pearls-cove','Pearl’s Cove']],note:'My notes app has learned to stop making long-term plans.'}
 };
 function proof(){document.querySelectorAll('[data-cap-project]').forEach(button=>button.addEventListener('click',()=>{const project=document.querySelector(`[data-project="${button.dataset.capProject}"]`);if(project)project.click()}))}
 proof();
 document.querySelectorAll('[data-capability]').forEach(button=>button.addEventListener('click',()=>{
  const entry=data[button.dataset.capability];
  document.querySelectorAll('[data-capability]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('.capability-file').dataset.current=button.dataset.capability;
  document.querySelector('#capability-index').textContent=entry.index;
  document.querySelector('#capability-hook').textContent=entry.hook;
  document.querySelector('#capability-description').textContent=entry.description;
  document.querySelector('#capability-tags').innerHTML=entry.tags.map(tag=>`<span>${tag}</span>`).join('');
  document.querySelector('#capability-proof').innerHTML=entry.proof.map(([id,title])=>`<button data-cap-project="${id}">${title}</button>`).join('');
  document.querySelector('#capability-note').textContent=entry.note;proof();
 }));
})();
