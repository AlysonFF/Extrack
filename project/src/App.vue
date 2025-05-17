<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from '../../project/src/stores/authStore.js'
import { storeToRefs} from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
  <footer class="bg-blue-800 text-white p-4 text-center">
      <p>© 2025 Projeto de Extensão - MIT License</p>
    </footer>
</template>