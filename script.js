// Sentrallis Peças — JavaScript Principal

// ===== SCROLL AO TOPO NO F5 / CARREGAMENTO =====
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ===== LOADER — 3 segundos =====
const loader      = document.getElementById('loader');
const loaderBarra = document.getElementById('loaderBarra');

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    loaderBarra.style.width = '100%';
  });
});

setTimeout(() => {
  loader.classList.add('saindo');
  document.body.classList.add('site-pronto');
  setTimeout(() => loader.remove(), 750);
}, 3000);

// ===== BARRA DE PROGRESSO DE SCROLL =====
const barraProgresso = document.createElement('div');
barraProgresso.id = 'progresso-scroll';
document.body.prepend(barraProgresso);

function atualizarProgresso() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
  barraProgresso.style.width = pct + '%';
}

// ===== HEADER — adicionar classe ao rolar =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('rolado', window.scrollY > 50);
  atualizarProgresso();
}, { passive: true });

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = document.querySelectorAll('.nav-link');

function fecharMenu() {
  navMenu.classList.remove('aberto');
  menuToggle.classList.remove('ativo');
  menuToggle.setAttribute('aria-expanded', 'false');
  navMenu.setAttribute('aria-hidden', 'true');
}

menuToggle.addEventListener('click', () => {
  const estaAberto = navMenu.classList.toggle('aberto');
  menuToggle.classList.toggle('ativo', estaAberto);
  menuToggle.setAttribute('aria-expanded', String(estaAberto));
  navMenu.setAttribute('aria-hidden', String(!estaAberto));
});

navLinks.forEach(link => link.addEventListener('click', fecharMenu));

document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) fecharMenu();
});

// ===== LINK ATIVO NO DESKTOP NAV =====
const secoes       = document.querySelectorAll('section[id]');
const linksDesktop = document.querySelectorAll('.desktop-nav a');

function atualizarLinkAtivo() {
  const scrollY = window.scrollY + 100;
  secoes.forEach(secao => {
    const topo   = secao.offsetTop;
    const altura = secao.offsetHeight;
    const id     = secao.getAttribute('id');
    if (scrollY >= topo && scrollY < topo + altura) {
      linksDesktop.forEach(link => {
        link.classList.toggle('ativo', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });

// ===== ANIMAÇÕES DE ENTRADA (Intersection Observer) =====
const observadorFade = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) entrada.target.classList.add('visivel');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll(
  '.produto-card, .dep-card, .servico-card, .contato-card, .mvv-card, .mercado-item, .sobre-num'
).forEach(el => {
  el.classList.add('fade-in');
  observadorFade.observe(el);
});

// ===== UNDERLINE ANIMADO NOS TÍTULOS DAS SEÇÕES =====
const observadorTitulo = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('linha-ativa');
      observadorTitulo.unobserve(entrada.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.cabecalho-secao h2').forEach(h2 => {
  observadorTitulo.observe(h2);
});

// ===== GALERIA — INSERIR IMAGENS VIA JS =====
const galeriaWrapper = document.getElementById('galeriaWrapper');
const galeriaAviso   = document.getElementById('galeriaAviso');
const imagensGaleria = [
  'midia_1.jpg',
  'midia_2.jpg',
  'midia_3.jpg',
  'midia_4.jpg',
  'midia_5.jpg',
  'midia_6.jpg',
  'midia_7.jpg',
  'midia_8.jpg',
  'midia_9.jpg',
  'midia_10.jpg',
  'midia_11.jpg',
  'midia_12.png',
  'midia_13.png',
  'midia_14.jpg',
  'midia_15.jpg',
];

if (imagensGaleria.length > 0) {
  imagensGaleria.forEach((nome, i) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="galeria-item">
        <img src="images/${nome}" alt="Sentrallis Peças — imagem ${i + 1}" loading="lazy">
      </div>`;
    galeriaWrapper.appendChild(slide);
  });

  // Inicia o Swiper somente se há imagens
  new Swiper('.galeria-swiper', {
    loop: true,
    speed: 600,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    slidesPerView: 1.2,
    spaceBetween: 16,
    centeredSlides: true,
    navigation: {
      prevEl: '.galeria-prev',
      nextEl: '.galeria-next',
    },
    breakpoints: {
      600: { slidesPerView: 2,   spaceBetween: 20, centeredSlides: false },
      900: { slidesPerView: 3,   spaceBetween: 24, centeredSlides: false },
      1200:{ slidesPerView: 4,   spaceBetween: 24, centeredSlides: false },
    },
  });

} else {
  galeriaAviso.classList.add('visivel');
}

// ===== LIGHTBOX =====
const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxContador = document.getElementById('lightboxContador');
const lightboxFechar   = document.getElementById('lightboxFechar');
const lightboxPrev     = document.getElementById('lightboxPrev');
const lightboxNext     = document.getElementById('lightboxNext');

let galeriaImagens = [];
let indiceAtual    = 0;

function coletarImagens() {
  galeriaImagens = Array.from(document.querySelectorAll('.galeria-item img'));
}

function abrirLightbox(indice) {
  coletarImagens();
  if (!galeriaImagens.length) return;
  indiceAtual = indice;
  const img = galeriaImagens[indiceAtual];

  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.92)';

  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxContador.textContent = `${indiceAtual + 1} / ${galeriaImagens.length}`;
    lightboxImg.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
  }, 150);

  lightbox.classList.add('aberto');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-aberto');
}

function fecharLightbox() {
  lightbox.classList.remove('aberto');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-aberto');
}

function navegar(direcao) {
  indiceAtual = (indiceAtual + direcao + galeriaImagens.length) % galeriaImagens.length;
  abrirLightbox(indiceAtual);
}

// Delegação de evento para imagens inseridas dinamicamente
document.addEventListener('click', (e) => {
  const item = e.target.closest('.galeria-item');
  if (item) {
    coletarImagens();
    const idx = galeriaImagens.indexOf(item.querySelector('img'));
    if (idx !== -1) abrirLightbox(idx);
  }
});

lightboxFechar.addEventListener('click', fecharLightbox);
lightboxPrev.addEventListener('click', () => navegar(-1));
lightboxNext.addEventListener('click', () => navegar(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxImg.parentElement) fecharLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('aberto')) return;
  if (e.key === 'Escape')     fecharLightbox();
  if (e.key === 'ArrowLeft')  navegar(-1);
  if (e.key === 'ArrowRight') navegar(1);
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) navegar(diff > 0 ? 1 : -1);
}, { passive: true });

// ===== RIPPLE NOS BOTÕES =====
function criarRipple(e) {
  const btn = e.currentTarget;
  const old = btn.querySelector('.ripple');
  if (old) old.remove();

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);

  setTimeout(() => ripple.remove(), 700);
}

document.querySelectorAll(
  '.btn-primario, .btn-contorno, .btn-whatsapp-cta, .header-whatsapp'
).forEach(btn => {
  btn.addEventListener('click', criarRipple);
});

// ===== MODAL WHATSAPP =====
const waModal      = document.getElementById('wa-modal');
const waModalFechar = document.getElementById('waModalFechar');

function abrirWaModal(e) {
  e.preventDefault();
  waModal.classList.add('ativo');
  waModal.setAttribute('aria-hidden', 'false');
}

waModalFechar.addEventListener('click', fecharWaModal);
waModal.addEventListener('click', function(e) {
  if (e.target === waModal) fecharWaModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') fecharWaModal();
});

function fecharWaModal() {
  waModal.classList.remove('ativo');
  waModal.setAttribute('aria-hidden', 'true');
}
