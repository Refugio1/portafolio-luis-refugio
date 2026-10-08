const packagingItems = [
  {
    id: 'anejo-cristalino',
    edition: 'Añejo Cristalino',
    badge: 'Añejo Cristalino',
    name: 'Añejo Cristalino',
    fullName: 'Tequila Raíces de Orgullo — Añejo Cristalino',
    tagline: 'Negro Obsidiana & Cobre · Bajorrelieve',
    color: '#0c0e0c',
    glow: 'rgba(255, 255, 255, 0.06)',
    accent: '#d8dfd0',
    description: 'Caja rígida premium en acabado negro obsidiana mate, intervenida con foil de cobre metálico en caliente y patrones de grecas sagradas wixárikas en bajorrelieve brillante. La ventana circular calada con ribete metálico exhibe con elegancia la transparencia y pureza del tequila cristalino.',
    client: 'Raíces de Orgullo',
    volume: '700 ml · 40% Alc. Vol. (80 Proof)',
    finishes: 'Hot Stamping Cobre & Barniz UV',
    boxType: 'Caja rígida con ventana troquelada',
    tags: ['Caja Rígida Premium', 'Foil Cobre', 'Ventana Troquelada', 'Arte Wixárika', 'Negro Obsidiana', 'Tequila 100% Agave'],
    src: 'assets/packaging/caja-wixarika-anejo-cristalino.png?v=2'
  },
  {
    id: 'anejo',
    edition: 'Añejo',
    badge: 'Añejo Tradicional',
    name: 'Añejo Tradicional',
    fullName: 'Tequila Raíces de Orgullo — Añejo',
    tagline: 'Chocolate & Oro Rosado · Trama Sagrada',
    color: '#a6582d',
    glow: 'rgba(196, 98, 44, 0.22)',
    accent: '#f2a66e',
    description: 'Diseño en cartulina rígida color tabaco/chocolate con textura de lino fino y aplicaciones en hot stamping oro rosado cobrizo. Las franjas laterales incorporan el bordado tradicional huichol con rombos concéntricos, rindiendo tributo a la paciencia de su añejamiento en barricas.',
    client: 'Raíces de Orgullo',
    volume: '700 ml · 40% Alc. Vol. (80 Proof)',
    finishes: 'Foil Oro Rosado & Textura Lino',
    boxType: 'Caja rígida de lujo con bisel metalizado',
    tags: ['Acabado Chocolate', 'Foil Oro Rosado', 'Textura Textil', 'Iconografía de Agave', 'Troquel Circular', 'Hecho en México'],
    src: 'assets/packaging/caja-wixarika-anejo.png'
  },
  {
    id: 'extra-anejo',
    edition: 'Extra Añejo',
    badge: 'Extra Añejo Reserva',
    name: 'Extra Añejo',
    fullName: 'Tequila Raíces de Orgullo — Extra Añejo',
    tagline: 'Marfil Artesanal & Verde Esmeralda',
    color: '#3d6350',
    glow: 'rgba(78, 142, 107, 0.22)',
    accent: '#82c09b',
    description: 'Propuesta visual sobre cartulina artesanal texturizada color marfil y arena, con tipografía en relieve verde esmeralda y acentos en oro viejo. Los patrones diamantados wixárikas cubren los laterales en una serigrafía sutil de alta precisión, evocando la excelencia de una reserva única.',
    client: 'Raíces de Orgullo',
    volume: '700 ml · 40% Alc. Vol. (80 Proof)',
    finishes: 'Serigrafía Esmeralda & Oro Viejo',
    boxType: 'Caja rígida marfil texturizado con marco dorado',
    tags: ['Papel Marfil Texturizado', 'Verde Esmeralda', 'Oro Viejo', 'Reserva Especial', 'Patrones Diamantados', '100% Agave Azul'],
    src: 'assets/packaging/caja-wixarika-extra-anejo.png'
  }
];

