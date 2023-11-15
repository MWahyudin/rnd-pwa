importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyAeCH1Sas-HEwZBtQcgsY9ZrgigHhJjm2w",
    authDomain: "ion-2-d9afa.firebaseapp.com",
    projectId: "ion-2-d9afa",
    storageBucket: "ion-2-d9afa.appspot.com",
    messagingSenderId: "554990515597",
    appId: "1:554990515597:web:62d1b4969d5c84ea94f9c4"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Message received:", payload);

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(payload.notification.title, notificationOptions);
});
