(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const params = new URLSearchParams(location.search);
  const variants = {
    tiec: { title: 'Makeup Đi Tiệc\ntại Đà Nẵng', tagline: 'Trong trẻo hay sắc sảo, chọn kiểu hợp bạn', description: 'Tư vấn màu makeup và kiểu tóc phù hợp gương mặt, trang phục và buổi tiệc. Có nhận tận nơi tại Đà Nẵng.', price: 'Makeup tiệc từ 350.000đ', note: 'Chưa gồm tóc · Tổng chi phí được trao đổi trước khi chốt', tab: 'tiec', image: 2, service: 'tiec' },
    'co-dau': { title: 'Trang Điểm Cô Dâu\ntại Đà Nẵng', tagline: 'Tôn nét riêng trong ngày cưới', description: 'Tuyết Trương trực tiếp thực hiện với 9 năm kinh nghiệm. Tư vấn makeup và tóc hài hòa với gương mặt, áo dài hoặc váy cưới.', price: '1.800.000–2.000.000đ', note: 'Gồm tóc, mi, phụ kiện, tặng lens · Dặm lại tính riêng', tab: 'co-dau', image: 1, service: 'co-dau' },
    'ky-yeu': { title: 'Makeup Kỷ Yếu\ntại Đà Nẵng', tagline: 'Tươi trẻ, đúng gu cho ngày lưu dấu', description: 'Chọn kiểu makeup phù hợp áo dài, lễ phục và phong cách bộ ảnh. Có lựa chọn makeup riêng hoặc kèm làm tóc.', price: 'Makeup kỷ yếu từ 350.000đ', note: 'Chưa gồm tóc · Có lựa chọn kèm làm tóc', tab: 'ky-yeu', image: 3, service: 'ky-yeu' },
    'sinh-nhat': { title: 'Makeup Sinh Nhật\ntại Đà Nẵng', tagline: 'Một diện mạo đúng gu cho ngày của bạn', description: 'Từ ngọt ngào đến cá tính, cùng Tuyết Trương chọn kiểu makeup phù hợp trang phục và phong cách buổi sinh nhật.', price: 'Tư vấn giá theo kiểu bạn chọn', note: 'Trao đổi tổng chi phí trước khi chốt lịch', tab: 'tiec', image: 2, service: 'sinh-nhat' },
    'tan-noi': { title: 'Makeup Tận Nơi\ntại Đà Nẵng', tagline: 'Chọn kiểu bạn thích, trao đổi nơi hẹn', description: 'Nhận makeup tận nơi trong Đà Nẵng. Gửi dịch vụ, địa điểm và giờ cần hoàn thành để được tư vấn lịch và tổng chi phí.', price: 'Báo giá theo dịch vụ & địa điểm', note: 'Trên 4 km từ cơ sở: phí di chuyển 50.000–100.000đ', tab: 'all', image: 0, service: '' }
  };
  const photos = [
    { x: 0, y: 0, name: 'Trong trẻo', description: 'Ảnh minh họa phong cách makeup trong trẻo' },
    { x: 512, y: 0, name: 'Cô dâu', description: 'Ảnh minh họa makeup cô dâu' },
    { x: 1024, y: 0, name: 'Sắc sảo', description: 'Ảnh minh họa makeup tiệc – sự kiện' },
    { x: 0, y: 512, name: 'Kỷ yếu', description: 'Ảnh minh họa makeup kỷ yếu – tốt nghiệp' },
    { x: 512, y: 512, name: 'Cận màu mắt & lớp nền', description: 'Ảnh minh họa chi tiết màu mắt và lớp nền' }
  ];
  const albumSets = { all: [0, 1, 2], tiec: [0, 2, 4], 'co-dau': [0, 1, 4], 'ky-yeu': [0, 3, 4] };
  let activeTab = 'all';
  let lightboxIndex = 0;
  let lightboxPhotos = [0, 1, 2, 4];
  let lightboxOpener;
  const variantKey = Object.hasOwn(variants, params.get('dich-vu')) ? params.get('dich-vu') : 'all';
  const variant = variants[variantKey];
  function setPhoto(svg, photoIndex) {
    const photo = photos[photoIndex];
    svg.setAttribute('viewBox', `${photo.x} ${photo.y} 512 512`);
    svg.setAttribute('aria-label', photo.description);
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
      card.setAttribute('aria-label', `Xem lớn mẫu ${photo.name} — ảnh minh họa`);
      setPhoto(card.querySelector('svg'), photoIndex);
      card.querySelector('.photo-caption').replaceChildren(document.createTextNode(photo.name + ' '));
      const arrow = document.createElement('i'); arrow.textContent = '↗';
      card.querySelector('.photo-caption').append(arrow);
    });
    lightboxPhotos = [...new Set([...albumSets[tab], 4])];
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
    $('#hero-price-note').textContent = variant.note;
    setPhoto($('#hero-image'), variant.image);
    $('#service').value = variant.service;
    document.title = `${variant.title.replace('\n', ' ')} | Tuyết Trương Makeup`;
    $('meta[name="description"]').content = variant.description;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = variant.description;
    const priority = document.querySelector(`[data-price="${variant.service}"]`);
    if (priority) { priority.classList.add('is-priority'); $('#price-groups').prepend(priority); }
  }
  setAlbum(variant?.tab || 'all');
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
    const index = lightboxPhotos[lightboxIndex];
    setPhoto($('#lightbox-image'), index);
    $('#lightbox-title').textContent = photos[index].name + ' · Ảnh minh họa';
    $('#lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;
  }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    lightboxOpener = button;
    lightboxIndex = Math.max(0, lightboxPhotos.indexOf(Number(button.dataset.gallery)));
    renderLightbox(); lightbox.showModal();
  }));
  function movePhoto(direction) { lightboxIndex = (lightboxIndex + direction + lightboxPhotos.length) % lightboxPhotos.length; renderLightbox(); }
  $('#previous-image').addEventListener('click', () => movePhoto(-1));
  $('#next-image').addEventListener('click', () => movePhoto(1));
  lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowRight') movePhoto(1); if (event.key === 'ArrowLeft') movePhoto(-1); });
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
  [[zalo, 'Zalo'], [messenger, 'Messenger']].forEach(([url, label]) => {
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
  // Keep the fixed contacts clear of the opening contact strip and booking fields.
  if ('IntersectionObserver' in window) {
    const visibility = new Map();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting));
      $('.floating-contact').hidden = [...visibility.values()].some(Boolean);
    });
    observer.observe($('.hero'));
    observer.observe($('#lien-he'));
  }
  const dateInput = $('#date');
  function today() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
  dateInput.min = today();
  const form = $('#booking-form');
  let endpoint = '';
  try { if (config.bookingEndpoint) { const url = new URL(config.bookingEndpoint, location.href); if (url.protocol === 'https:' || (url.origin === location.origin && ['localhost', '127.0.0.1'].includes(url.hostname))) endpoint = url.href; } } catch { /* Keep manual contact mode for invalid configuration. */ }
  if (endpoint) { $('#submit-label').textContent = 'Gửi yêu cầu'; $('#form-help').textContent = 'Gửi yêu cầu chưa giữ lịch. Tuyết Trương sẽ liên hệ để xác nhận.'; }
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
    const payload = { name: String(fd.get('name')).trim(), phone, service: String(fd.get('service')), date: String(fd.get('date')), time: String(fd.get('time')), location: String(fd.get('location')).trim(), message: String(fd.get('message')).trim(), landing_variant: variantKey };
    if (!payload.name) { status.textContent = 'Bạn nhập tên để Tuyết tiện xưng hô nhé.'; $('#name').focus(); return; }
    const selectedService = $('#service').selectedOptions[0].textContent;
    if (!endpoint) {
      const date = payload.date.split('-').reverse().join('/');
      const lines = [`Chào Tuyết, mình muốn tư vấn lịch makeup.`, `Họ tên: ${payload.name}`, `Điện thoại: ${payload.phone}`, `Dịch vụ: ${selectedService}`, `Ngày cần makeup: ${date}`];
      if (payload.time) lines.push(`Giờ cần hoàn thành: ${payload.time}`);
      if (payload.location) lines.push(`Địa điểm: ${payload.location}`);
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
    finally { clearTimeout(timeout); form.dataset.submitting = 'false'; button.disabled = false; $('#submit-label').textContent = 'Gửi yêu cầu'; }
  });
  $('#copy-request').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#request-text').value); $('#copy-status').textContent = 'Đã sao chép. Bạn gửi nội dung qua kênh đang liên hệ với Tuyết nhé.'; }
    catch { $('#request-text').focus(); $('#request-text').select(); $('#copy-status').textContent = 'Bạn nhấn giữ hoặc Ctrl+C để sao chép nội dung đã chọn.'; }
  });
})();
