'use strict';
const $ = id => document.getElementById(id);
const base = JSON.parse($('portfolio-data').textContent);
const mutableKeys = ['focus','customTitle','customPitch','company','email','startup','startupDescription','sncfDescription'];
let state = Object.fromEntries(mutableKeys.map(key => [key, base[key] || '']));
if (!base.exported) {
  try {
    const saved = JSON.parse(localStorage.getItem('anen-portfolio-v2') || '{}');
    for (const key of mutableKeys) if (typeof saved[key] === 'string') state[key] = saved[key];
  } catch {}
}
const queryFocus = new URLSearchParams(location.search).get('focus');
if (queryFocus && base.profiles[queryFocus]) { state.focus = queryFocus; state.customTitle = ''; state.customPitch = ''; }
if (!base.profiles[state.focus]) state.focus = 'all';
const escapeHTML = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const repoURL = p => 'https://github.com/anen-halimi/' + p.repo;
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3500); }
function persist() { if (base.exported) return false; try { localStorage.setItem('anen-portfolio-v2',JSON.stringify(state)); return true; } catch { return false; } }
function tags(items) { return '<div class="tags">' + items.map(t => '<span>' + escapeHTML(t) + '</span>').join('') + '</div>'; }
function visual(p) {
  const label = '<div class="visual-label"><span>AH / ' + p.number + '</span><span>' + (p.id === 'style' ? 'IMAGES DU PROJET' : 'SCHÉMA DE PRINCIPE') + '</span></div>';
  const tracks = '<i class="track"></i><i class="track second"></i>';
  const doc = type => '<div class="doc '+type+'"><div class="doc-title">'+(type ? 'SYNTHÈSE.XLSX' : 'RAPPORT.PDF')+'</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div><div class="doc-table"></div></div>';
  const visuals = {
    openspace:'<div class="screen"><div class="screen-top"><span>OPENSPACE / PEOPLE COUNTER</span><span>CAMERAS → EVENTS</span></div><div class="screen-body"><div class="camera-view">'+tracks+'<small>CAM 01 / ZONE DE PASSAGE</small></div><div class="camera-view">'+tracks+'<small>CAM 02 / ZONE DE PASSAGE</small></div></div></div>',
    bordereaux:'<div class="document-flow">'+doc('')+'<span class="flow-arrow">→</span>'+doc('excel')+'</div>',
    passagers:'<div class="dual-view"><div class="view-panel"><i class="track"></i></div><div class="view-panel two"><i class="track"></i></div><div class="match-line"></div></div>',
    style:'<div class="style-preview"><img src="'+base.images.source+'" alt="" loading="lazy"><img src="'+base.images.style+'" alt="" loading="lazy"></div>',
    incrustation:'<div class="screen insertion-screen"><div class="screen-top"><span>INCRUSTATION / CCTV TRAIN</span><span>MASK → LABEL</span></div><div class="screen-body"><div class="camera-view">'+tracks+'<small>FRAME ORIGINALE / ROI</small></div><div class="camera-view inserted">'+tracks+'<small>OBJET ADAPTÉ / YOLO</small></div></div></div>'
  };
  return '<div class="project-visual visual-'+p.id+'" aria-hidden="true">'+label+visuals[p.id]+'</div>';
}
function projectCard(p) {
  return '<article class="project-card" data-project="'+p.id+'">'+visual(p)+'<div class="project-body"><div class="project-type"><span>'+escapeHTML(p.kind)+'</span><span>'+p.number+'</span></div><h3><a href="'+repoURL(p)+'" target="_blank" rel="noopener noreferrer">'+p.title+'</a></h3><p>'+escapeHTML(p.description)+'</p>'+tags(p.tags)+'<div class="project-actions"><button class="case-button" data-case="'+p.id+'" aria-label="Lire l’étude de cas : '+escapeHTML(p.shortTitle)+'">Lire l’étude de cas <span>↗</span></button><a href="'+repoURL(p)+'" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div></article>';
}
function render() {
  const profile = base.profiles[state.focus];
  const title = state.customTitle || profile.title;
  $('role-title').textContent = title;
  $('hero-heading').innerHTML = profile.headline;
  $('hero-pitch').textContent = state.customPitch || profile.pitch;
  $('target-company').textContent = state.company ? 'Une candidature pour ' + state.company : '';
  $('target-company').hidden = !state.company;
  document.title = 'Anen Halimi — ' + title;
  document.querySelector('meta[name="description"]').content = 'Anen Halimi — ' + title + '. ' + (state.customPitch || profile.pitch);
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = state.customPitch || profile.pitch;
  document.querySelectorAll('[data-focus]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.focus === state.focus)));
  const order = profile.order.map(id => base.projects.find(p => p.id === id));
  $('project-grid').innerHTML = order.map(projectCard).join('');
  $('startup-name').textContent = state.startup || base.startup;
  $('startup-description').textContent = state.startupDescription || base.startupDescription;
  $('sncf-description').textContent = state.sncfDescription || base.sncfDescription;
  const validEmail = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(state.email);
  const contact = $('contact-primary');
  contact.href = validEmail ? 'mailto:' + state.email : base.linkedin;
  contact.innerHTML = validEmail ? 'M’écrire un e-mail <span>↗</span>' : 'Me contacter sur LinkedIn <span>↗</span>';
  if (validEmail) contact.removeAttribute('target'); else contact.target = '_blank';
  $('year').textContent = new Date().getFullYear();
}
function setFocus(focus) {
  if (!base.profiles[focus]) return;
  state.focus = focus;
  state.customTitle = '';
  state.customPitch = '';
  render();
  $('focus-announcement').textContent = 'Perspective : ' + base.profiles[focus].label + '. Les quatre projets sont classés par pertinence.';
  if (location.protocol !== 'file:') { const url = new URL(location.href); if(focus==='all')url.searchParams.delete('focus'); else url.searchParams.set('focus',focus); history.replaceState(null,'',url); }
}
document.querySelectorAll('[data-focus]').forEach(btn => btn.addEventListener('click', () => setFocus(btn.dataset.focus)));
document.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', () => { setFocus(btn.dataset.jump); $('projets').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }));
function comparison() {
  return '<figure class="comparison"><div class="comparison-stage" id="comparison-stage"><img src="'+base.images.source+'" alt="Image source : voies ferrées dans une scène simulée arborée"><img class="after" src="'+base.images.style+'" alt="Résultat du transfert de style : même scène sous une apparence hivernale"><div class="split-line"></div><div class="image-labels"><span>SCÈNE SOURCE</span><span>STYLE TRANSFÉRÉ</span></div></div><label for="compare-slider">Déplacer le curseur pour comparer les images</label><input id="compare-slider" type="range" min="0" max="100" value="50" aria-valuetext="50 % de l’image source"><figcaption>Images 00000.png issues du dépôt : data/sncf et expérience TokenFlow Plug-and-Play « a snowy weather,rain,dark scene ». Comparaison qualitative sur une image, sans mesure de précision.</figcaption></figure>';
}
function openCase(id) {
  const p = base.projects.find(p => p.id === id);
  if (!p) return;
  $('case-content').className = 'case-content';
  $('case-content').innerHTML = '<p class="overline">'+escapeHTML(p.kind)+'</p><h2 class="case-title" id="case-title">'+escapeHTML(p.shortTitle)+'</h2><p class="case-intro">'+escapeHTML(p.description)+'</p>'+tags(p.tags)+(p.id==='style'?comparison():'')+'<h3>Le problème à résoudre</h3><p>'+escapeHTML(p.challenge)+'</p><div class="pipeline" aria-label="Étapes du traitement">'+p.pipeline.map(s=>'<span>'+escapeHTML(s)+'</span>').join('<i aria-hidden="true">→</i>')+'</div><h3>Les choix techniques</h3><ul>'+p.approach.map(s=>'<li>'+escapeHTML(s)+'</li>').join('')+'</ul><h3>Ce que le projet apporte</h3><p>'+escapeHTML(p.outcome)+'</p><aside class="scope"><h3>Périmètre & enseignements</h3><p>'+escapeHTML(p.limit)+'</p></aside><div class="case-links"><a class="button primary" href="'+repoURL(p)+'" target="_blank" rel="noopener noreferrer">Explorer le dépôt ↗</a><a class="button outline" href="'+repoURL(p)+'/blob/main/'+p.file+'" target="_blank" rel="noopener noreferrer">Lire le code principal ↗</a>'+(p.id==='style'?'<a class="inline-link" href="https://github.com/omerbt/TokenFlow" target="_blank" rel="noopener noreferrer">Méthode TokenFlow originale ↗</a>':'')+'</div>';
  $('case-dialog').showModal();
  $('case-dialog').scrollTop = 0;
  if (p.id === 'style') $('compare-slider').addEventListener('input', e => { $('comparison-stage').style.setProperty('--split',e.target.value+'%');e.target.setAttribute('aria-valuetext',e.target.value+' % de l’image source'); });
}
$('project-grid').addEventListener('click', e => { const button=e.target.closest('[data-case]');if(button)openCase(button.dataset.case); });
document.querySelectorAll('.close-dialog').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target===dialog) { const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); } }));
const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => { const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');document.querySelector('nav').classList.toggle('open',open); });
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click',()=>{document.querySelector('nav').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
let scrollPending=false;
addEventListener('scroll',()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(()=>{const height=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress').style.width=(height>0?scrollY/height*100:0)+'%';scrollPending=false;});},{passive:true});
$('print-profile').addEventListener('click', () => { toast('Dans la fenêtre d’impression, choisis « Enregistrer au format PDF ».');setTimeout(()=>window.print(),100); });
function fillTailor() {
  const form=$('tailor-form'),p=base.profiles[state.focus];
  for(const key of mutableKeys)if(form.elements[key])form.elements[key].value=state[key]||'';
  form.elements.customTitle.value=state.customTitle||p.title;
  form.elements.customPitch.value=state.customPitch||p.pitch;
}
if (!base.exported) {
  $('tailor-button').addEventListener('click',()=>{fillTailor();$('save-status').textContent='';$('tailor-dialog').showModal();});
  $('focus-select').addEventListener('change', e => { const p=base.profiles[e.target.value];$('tailor-form').elements.customTitle.value=p.title;$('tailor-form').elements.customPitch.value=p.pitch; });
  function saveTailor() {
    if(!$('tailor-form').reportValidity())return false;
    for(const [key,value] of new FormData($('tailor-form')))if(mutableKeys.includes(key))state[key]=String(value).trim();
    if(!base.profiles[state.focus])state.focus='all';
    if(location.protocol!=='file:'){const url=new URL(location.href);url.searchParams.delete('focus');history.replaceState(null,'',url);}
    render();
    const stored=persist();
    $('save-status').textContent=stored?'Version enregistrée dans ce navigateur.':'Version appliquée. Exporte le fichier pour conserver tes changements.';
    return true;
  }
  $('tailor-form').addEventListener('submit',e=>{e.preventDefault();if(saveTailor()){$('tailor-dialog').close();toast('Ton portfolio est adapté à cette candidature.');$('main').scrollIntoView();}});
  const keywords = [
    ['Python','all',/\bpython\b/],['YOLO','vision',/\byolo\w*\b/],['OpenCV','vision',/\bopencv\b/],['Computer Vision','vision',/computer vision|vision par ordinateur|vision artificielle/],['Tracking','vision',/\btracking\b|suivi d.objets/],['Segmentation','vision',/segmentat/],['Calibration','vision',/calibrat/],['Multi-caméras','vision',/multi.?camera/],
    ['pandas','data',/\bpandas\b/],['OCR','data',/\bocr\b|reconnaissance optique/],['PDF / documents','data',/\bpdf\b|documentaire/],['Excel','data',/\bexcel\b/],['Flask','data',/\bflask\b/],['Automatisation','data',/automatisa|automation/],
    ['Diffusion','genai',/diffusion/],['TokenFlow','genai',/tokenflow/],['IA générative','genai',/generative|generatif|\bgenai\b/],['Édition vidéo','genai',/video editing|edition video|transfert de style/],
    ['PyTorch','all',/pytorch/],['CUDA','all',/\bcuda\b/],['Docker','all',/\bdocker\b/],['Linux','all',/\blinux\b/],['GPU','all',/\bgpu\b/]
  ];
  const unproven=[['LLM',/\bllms?\b|large language/],['RAG',/\brag\b/],['Kubernetes',/kubernetes|\bk8s\b/],['Spark',/\bspark\b/],['AWS',/\baws\b/],['Azure',/\bazure\b/],['GCP',/\bgcp\b|google cloud/],['SQL',/\bsql\b/],['Management',/management|encadrement|leadership/]];
  $('analyze-job').addEventListener('click',()=>{
    const raw=$('job-text').value.trim();
    if(raw.length<20){$('job-analysis').innerHTML='<div class="analysis-box">Ajoute le texte de l’offre, avec ses missions et compétences, pour repérer les correspondances.</div>';return;}
    const text=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const matches=keywords.filter(([, , regex])=>regex.test(text));
    const scores={vision:0,data:0,genai:0};matches.forEach(([,focus])=>{if(focus in scores)scores[focus]++;});
    const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const recommended=ranked[0][1]>0&&ranked[0][1]>ranked[1][1]?ranked[0][0]:'all';
    const needs=unproven.filter(([,regex])=>regex.test(text)).map(([label])=>label);
    const p=base.profiles[recommended];
    $('job-analysis').innerHTML='<div class="analysis-box"><h3>'+ (matches.length?'Compétences présentes dans tes projets et l’offre':'Aucune correspondance technique précise détectée')+'</h3>'+tags(matches.map(([label])=>label))+'<p>Angle suggéré : <strong>'+escapeHTML(p.label)+'</strong>. '+(recommended==='all'?'La vue d’ensemble conserve ton profil transversal.':'Les projets liés à cet angle seront présentés en premier.')+'</p>'+(needs.length?'<small>À documenter dans ton expérience avant de les revendiquer : '+needs.map(escapeHTML).join(', ')+'. Ces sujets ne sont pas établis par les projets consultés.</small>':'')+'<small>Repérage par mots-clés, sans score d’adéquation ni validation du niveau requis.</small><button class="inline-link" type="button" id="use-suggestion">Utiliser cet angle de présentation ↗</button></div>';
    $('use-suggestion').addEventListener('click',()=>{$('focus-select').value=recommended;$('focus-select').dispatchEvent(new Event('change'));toast('Angle sélectionné. Relis le titre et la présentation avant d’appliquer.');});
  });
  $('export-html').addEventListener('click',()=>{
    if(!saveTailor())return;
    const root=document.documentElement.cloneNode(true);
    root.querySelector('#portfolio-data').textContent=JSON.stringify({...base,...state,exported:true}).replace(/</g,'\\u003c');
    root.querySelector('#tailor-dialog').remove();
    root.querySelector('#tailor-button').remove();
    root.querySelector('#case-dialog').removeAttribute('open');
    root.querySelector('#case-content').replaceChildren();
    root.querySelector('#toast').textContent='';root.querySelector('#toast').classList.remove('visible');
    root.querySelector('nav').classList.remove('open');root.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
    const blob=new Blob(['<!doctype html>\n'+root.outerHTML],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    const name=(state.company||state.focus).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    a.href=url;a.download='anen-halimi-portfolio-'+(name||'data-ia')+'.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
    $('save-status').textContent='Fichier exporté avec les images et les textes. Le panneau de personnalisation est retiré de cette version.';
  });
}
render();
