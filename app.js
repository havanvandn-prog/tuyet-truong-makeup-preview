(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const params = new URLSearchParams(location.search);
  const variants = {
    tiec: { title: 'Makeup Đi Tiệc\ntại Đà Nẵng', tagline: 'Trong trẻo hay sắc sảo, chọn kiểu hợp bạn', description: 'Tư vấn màu makeup và kiểu tóc phù hợp gương mặt, trang phục và buổi tiệc. Có nhận tận nơi tại Đà Nẵng.', price: 'Makeup tiệc từ 350.000đ', note: 'Chưa gồm tóc · Tổng chi phí được trao đổi trước khi chốt', image: 2, service: 'tiec' },
    'co-dau': { title: 'Trang Điểm Cô Dâu\ntại Đà Nẵng', tagline: 'Tôn nét riêng trong ngày cưới', description: 'Tuyết Trương trực tiếp thực hiện với 9 năm kinh nghiệm. Tư vấn makeup và tóc hài hòa với gương mặt, áo dài hoặc váy cưới.', price: '1.800.000–2.000.000đ', note: 'Gồm tóc, mi, phụ kiện, tặng lens · Dặm lại tính riêng', image: 1, service: 'co-dau' },
    'ky-yeu': { title: 'Makeup Kỷ Yếu\ntại Đà Nẵng', tagline: 'Tươi trẻ, đúng gu cho ngày lưu dấu', description: 'Chọn kiểu makeup phù hợp áo dài, lễ phục và phong cách bộ ảnh. Có lựa chọn makeup riêng hoặc kèm làm tóc.', price: 'Makeup kỷ yếu từ 350.000đ', note: 'Chưa gồm tóc · Có lựa chọn kèm làm tóc', image: 3, service: 'ky-yeu' },
    'sinh-nhat': { title: 'Makeup Sinh Nhật\ntại Đà Nẵng', tagline: 'Một diện mạo đúng gu cho ngày của bạn', description: 'Từ ngọt ngào đến cá tính, cùng Tuyết Trương chọn kiểu makeup phù hợp trang phục và phong cách buổi sinh nhật.', price: 'Tư vấn giá theo kiểu bạn chọn', note: 'Trao đổi tổng chi phí trước khi chốt lịch', image: 2, service: 'sinh-nhat' },
    'tan-noi': { title: 'Makeup Tận Nơi\ntại Đà Nẵng', tagline: 'Chọn kiểu bạn thích, trao đổi nơi hẹn', description: 'Nhận makeup tận nơi trong Đà Nẵng. Gửi dịch vụ, địa điểm và giờ cần hoàn thành để được tư vấn lịch và tổng chi phí.', price: 'Báo giá theo dịch vụ & địa điểm', note: 'Trên 4 km từ cơ sở: phí di chuyển 50.000–100.000đ', image: 0, service: '' }
  };
  const photos = [
    { src: 'assets/shop-soft.webp', name: 'Trong trẻo' },
    { src: 'assets/shop-bridal.webp', name: 'Cô dâu' },
    { src: 'assets/shop-event.webp', name: 'Sắc sảo' },
    { src: 'assets/shop-aodai.webp', name: 'Makeup cùng áo dài' },
    { src: 'assets/shop-pink.webp', name: 'Tông hồng' },
    { src: 'assets/shop-bridal-alt.webp', name: 'Cô dâu thanh lịch' },
    { src: 'assets/shop-aodai-alt.webp', name: 'Tông nhẹ nhàng' },
    { src: 'assets/shop-event-alt.webp', name: 'Makeup dự tiệc' }
  ];
  const albumSets = { all: [0, 1, 2], 'trong-treo': [6, 3, 5], 'ngot-ngao': [0, 4, 1], 'sac-sao': [1, 2, 7] };
  let activeTab = 'all';
  let lightboxIndex = 0;
  let lightboxPhotos = [];
  let lightboxOpener;
  const variantKey = Object.hasOwn(variants, params.get('dich-vu')) ? params.get('dich-vu') : 'all';
  const variant = variants[variantKey];
  function setPhoto(image, photoIndex) {
    const photo = photos[photoIndex];
    image.src = photo.src;
    image.alt = photo.name;
  }
  function track(event, details = {}) {
    if (config.analyticsEnabled && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, landing_variant: variantKey, ...details });
    }
  }
  function setAlbum(tab, focus = false) {
    if (!Object.hasOwn(albumSets, tab)) tab = 'all';
    activeTab = tab;
    $$('[data-tab]').forEach(button => {
      const selected = button.dataset.tab === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    $('#album-panel').setAttribute('aria-labelledby', `tab-${tab}`);
    $('#album-panel').classList.toggle('is-filtered', tab !== 'all');
    $$('.gallery-card').forEach((card, i) => {
      const photoIndex = albumSets[tab][i];
      const photo = photos[photoIndex];
      card.dataset.gallery = String(photoIndex);
      card.setAttribute('aria-label', `Xem lớn mẫu ${photo.name}`);
      setPhoto(card.querySelector('img'), photoIndex);
    });

  }
  if (variant) {
    $('#hero-title').replaceChildren();
    variant.title.split('\n').forEach((line, i) => {
      if (i) $('#hero-title').append(document.createElement('br'));
      $('#hero-title').append(document.createTextNode(line));
    });
    $('#hero-tagline').textContent = variant.tagline;
    $('#hero-description').textContent = variant.description;
    $('#hero-price').textContent = variant.price;
    setPhoto($('#hero-image'), variant.image);
    if (variant.image !== 0) {
      $('#hero-portrait').hidden = true;
      $('#hero-image').removeAttribute('hidden');
    }
    $('#service').value = variant.service;
    document.title = `${variant.title.replace('\n', ' ')} | Tuyết Trương Makeup`;
    $('meta[name="description"]').content = variant.description;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = variant.description;
    const priority = document.querySelector(`[data-price="${variant.service}"]`);
    if (priority) { priority.classList.add('is-priority'); priority.parentElement.prepend(priority); }
  }
  setAlbum('all');
  $$('[data-tab]').forEach(button => {
    button.addEventListener('click', () => { setAlbum(button.dataset.tab); track('album_tab_selected', { album: activeTab }); });
    button.addEventListener('keydown', event => {
      const tabs = $$('[data-tab]'); const i = tabs.indexOf(button);
      let target;
      if (event.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) { event.preventDefault(); setAlbum(target.dataset.tab, true); }
    });
  });
  const feedbackTrack = $('#feedback-track');
  const feedbackSlides = [...feedbackTrack.children];
  feedbackSlides.forEach(slide => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    feedbackTrack.append(copy);
  });
  const feedbackOffset = index => feedbackTrack.children[index].offsetLeft - feedbackTrack.children[0].offsetLeft;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function moveFeedback(direction) {
    const step = feedbackOffset(1);
    const total = feedbackSlides.length;
    let index = Math.round(feedbackTrack.scrollLeft / step) % total;
    if (index === 0 && direction < 0) feedbackTrack.scrollLeft = feedbackOffset(total);
    else if (feedbackTrack.scrollLeft >= feedbackOffset(total) - 1) feedbackTrack.scrollLeft = feedbackOffset(index);
    index = Math.round(feedbackTrack.scrollLeft / step);
    feedbackTrack.scrollTo({ left: feedbackOffset(index + direction), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  $$('[data-feedback-step]').forEach(button => button.addEventListener('click', () => {
    moveFeedback(Number(button.dataset.feedbackStep));
  }));
  const feedbackSlider = feedbackTrack.closest('#feedback');
  setInterval(() => {
    const rect = feedbackTrack.getBoundingClientRect();
    if (!reducedMotion.matches && !document.hidden && rect.bottom > 0 && rect.top < innerHeight &&
        !feedbackSlider.matches(':hover, :focus-within')) moveFeedback(1);
  }, 4000);
  let feedbackDrag;
  feedbackTrack.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    feedbackDrag = { x: event.clientX, left: feedbackTrack.scrollLeft };
    feedbackTrack.setPointerCapture(event.pointerId);
    feedbackTrack.classList.add('is-dragging');
    feedbackTrack.focus({ preventScroll: true });
    event.preventDefault();
  });
  feedbackTrack.addEventListener('pointermove', event => {
    if (feedbackDrag && event.pointerType === 'mouse') {
      feedbackTrack.scrollLeft = feedbackDrag.left + feedbackDrag.x - event.clientX;
    }
  });
  feedbackTrack.addEventListener('lostpointercapture', () => {
    feedbackDrag = null;
    feedbackTrack.classList.remove('is-dragging');
  });
  const background = params.get('nen-form');
  if (['voan', 'studio', 'hau-truong'].includes(background)) $('#lien-he').dataset.background = background;
  const menuButton = $('.menu-toggle');
  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); $('#main-nav').classList.remove('is-open'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    $('#main-nav').classList.toggle('is-open', open);
  });
  $$('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  $$('[data-service]').forEach(link => link.addEventListener('click', () => { $('#service').value = link.dataset.service; }));
  const lightbox = $('#lightbox');
  function renderLightbox() {
    const photo = lightboxPhotos[lightboxIndex];
    $('#lightbox-image').src = photo.src;
    $('#lightbox-image').alt = photo.name;
    $('#lightbox-title').textContent = photo.name;
    $('#lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;
  }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    lightboxOpener = button;
    lightboxPhotos = albumSets[activeTab].map(index => photos[index]);
    lightboxIndex = Math.max(0, albumSets[activeTab].indexOf(Number(button.dataset.gallery)));
    renderLightbox(); lightbox.showModal();
  }));
  const occasionCards = $$('.occasion-card');
  occasionCards.forEach((card, index) => card.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    lightboxOpener = card;
    lightboxPhotos = occasionCards.map(item => ({
      src: item.querySelector('img').src,
      name: item.querySelector('.occasion-caption').textContent.trim(),
      service: item.dataset.service
    }));
    lightboxIndex = index;
    renderLightbox();
    lightbox.showModal();
  }));
  function movePhoto(direction) { lightboxIndex = (lightboxIndex + direction + lightboxPhotos.length) % lightboxPhotos.length; renderLightbox(); }
  $('#previous-image').addEventListener('click', () => movePhoto(-1));
  $('#next-image').addEventListener('click', () => movePhoto(1));
  lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowRight') movePhoto(1); if (event.key === 'ArrowLeft') movePhoto(-1); });
  $('#lightbox-consult').addEventListener('click', () => {
    const selectedPhoto = lightboxPhotos[lightboxIndex];
    if (selectedPhoto.service) $('#service').value = selectedPhoto.service;
    const message = $('#message');
    const note = `Mẫu makeup quan tâm: ${lightboxPhotos[lightboxIndex].name}`;
    const nextMessage = message.value ? `${message.value}\n${note}` : note;
    if (!message.value.split('\n').includes(note) && nextMessage.length <= message.maxLength) {
      message.value = nextMessage;
    }
    lightboxOpener = null;
    lightbox.close();
    $('#name').focus({ preventScroll: true });
  });
  lightbox.addEventListener('close', () => lightboxOpener?.focus());
  $$('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
  });
  function validUrl(value, domains) {
    try { const url = new URL(value); return url.protocol === 'https:' && domains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain)) ? url.href : ''; }
    catch { return ''; }
  }
  const zalo = validUrl(config.zaloUrl, ['zalo.me']);
  const messenger = validUrl(config.messengerUrl, ['m.me', 'messenger.com', 'facebook.com']);
  if (zalo) {
    const link = $('#quick-consult');
    link.href = zalo;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Tư vấn qua Zalo');
    link.addEventListener('click', () => track('contact_click', { channel: 'zalo' }));
  }
  [[messenger, 'Messenger']].forEach(([url, label]) => {
    if (!url) return;
    const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `Liên hệ qua ${label}`);
    const icon = document.createElement('span'); icon.textContent = label === 'Zalo' ? 'Z' : 'M';
    const text = document.createElement('small'); text.textContent = label;
    link.append(icon, text); $('.floating-contact').prepend(link);
    link.addEventListener('click', () => track('contact_click', { channel: label.toLowerCase() }));
  });
  const maps = validUrl(config.mapsUrl, ['google.com', 'maps.app.goo.gl', 'goo.gl']);
  if (maps) {
    const mapLink = document.createElement('a'); mapLink.href = maps; mapLink.target = '_blank'; mapLink.rel = 'noopener noreferrer'; mapLink.textContent = 'Mở chỉ đường ↗'; mapLink.className = 'text-link light-link'; $('.contact-copy').append(mapLink);
  }
  $$('a[href^="tel:"]').forEach(link => link.addEventListener('click', () => track('contact_click', { channel: 'phone' })));
  const dateInput = $('#date');
  function today() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
  dateInput.min = today();
  const form = $('#booking-form');
  let endpoint = '';
  try { if (config.bookingEndpoint) { const url = new URL(config.bookingEndpoint, location.href); if (url.protocol === 'https:' || (url.origin === location.origin && ['localhost', '127.0.0.1'].includes(url.hostname))) endpoint = url.href; } } catch { /* Keep manual contact mode for invalid configuration. */ }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.submitting === 'true') return;
    const status = $('#form-status'); status.textContent = ''; status.classList.remove('success');
    dateInput.min = today();
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    if (fd.get('website')) return;
    const phone = String(fd.get('phone')).replace(/[\s().-]/g, '');
    if (!/^(?:0\d{9}|\+84\d{9})$/.test(phone)) { status.textContent = 'Bạn kiểm tra lại số điện thoại nhé (10 số hoặc +84).'; $('#phone').focus(); return; }
    if (String(fd.get('date')) < today()) { status.textContent = 'Vui lòng chọn ngày từ hôm nay trở đi.'; dateInput.focus(); return; }
    const payload = { name: String(fd.get('name')).trim(), phone, service: String(fd.get('service')), date: String(fd.get('date')), message: String(fd.get('message')).trim(), landing_variant: variantKey };
    if (!payload.name) { status.textContent = 'Bạn nhập tên để Tuyết tiện xưng hô nhé.'; $('#name').focus(); return; }
    const selectedService = $('#service').selectedOptions[0].textContent;
    if (!endpoint) {
      const date = payload.date.split('-').reverse().join('/');
      const lines = [`Chào Tuyết, mình muốn tư vấn lịch makeup.`, `Họ tên: ${payload.name}`, `Điện thoại: ${payload.phone}`, `Dịch vụ: ${selectedService}`, `Ngày cần makeup: ${date}`];
      if (payload.message) lines.push(`Mong muốn: ${payload.message}`);
      $('#request-text').value = lines.join('\n'); $('#copy-status').textContent = ''; $('#request-dialog').showModal();
      return;
    }
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid']) { const value = params.get(key); if (value) payload[key] = value.slice(0, 500); }
    form.dataset.submitting = 'true'; const button = form.querySelector('[type="submit"]'); button.disabled = true; $('#submit-label').textContent = 'Đang gửi…';
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit' });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Not accepted');
      status.textContent = 'Đã nhận yêu cầu của bạn! Tuyết Trương sẽ liên hệ tư vấn và xác nhận lịch.'; status.classList.add('success');
      track('generate_lead', { service: payload.service }); form.reset(); if (variant?.service) $('#service').value = variant.service;
    } catch { status.textContent = 'Chưa xác nhận gửi thành công. Vui lòng gọi 0776 992 703 để kiểm tra trước khi gửi lại.'; }
    finally { clearTimeout(timeout); form.dataset.submitting = 'false'; button.disabled = false; $('#submit-label').textContent = 'Đăng Ký Ngay'; }
  });
  $('#copy-request').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#request-text').value); $('#copy-status').textContent = 'Đã sao chép. Bạn gửi nội dung qua kênh đang liên hệ với Tuyết nhé.'; }
    catch { $('#request-text').focus(); $('#request-text').select(); $('#copy-status').textContent = 'Bạn nhấn giữ hoặc Ctrl+C để sao chép nội dung đã chọn.'; }
  });

  const header = $('.site-header');
  function updateHeaderBackground() {
    header.classList.toggle('is-scrolled', window.scrollY > 0);
  }
  updateHeaderBackground();
  window.addEventListener('scroll', updateHeaderBackground, { passive: true });
  window.addEventListener('pageshow', updateHeaderBackground);

  // Photo marquee and lightbox from the Thao Eyelash landing page.
  (function () {
    const track = document.getElementById("photo-marquee-track");
    const marquee = document.querySelector(".photo-marquee");
    const lightbox = document.getElementById("gallery-lightbox");
    if (!track || !marquee) return;

    const albumPhotos = [
      ["assets/makeup-album-04.webp", 960, 1440],
      ["assets/makeup-album-05.webp", 960, 1440],
      ["assets/makeup-album-06.webp", 960, 1440],
      ["assets/makeup-album-07.webp", 960, 1440],
      ["assets/makeup-album-08.webp", 960, 1440],
      ["assets/makeup-album-09.webp", 960, 1440],
      ["assets/makeup-album-10.webp", 960, 1440],
      ["assets/makeup-album-11.webp", 960, 1440],
      ["assets/makeup-album-12.webp", 960, 1440],
      ["assets/makeup-album-13.webp", 960, 1440],
      ["assets/makeup-album-14.webp", 960, 1440],
      ["assets/makeup-album-15.webp", 960, 1440],
      ["assets/makeup-album-16.webp", 960, 1440],
      ["assets/makeup-album-17.webp", 960, 1440],
      ["assets/makeup-album-18.webp", 960, 1440],
      ["assets/makeup-album-19.webp", 960, 1440],
      ["assets/makeup-album-20.webp", 960, 1440],
      ["assets/makeup-album-21.webp", 960, 1440],
      ["assets/makeup-album-01.webp", 1100, 1440],
      ["assets/makeup-album-02.webp", 810, 1440],
      ["assets/makeup-album-03.webp", 817, 1440]
    ];
    const COUNT = albumPhotos.length;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let loopWidth = 0;
    let offsetPx = 0;
    let lightboxIndex = 0;

    const lbImg = lightbox?.querySelector(".gallery-lightbox__img");
    const lbCap = lightbox?.querySelector(".gallery-lightbox__caption");

    function speedPxPerFrame() {
      return prefersReducedMotion ? 0 : 1.5;
    }

    const slides = (duplicate) => albumPhotos.map(([src, width, height], index) => {
      const loading = !duplicate && index < 5 ? "eager" : "lazy";
      const keyboard = duplicate ? ' tabindex="-1" aria-hidden="true"' : "";
      return `<button type="button" class="photo-marquee-slide" style="aspect-ratio:${width} / ${height}" data-gallery-index="${index + 1}" aria-label="Xem ảnh ${index + 1}"${keyboard}>
        <img src="${src}" alt="" loading="${loading}" decoding="async" draggable="false">
      </button>`;
    }).join("");
    track.innerHTML = slides(false) + slides(true);

    function measureLoop() {
      const first = track.firstElementChild;
      const duplicate = track.children[COUNT];
      loopWidth = duplicate.getBoundingClientRect().left - first.getBoundingClientRect().left;
      if (loopWidth > 0) {
        offsetPx = ((offsetPx % loopWidth) + loopWidth) % loopWidth;
      }
    }

    function applyOffset() {
      track.style.transform = `translate3d(${-offsetPx}px,0,0)`;
    }

    let dragPending = false;
    let isDragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let pointerDownTarget = null;

    function releaseCapture(e) {
      if (!marquee.hasPointerCapture(e.pointerId)) return;
      try {
        marquee.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    function finishPointerInteraction(e) {
      if (!dragPending && !isDragging) return;
      const tap = e.type === "pointerup" && dragPending && !dragMoved;
      const slide = pointerDownTarget?.closest?.(".photo-marquee-slide[data-gallery-index]");
      isDragging = false;
      dragPending = false;
      dragMoved = false;
      pointerDownTarget = null;
      marquee.classList.remove("is-paused", "is-dragging");
      releaseCapture(e);
      if (tap && slide) showLightbox(Number(slide.dataset.galleryIndex));
    }

    marquee.addEventListener("pointerdown", (e) => {
      if (!e.isPrimary || e.button !== 0) return;
      dragPending = true;
      isDragging = false;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartOffset = offsetPx;
      pointerDownTarget = e.target;
      marquee.classList.add("is-paused");
      try {
        marquee.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    marquee.addEventListener("pointermove", (e) => {
      if (!dragPending && !isDragging) return;
      const dx = e.clientX - dragStartX;
      if (!isDragging && Math.abs(dx) > 4) {
        isDragging = true;
        dragMoved = true;
        marquee.classList.add("is-dragging");
      }
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      offsetPx = dragStartOffset - dx;
      if (loopWidth > 0) offsetPx = ((offsetPx % loopWidth) + loopWidth) % loopWidth;
      applyOffset();
    });

    marquee.addEventListener("pointerup", finishPointerInteraction);
    marquee.addEventListener("pointercancel", finishPointerInteraction);
    marquee.addEventListener("lostpointercapture", (e) => {
      if (dragPending || isDragging) finishPointerInteraction(e);
    });

    function remeasure() {
      requestAnimationFrame(measureLoop);
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => requestAnimationFrame(remeasure));
      ro.observe(marquee);
    }
    window.addEventListener("resize", () => requestAnimationFrame(remeasure), { passive: true });

    function tick() {
      if (!marquee.classList.contains("is-paused") && !track.querySelector(":focus-visible") && loopWidth > 0) {
        offsetPx += speedPxPerFrame();
        while (offsetPx >= loopWidth) offsetPx -= loopWidth;
        applyOffset();
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(() => {
      measureLoop();
      requestAnimationFrame(tick);
    });

    function showLightbox(index) {
      if (!lightbox || !lbImg) return;
      lightboxIndex = ((index - 1) % COUNT + COUNT) % COUNT;
      lbImg.src = albumPhotos[lightboxIndex][0];
      lbImg.alt = `Ảnh makeup ${lightboxIndex + 1}`;
      if (lbCap) lbCap.textContent = `${lightboxIndex + 1} / ${COUNT}`;
      if (!lightbox.open) lightbox.showModal();
    }

    track.addEventListener("click", (event) => {
      const slide = event.target.closest("[data-gallery-index]");
      if (event.detail === 0 && slide) showLightbox(Number(slide.dataset.galleryIndex));
    });

    track.addEventListener("focusin", (event) => {
      const slide = event.target.closest("[data-gallery-index]");
      if (slide?.matches(":focus-visible")) {
        marquee.scrollLeft = 0;
        offsetPx = slide.offsetLeft;
        applyOffset();
      }
    });

    function stepLightbox(delta) {
      showLightbox(lightboxIndex + 1 + delta);
    }

    document.querySelectorAll("[data-close-gallery-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => lightbox?.close());
    });

    lightbox?.querySelector("[data-gallery-prev]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      stepLightbox(-1);
    });

    lightbox?.querySelector("[data-gallery-next]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      stepLightbox(1);
    });

    lightbox?.addEventListener("cancel", (e) => {
      e.preventDefault();
      lightbox.close();
    });

    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox?.open) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
      } else if (e.key === "Escape") {
        lightbox.close();
      }
    });
  })();
})();
