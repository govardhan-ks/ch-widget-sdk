<template>
  <div v-if="platform.context && platform.theme" style="font-family: sans-serif; padding: 16px;">
    <h1>Widget Dashboard (Vue)</h1>
    <pre>Context: {{ JSON.stringify(platform.context, null, 2) }}</pre>
    <pre>Theme: {{ JSON.stringify(platform.theme, null, 2) }}</pre>
    <button @click="makeApiCall">Make API Call</button>
  </div>
  <div v-else>Loading...</div>
  
</template>

<script setup lang="ts">
import { usePlatform } from 'widget-sdk-vue';

const platform = usePlatform();

const makeApiCall = async () => {
  try {
    const response = await platform.apiRequest({
      url: '/api/users',
      method: 'POST',
      data: { userId: '123' }
    });
    console.log('API Response:', response);
  } catch (error) {
    console.error('API Error:', error);
  }
};
</script>

<style>
button {
  padding: 8px 12px;
}
</style>


