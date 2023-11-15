<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1 notif</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />
      <ion-button @click="requestNotificationPermission()">Request Notification Permission</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { onMounted } from 'vue';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyAeCH1Sas-HEwZBtQcgsY9ZrgigHhJjm2w",
  authDomain: "ion-2-d9afa.firebaseapp.com",
  projectId: "ion-2-d9afa",
  storageBucket: "ion-2-d9afa.appspot.com",
  messagingSenderId: "554990515597",
  appId: "1:554990515597:web:62d1b4969d5c84ea94f9c4"
};

const app = initializeApp(firebaseConfig);

onMounted(async () => {
  
  const messaging = getMessaging(app);

  

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const token = await getToken(messaging);
      console.log('FCM Token:', token);

      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        // Handle the notification payload as needed
      });
      
    } else {
      console.warn('Notification permission denied.');
    }
  } catch (error) {
    console.error('Unable to get permission to notify.', error);
  }
});

const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        } else {
          console.warn('Notification permission denied');
        }
      });
    }
  }
</script>
