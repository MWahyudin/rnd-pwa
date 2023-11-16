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
      <ion-button @click="requestNotificationPermission()"
        >Request Notification Permission</ion-button
      >
      <ion-button @click="testNotification()">send notification</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { onMounted, ref as vueRef, watch } from "vue";
import { getDatabase, ref as firebaseRef, push, orderByChild, equalTo, get, query } from 'firebase/database';

const requestNotificationPermission = () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      } else {
        console.warn("Notification permission denied");
      }
    });
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyAeCH1Sas-HEwZBtQcgsY9ZrgigHhJjm2w",
  authDomain: "ion-2-d9afa.firebaseapp.com",
  projectId: "ion-2-d9afa",
  storageBucket: "ion-2-d9afa.appspot.com",
  messagingSenderId: "554990515597",
  appId: "1:554990515597:web:62d1b4969d5c84ea94f9c4",
  databaseURL: 'https://ion-2-d9afa-default-rtdb.asia-southeast1.firebasedatabase.app',
};

initializeApp(firebaseConfig);
const tokens = vueRef<string[]>([]);

const database = firebaseRef(getDatabase(), 'tokens'); 


const isTokenAlreadySaved = async (token: any) => {
  const tokensRef = firebaseRef(getDatabase(), 'tokens');
  const tokenQuery = query(tokensRef, equalTo('token', token));
  

  const snapshot = await get(tokenQuery);

  return snapshot.exists();
};

const saveTokenToDatabase = async (token: any) => {
  const tokensRef = firebaseRef(getDatabase(), 'tokens');
  push(tokensRef, { token });
};

const getTokenAsync = async () => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
  
      await saveTokenToDatabase(token);
      await getDataFromDatabase()
    
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};


const getDataFromDatabase = async () => {
  const database = firebaseRef(getDatabase(), 'tokens');
  const tokensQuery = query(database);

  try {
    const snapshot = await get(tokensQuery);
    const data = snapshot.val();

    if (data) {
      tokens.value = [...new Set(Object.values(data).map((entry: any) => entry.token))];
    }
  } catch (error) {
    console.error('Error getting data from the database:', error);
  }
};

watch(tokens, (newTokens) => {
  console.log('Tokens updated:', newTokens);
});



onMounted(() => {
  getTokenAsync();
})

const testNotification = async () => {

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "key=AAAAgTgDNY0:APA91bH5yDhPwIpj9h8Xob6yjzLM_9WcVTG8IaWzvkdG7C1uoaEQ1ccValEee7AjcTmApBnRjXSmUHV_KYZcbFTxKJ0uNGsIf-jNruM_bu7xK3sNZLdQ6XlWHkn_DqCNp45PUraEvkgJ"
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    registration_ids: tokens.value,
    notification: {
      body: "halo",
      title: "hi title",
    },
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://fcm.googleapis.com/fcm/send",
      requestOptions
    );
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
};
</script>
