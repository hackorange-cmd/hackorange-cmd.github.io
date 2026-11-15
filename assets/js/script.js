"use strict";
const config = window.HACK_ORANGE || {};
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('is-open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});
// Evita injetar HTML não confiável vindo do arquivo de configuração.
function node(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
function action(label,url,cls){const safe=safeUrl(url);if(!safe)return node('span','btn btn-muted',label+' (em breve)');const a=node('a',cls||'card-link',label+' ↗');a.href=safe;a.target='_blank';a.rel='noopener noreferrer';return a}
function renderCards(){
 const tips=document.querySelector('#tips-grid');
 (config.tips||[]).forEach(item=>{
  const card=node('article','info-card reveal');
  const title=node('h3','',item.title), description=node('p','',item.description);
  card.append(node('span','card-category',item.category||'HACK ORANGE'),node('div','icon-box',item.icon),title,description,action(item.label,item.url));tips.append(card)
 });
 const projects=document.querySelector('#projects-grid');
 (config.projects||[]).forEach(item=>{
  const card=node('article','project-card reveal');
  const art=node('div','project-visual');art.setAttribute('aria-hidden','true');art.append(node('span','project-glyph',item.icon||'</>'),node('span','project-visual-text','HACK_ORANGE // '+(item.status||'ONLINE')));
  const top=node('div','project-topline');top.append(node('span','tag',item.tag),node('span','project-status',item.status||'PROJETO'));
  card.append(art,top,node('h3','',item.title),node('p','',item.description),action(item.label,item.url));projects.append(card)
 });
}
renderCards();
const checkout=safeUrl(config.checkoutKiwify);
if(checkout){document.querySelector('#ebook-cta .btn-muted').replaceWith(action('Conhecer o e-book',checkout,'btn btn-primary'))}
const insta=safeUrl(config.instagram);
if(insta){document.querySelector('#instagram-link').replaceWith(action('Instagram',insta,'btn btn-ghost'))}
// Animações suaves com fallback sem JavaScript e preferência por movimento reduzido.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:0.12,rootMargin:'0px 0px 25px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el)})
}
// Realce do menu conforme a seção visível; não altera a rolagem das âncoras.
if('IntersectionObserver' in window){
 const ids=navLinks.map(link=>link.getAttribute('href')).filter(Boolean);
 const sections=ids.map(id=>document.querySelector(id)).filter(Boolean);
 const activeObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(!visible.length)return;
  const id='#'+visible[0].target.id;
  navLinks.forEach(link=>{if(link.getAttribute('href')===id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 },{rootMargin:'-16% 0px -58% 0px',threshold:[0,.1,.3,.6]});
 sections.forEach(section=>activeObserver.observe(section));
}
