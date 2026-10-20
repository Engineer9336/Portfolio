(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  $('#year').textContent = new Date().getFullYear();

  // Public portfolio visit counter (global count when hosted with internet access).
  // This records page visits, not unique people; refreshes may count as additional visits.
  const visitorCount = $('#visitorCount');
  if (visitorCount) {
    const counterUrl = 'https://api.counterapi.dev/v1/aryanverse-portfolio/visits/up';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch(counterUrl, { cache: 'no-store', signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Counter unavailable'); return response.json(); })
      .then(data => {
        const count = Number(data.count ?? data.value ?? data.visits);
        if (Number.isFinite(count) && count >= 0) visitorCount.textContent = count.toLocaleString();
        else throw new Error('Unexpected counter response');
      })
      .catch(() => {
        visitorCount.textContent = '—';
        visitorCount.title = 'The global counter needs an internet connection and a reachable counter service.';
      })
      .finally(() => clearTimeout(timeout));
  }

  // Mobile navigation
  const nav = $('#mainNav'), menu = $('#mobileMenu');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '×' : '☰'; });
  $$('#mainNav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.textContent='☰'; }));

  // Theme switch (persisted locally)
  const themeButton = $('#themeToggle');
  if (localStorage.getItem('aryan-portfolio-theme') === 'light') document.body.classList.add('light-mode');
  const updateThemeIcon = () => themeButton.textContent = document.body.classList.contains('light-mode') ? '☾' : '☼';
  updateThemeIcon();
  themeButton.addEventListener('click', () => { document.body.classList.toggle('light-mode'); localStorage.setItem('aryan-portfolio-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark'); updateThemeIcon(); });

  // Project category filters
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.filter;
    $$('.show-card').forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter); });
  }));

  // Horizontal row controls
  $$('.row-arrow').forEach(button => button.addEventListener('click', () => {
    const row = document.getElementById(button.dataset.row);
    row.scrollBy({left: Number(button.dataset.dir) * Math.max(260, row.clientWidth * .72), behavior:'smooth'});
  }));

  // Project detail modal
  const modal = $('#detailModal'); let lastFocused = null;
  function openDetails(card) {
    lastFocused = document.activeElement;
    $('#detailTitle').textContent = card.dataset.title;
    $('#detailDesc').textContent = card.dataset.desc;
    $('#detailTech').replaceChildren(...card.dataset.tech.split('·').map(t => { const span=document.createElement('span'); span.textContent=t.trim(); return span; }));
    const links = $('#detailLinks'); links.replaceChildren();
    if (card.dataset.github) { const a=document.createElement('a'); a.href=card.dataset.github; a.target='_blank'; a.rel='noopener'; a.textContent='GitHub ↗'; links.append(a); }
    if (card.dataset.live) { const a=document.createElement('a'); a.href=card.dataset.live; a.target='_blank'; a.rel='noopener'; a.className='secondary'; a.textContent='Live demo ↗'; links.append(a); }
    if (!links.children.length) links.textContent='Project links will be added soon.';
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; $('#modalClose').focus();
  }
  function closeDetails() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; if(lastFocused) lastFocused.focus(); }
  $$('.show-card').forEach(card => { card.addEventListener('click', () => openDetails(card)); card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(card);} }); });
  $('#modalClose').addEventListener('click', closeDetails);
  modal.addEventListener('click', e => { if(e.target.dataset.close === 'true') closeDetails(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && modal.classList.contains('open')) closeDetails(); });

  // Smooth 3D tilt on desktop pointers, disabled for touch/reduced-motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width; const y=(e.clientY-r.top)/r.height; card.style.transform=`perspective(850px) rotateX(${(0.5-y)*5}deg) rotateY(${(x-0.5)*6}deg) translateY(-3px)`; });
      card.addEventListener('pointerleave', () => card.style.transform='');
    });
  }

  // Active section tracking and scroll-to-top
  const topbar = $('#topbar'), backTop = $('#backTop');
  window.addEventListener('scroll', () => { backTop.classList.toggle('visible', window.scrollY > 500); topbar.classList.toggle('scrolled', window.scrollY > 20); }, {passive:true});
  backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { $$('#mainNav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`)); } }), {rootMargin:'-35% 0px -55% 0px'});
  $$('main section[id]').forEach(s => sectionObserver.observe(s));

  // Scroll reveal for content blocks
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}), {threshold:.12});
  $$('.content-section,.contact-inner,.timeline-item,.certificate-row a').forEach(el => {el.classList.add('reveal'); revealObserver.observe(el);});

  // CTA buttons
  $('#aboutMeBtn').addEventListener('click', () => $('#about').scrollIntoView({behavior:'smooth'}));
  const toast = $('#toast'); let toastTimer;
  function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
  $('#copyEmail').addEventListener('click', async () => { const email='mishraaryan9336@gmail.com'; try { await navigator.clipboard.writeText(email); $('#copyStatus').textContent='Email copied to clipboard.'; showToast('Email copied: '+email); } catch { window.location.href='mailto:'+email; $('#copyStatus').textContent='Opening your email app…'; } });
})();
