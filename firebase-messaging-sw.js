// Importamos las versiones compat de Firebase para SW
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js'
)

// Configuración igual que en app.js
firebase.initializeApp({
  apiKey: 'AIzaSyCNqR-SsYy6klG_YZp1OIdkn9eZQAuxb-4',
  authDomain: 'pwa-20223tn025.firebaseapp.com',
  projectId: 'pwa-20223tn025',
  storageBucket: 'pwa-20223tn025.firebasestorage.app',
  messagingSenderId: '284765050351',
  appId: '1:284765050351:web:84279e246fba245ab7d21a',
})
const messaging = firebase.messaging()

// Evento cuando llega un mensaje en segundo plano
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Notificación'
  const options = {
    body: payload.notification?.body || '',
    icon: './icon-192.png',
  }
  self.registration.showNotification(title, options)
})

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
