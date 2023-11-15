<!-- App.vue -->
<template>
  <ion-app>
    <ion-router-outlet />
    <!-- <ion-button @click="requestNotificationPermission()">Request Notification Permission</ion-button> -->
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
