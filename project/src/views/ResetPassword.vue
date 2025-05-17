<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const token = route.params.token
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  try {
    isLoading.value = true
    error.value = ''
    await api.post(`/auth/reset-password/${token}`, { password: newPassword.value })
    toast.success('Senha redefinida com sucesso!')
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao redefinir senha'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Redefinir Senha</h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="resetPassword" class="space-y-6">
          <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
          >
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Redefinir Senha</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>