let packagingCurrent = 0;
const packagingShowcase = document.querySelector('#packaging-showcase');
const packagingSelector = document.querySelector('#packaging-selector');
const packagingDialog = document.querySelector('#packaging-dialog');
const packagingTiltCard = document.querySelector('#packaging-tilt-card');
const packagingReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (packagingSelector && packagingShowcase) {
  // Render selector cards
  packagingItems.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'packaging-choice';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `Ver packaging de ${item.fullName}`);

    const topBar = document.createElement('div');
    topBar.className = 'packaging-choice-top';
    const num = document.createElement('span');
    num.className = 'packaging-choice-num';
    num.textContent = `0${index + 1} / EDICIÓN`;
    const badge = document.createElement('span');
    badge.className = 'packaging-choice-badge';
    badge.textContent = item.edition;
    topBar.append(num, badge);

    const body = document.createElement('div');
    body.className = 'packaging-choice-body';

    const thumb = document.createElement('div');
    thumb.className = 'packaging-choice-thumb';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = '';
    img.loading = 'lazy';
    img.width = 64;
    img.height = 64;
    thumb.append(img);

    const info = document.createElement('div');
    info.className = 'packaging-choice-info';
    const title = document.createElement('span');
    title.className = 'packaging-choice-title';
    title.textContent = item.name;
    const tagline = document.createElement('span');
    tagline.className = 'packaging-choice-tagline';
    tagline.textContent = item.tagline;
    info.append(title, tagline);

    body.append(thumb, info);
    button.append(topBar, body);

    button.addEventListener('click', () => {
      selectPackaging(index);
    });

    packagingSelector.append(button);
  });

  function selectPackaging(index) {
    packagingCurrent = (index + packagingItems.length) % packagingItems.length;
    const item = packagingItems[packagingCurrent];

    packagingShowcase.style.setProperty('--pack-color', item.color);
    packagingShowcase.style.setProperty('--pack-glow', item.glow);
    packagingShowcase.style.setProperty('--pack-accent', item.accent);

    const posEl = document.querySelector('#packaging-position');
    if (posEl) posEl.textContent = `0${packagingCurrent + 1} / 0${packagingItems.length}`;

    const badgeEl = document.querySelector('#packaging-badge-edition');
    if (badgeEl) badgeEl.textContent = item.badge;

    const heroImg = document.querySelector('#packaging-hero-img');
    if (heroImg) {
      heroImg.src = item.src;
      heroImg.alt = `Caja rígida Tequila Raíces de Orgullo ${item.edition}`;
      if (!packagingReducedMotion.matches) {
        heroImg.animate(
          [{ opacity: 0.35, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 340, easing: 'ease-out' }
        );
      }
    }

    const nameEl = document.querySelector('#packaging-name');
    if (nameEl) nameEl.textContent = item.name;

    const descEl = document.querySelector('#packaging-description');
    if (descEl) descEl.textContent = item.description;

    const tagsContainer = document.querySelector('#packaging-tags');
    if (tagsContainer) {
      tagsContainer.replaceChildren();
      item.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.append(span);
      });
    }

    const clientEl = document.querySelector('#spec-client');
    if (clientEl) clientEl.textContent = item.client;

    const volumeEl = document.querySelector('#spec-volume');
    if (volumeEl) volumeEl.textContent = item.volume;

    const finishesEl = document.querySelector('#spec-finishes');
    if (finishesEl) finishesEl.textContent = item.finishes;

    const boxEl = document.querySelector('#spec-box');
    if (boxEl) boxEl.textContent = item.boxType;

    const openZoomBtn = document.querySelector('#packaging-open-zoom');
    if (openZoomBtn) openZoomBtn.setAttribute('aria-label', `Ampliar detalle del empaque de ${item.fullName}`);

    [...packagingSelector.children].forEach((btn, i) => {
      btn.setAttribute('aria-pressed', String(i === packagingCurrent));
    });
  }

  // Arrows navigation
  const prevBtn = document.querySelector('#packaging-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => selectPackaging(packagingCurrent - 1));

  const nextBtn = document.querySelector('#packaging-next');
  if (nextBtn) nextBtn.addEventListener('click', () => selectPackaging(packagingCurrent + 1));

  // Keyboard navigation on selector
  packagingSelector.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') selectPackaging(0);
    else if (event.key === 'End') selectPackaging(packagingItems.length - 1);
    else selectPackaging(packagingCurrent + (event.key === 'ArrowRight' ? 1 : -1));
    packagingSelector.children[packagingCurrent].focus();
  });

  // Tilt interactive 3D effect
  if (packagingTiltCard) {
    packagingTiltCard.addEventListener('pointermove', event => {
      if (packagingReducedMotion.matches || event.pointerType !== 'mouse') return;
      const rect = packagingTiltCard.getBoundingClientRect();
      const tiltX = -((event.clientY - rect.top - rect.height / 2) / rect.height) * 9;
      const tiltY = ((event.clientX - rect.left - rect.width / 2) / rect.width) * 11;
      packagingTiltCard.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      packagingTiltCard.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    });

    packagingTiltCard.addEventListener('pointerleave', () => {
      packagingTiltCard.style.setProperty('--tilt-x', '0deg');
      packagingTiltCard.style.setProperty('--tilt-y', '0deg');
    });
  }

  // Touch swipe support on showcase
  let packagingTouchStart = null;
  packagingShowcase.addEventListener('touchstart', event => {
    packagingTouchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }, { passive: true });

  packagingShowcase.addEventListener('touchend', event => {
    if (!packagingTouchStart) return;
    const dx = event.changedTouches[0].clientX - packagingTouchStart.x;
    const dy = event.changedTouches[0].clientY - packagingTouchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      selectPackaging(dx < 0 ? packagingCurrent + 1 : packagingCurrent - 1);
    }
    packagingTouchStart = null;
  }, { passive: true });

  // Lightbox Dialog
  function openPackagingModal() {
    if (!packagingDialog) return;
    const item = packagingItems[packagingCurrent];
    const titleEl = document.querySelector('#packaging-dialog-title');
    if (titleEl) titleEl.textContent = item.fullName;

    const descEl = document.querySelector('#packaging-dialog-desc');
    if (descEl) descEl.textContent = item.description;

    const dialogImg = document.querySelector('#packaging-dialog-image');
    if (dialogImg) {
      dialogImg.src = item.src;
      dialogImg.alt = `Diseño de empaque en alta resolución: ${item.fullName}`;
    }

    const tagsContainer = document.querySelector('#packaging-dialog-tags');
    if (tagsContainer) {
      tagsContainer.replaceChildren();
      item.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.append(span);
      });
    }

    packagingDialog.showModal();
    packagingDialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  }

  const openZoomTrigger = document.querySelector('#packaging-open-zoom');
  if (openZoomTrigger) openZoomTrigger.addEventListener('click', openPackagingModal);

  const inspectBtn = document.querySelector('#packaging-inspect-btn');
  if (inspectBtn) inspectBtn.addEventListener('click', openPackagingModal);

  if (packagingDialog) {
    packagingDialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });

    packagingDialog.addEventListener('click', event => {
      if (event.target === packagingDialog) {
        const r = packagingDialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
          packagingDialog.close();
        }
      }
    });

    packagingDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        selectPackaging(packagingCurrent + (event.key === 'ArrowRight' ? 1 : -1));
        openPackagingModal();
      }
    });
  }

  // Initialize
  selectPackaging(0);
}
