// Service worker Transport Finance: hanya untuk instal aplikasi, angka di ikon, dan notifikasi.
// Tidak menyimpan cache, jadi aplikasi selalu memakai versi terbaru dari GitHub Pages.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// Halaman aplikasi selalu diambil langsung dari GitHub Pages tanpa cache browser,
// jadi aplikasi yang sudah diinstal langsung memakai versi terbaru setiap kali dibuka.
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => fetch(e.request)));
});
// Klik notifikasi: buka / fokuskan aplikasi di menu yang sesuai (KDAB atau Agreement)
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d = e.notification.data || {};
  const type = d.type || 'open-kdab', url = d.url || './#kdab';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.postMessage({ type }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
// Angka di ikon aplikasi, dikirim dari halaman
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type !== 'badge' || !self.navigator || !self.navigator.setAppBadge) return;
  e.waitUntil((d.n > 0 ? self.navigator.setAppBadge(d.n) : self.navigator.clearAppBadge()).catch(() => {}));
});
