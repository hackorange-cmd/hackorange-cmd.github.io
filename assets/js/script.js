"use strict";
const config=window.HACK_ORANGE||{};
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('is-open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});
// Create content without injecting user-editable HTML. All strings are textContent.
function node(tag,cls,txt){let el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
function action(label,url,cls){const safe=safeUrl(url);if(!safe)return node('span','btn btn-muted',label+' (em breve)');const a=node('a',cls||'card-link',label+' ↗');a.href=safe;a.target='_blank';a.rel='noopener noreferrer';return a}
function renderCards(){const tips=document.querySelector('#tips-grid');(config.tips||[]).forEach(item=>{let card=node('article','info-card');card.append(node('div','icon-box',item.icon),node('h3','',item.title),node('p','',item.description),action(item.label,item.url));tips.append(card)});const projects=document.querySelector('#projects-grid');(config.projects||[]).forEach(item=>{let card=node('article','project-card');card.append(node('span','tag',item.tag),node('h3','',item.title),node('p','',item.description),action(item.label,item.url));projects.append(card)})}
renderCards();
const checkout=safeUrl(config.checkoutKiwify);if(checkout){const box=document.querySelector('#ebook-cta');const placeholder=box.querySelector('.btn-muted');placeholder.replaceWith(action('Conhecer o e-book',checkout,'btn btn-primary'))}
const insta=safeUrl(config.instagram);if(insta){document.querySelector('#instagram-link').replaceWith(action('Instagram',insta,'btn btn-ghost'))}
