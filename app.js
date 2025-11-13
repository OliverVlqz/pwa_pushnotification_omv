// Importamos los módulos de Firebase desde CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js'

// Configuración obtenida desde Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyCNqR-SsYy6klG_YZp1OIdkn9eZQAuxb-4',
  authDomain: 'pwa-20223tn025.firebaseapp.com',
  projectId: 'pwa-20223tn025',
  storageBucket: 'pwa-20223tn025.firebasestorage.app',
  messagingSenderId: '284765050351',
  appId: '1:284765050351:web:84279e246fba245ab7d21a',
}

// Inicializamos Firebase
const app = initializeApp(firebaseConfig)

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel)
const log = (m) =>
  ($('#log').textContent += ($('#log').textContent === '—' ? '' : '\n') + m)

// Mostramos el estado inicial del permiso
$('#perm').textContent = Notification.permission

// Registramos el Service Worker que manejará las notificaciones en segundo plano
let swReg
if ('serviceWorker' in navigator) {
  swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js')
  console.log('SW registrado:', swReg.scope)
}

// Verificamos si el navegador soporta FCM
const supported = await isSupported()
let messaging = null

if (supported) {
  messaging = getMessaging(app)
} else {
  log('Este navegador no soporta FCM en la Web.')
}

// Clave pública VAPID (de Cloud Messaging)
const VAPID_KEY =
  'BIQQ_FsrNY5WcotCacTqNj_h2hIUkyUdioPzOivWXuktTB-ntiTs3RWJ4akWe0wtQIYi4S8dor4Ug6i2M75r6K0'

// Función para pedir permiso al usuario y obtener token
async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission()
    $('#perm').textContent = permission

    if (permission !== 'granted') {
      log('Permiso denegado por el usuario.')
      return
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    })

    if (token) {
      $('#token').textContent = token
      log(
        'Token obtenido. Usa este token en Firebase Console → Cloud Messaging.'
      )
    } else {
      log('No se pudo obtener el token.')
    }
  } catch (err) {
    console.error(err)
    log('Error al obtener token: ' + err.message)
  }
}

// Escuchamos mensajes cuando la pestaña está abierta
if (messaging) {
  onMessage(messaging, (payload) => {
    log('Mensaje en primer plano:\n' + JSON.stringify(payload, null, 2))
  })
}

// Vinculamos la función al botón de permiso
$('#btn-permission').addEventListener('click', requestPermissionAndGetToken)
