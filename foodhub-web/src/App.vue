<script setup lang="ts">
import { onMounted, ref } from 'vue';
 
const API = 'http://localhost:3000';
const restaurants = ref<{ id: number; name: string; area: string }[]>([]);
const message = ref('');
 
async function loadRestaurants() {
  try {
    const res = await fetch(`${API}/v1/restaurants`);
    restaurants.value = (await res.json()).data;
  } catch (e) {
    message.value = `Blocked: ${e}`;       // a CORS error shows up here as "Failed to fetch"
  }
}
 
async function login() {
  await fetch(`${API}/v1/login?username=dara`, { method: 'POST', credentials: 'include' });
  message.value = 'Logged in';
}
 
async function whoAmI() {
  const res = await fetch(`${API}/v1/me`, { credentials: 'include' });   // send the cookie
  message.value = JSON.stringify(await res.json());
}
 
onMounted(loadRestaurants);
</script>
 
<template>
  <h1>FoodHub</h1>
  <ul>
    <li v-for="r in restaurants" :key="r.id">{{ r.name }} ({{ r.area }})</li>
  </ul>
  <button @click="login">Log in as dara</button>
  <button @click="whoAmI">Who am I?</button>
  <p>{{ message }}</p>
</template>
