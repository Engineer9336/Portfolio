import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './supabase-config.js';
if (isSupabaseConfigured()) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try {
    const { data: projects } = await supabase.from('projects').select('*').order('created_at',{ascending:false});
    if (projects?.length) {
      const row = document.querySelector('#projectRow');
      projects.forEach((item,i) => {
        if (document.querySelector(`[data-db-id="${item.id}"]`)) return;
        const card=document.createElement('article'); card.className='show-card tilt-card'; card.tabIndex=0; card.setAttribute('role','button'); card.dataset.dbId=item.id;
        Object.assign(card.dataset,{category:item.category||'ai',title:item.title||'Project',desc:item.description||'',tech:item.technologies||'',github:item.github_url||'',live:item.demo_url||''});
        card.innerHTML=`<div class="card-art">${item.image_url?`<img src="${esc(item.image_url)}" alt="${esc(item.title)}" loading="lazy">`:''}<span class="card-index">${String(i+5).padStart(2,'0')}</span><div class="card-hover-actions"><span>▶</span><span>View details</span></div></div><div class="show-info"><div class="show-meta"><span class="match">${esc(item.badge||'PROJECT')}</span><span>${esc((item.category||'').toUpperCase())}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.subtitle||item.technologies||'Project')}</p></div>`;
        row.append(card);
      });
      document.querySelectorAll('.show-card').forEach(card=>{ if(!card.dataset.dbBound){card.dataset.dbBound='1'; card.addEventListener('click',()=>{document.querySelector('#detailTitle').textContent=card.dataset.title;document.querySelector('#detailDesc').textContent=card.dataset.desc;document.querySelector('#detailTech').replaceChildren(...(card.dataset.tech||'').split('·').map(t=>{const s=document.createElement('span');s.textContent=t.trim();return s;}));const links=document.querySelector('#detailLinks');links.replaceChildren();[['github','GitHub ↗'],['live','Live demo ↗']].forEach(([k,label])=>{if(card.dataset[k]){const a=document.createElement('a');a.href=card.dataset[k];a.target='_blank';a.rel='noopener';a.textContent=label;links.append(a);}});document.querySelector('#detailModal').classList.add('open');document.querySelector('#detailModal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});}});
    }
    const { data: certs } = await supabase.from('certificates').select('*').order('created_at',{ascending:false});
    if(certs?.length){const row=document.querySelector('.certificate-row');certs.forEach(c=>{const a=document.createElement('a');a.href=c.verification_url||c.file_url||'#';a.target='_blank';a.rel='noopener';a.innerHTML=`<span>${esc(c.category||'CERTIFICATE')}</span><b>${esc(c.title)}</b><small>${esc(c.issuer||'')}${c.verification_url?' · Verify ↗':' ↗'}</small>`;row.append(a);});}
  } catch(e){console.warn('Portfolio dynamic content is not configured yet.',e);}
}
