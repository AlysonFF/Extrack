<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore} from '../stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-blue-800 text-white">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <router-link to="/" class="text-xl font-bold">Projeto de Extensão</router-link>
        
        <button @click="toggleMenu" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div class="hidden md:flex space-x-4">
          <router-link to="/" class="hover:text-blue-200">Início</router-link>
          <router-link to="/projects" class="hover:text-blue-200">Meus Projetos</router-link>
          <router-link to="/projects/new" class="hover:text-blue-200">Novo Projeto</router-link>
          <button @click="logout" class="hover:text-blue-200">Sair</button>
        </div>
      </div>
      
      <div v-if="isMenuOpen" class="md:hidden py-2 pb-4">
        <router-link to="/" class="block py-2 hover:text-blue-200">Início</router-link>
        <router-link to="/projects" class="block py-2 hover:text-blue-200">Meus Projetos</router-link>
        <router-link to="/projects/new" class="block py-2 hover:text-blue-200">Novo Projeto</router-link>
        <button @click="logout" class="block w-full text-left hover:text-blue-200">Sair</button>
      </div>
    </div>
  </nav>
</template>