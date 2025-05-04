<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projectStore'
import api from '../axios.js'
import { toast } from 'vue3-toastify';

const router = useRouter()
const projectStore = useProjectStore()

const project = ref({
  title: '',
  startDate: '',
  endDate: '',
  hoursPerWeek: '',
  totalDays: '',
  objective: '',
  targetAudience: '',
  description: '',
  challenges: '',
  achievements: '',
  learnings: '',
  evidenceLinks: [''],
  status: 'em_andamento'
})

const errors = ref({})
const isSubmitting = ref(false)

const addEvidenceLink = () => {
  project.value.evidenceLinks.push('')
}

const removeEvidenceLink = (index) => {
  project.value.evidenceLinks.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!project.value.title.trim()) {
    errors.value.title = 'O título é obrigatório'
    isValid = false
  }

  if (!project.value.startDate) {
    errors.value.startDate = 'A data de início é obrigatória'
    isValid = false
  }

  if (!project.value.hoursPerWeek) {
    errors.value.hoursPerWeek = 'As horas por semana são obrigatórias'
    isValid = false
  }

  if (!project.value.totalDays) {
    errors.value.totalDays = 'O total de dias é obrigatório'
    isValid = false
  }

  if (!project.value.objective.trim()) {
    errors.value.objective = 'O objetivo é obrigatório'
    isValid = false
  }

  if (!project.value.targetAudience.trim()) {
    errors.value.targetAudience = 'O público-alvo é obrigatório'
    isValid = false
  }

  if (!project.value.description.trim()) {
    errors.value.description = 'A descrição é obrigatória'
    isValid = false
  }

  return isValid
}


const submitForm = async () => {
  if (!validateForm()) {
    window.scrollTo(0, 0)
    return
  }

  isSubmitting.value = true
  project.value.evidenceLinks = project.value.evidenceLinks.filter(link => link.trim() !== '')

  try {
    const response = await api.post('/projects', project.value)
    projectStore.projects.push(response.data)
    toast.success('Projeto cadastrado com sucesso')
    setTimeout(() => {
      router.push(`/projects/${response.data._id}`)
    }, 800)
  } catch (error) {
    console.error('Erro ao salvar projeto:', error)
    errors.value.general = 'Ocorreu um erro ao salvar o projeto. Por favor, tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-blue-800 mb-6">Registrar Novo Projeto de Extensão</h1>

    <div v-if="Object.keys(errors).length > 0" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            Por favor, corrija os erros abaixo antes de continuar.
          </p>
          <ul v-if="errors.general" class="mt-2 text-sm text-red-700">
            <li>{{ errors.general }}</li>
          </ul>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Informações Básicas -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Informações Básicas</h2>
        
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Título do Projeto <span class="text-red-500">*</span></label>
          <input
            id="title"
            v-model="project.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.title }"
          >
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Data de Início <span class="text-red-500">*</span></label>
            <input
              id="startDate"
              v-model="project.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.startDate }"
            >
            <p v-if="errors.startDate" class="mt-1 text-sm text-red-600">{{ errors.startDate }}</p>
          </div>
          
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
            <input
              id="endDate"
              v-model="project.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Duração e Dedicação -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Duração e Dedicação</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="hoursPerWeek" class="block text-sm font-medium text-gray-700 mb-1">Horas por Semana <span class="text-red-500">*</span></label>
            <input
              id="hoursPerWeek"
              v-model="project.hoursPerWeek"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.hoursPerWeek }"
            >
            <p v-if="errors.hoursPerWeek" class="mt-1 text-sm text-red-600">{{ errors.hoursPerWeek }}</p>
          </div>
          
          <div>
            <label for="totalDays" class="block text-sm font-medium text-gray-700 mb-1">Total de Dias <span class="text-red-500">*</span></label>
            <input
              id="totalDays"
              v-model="project.totalDays"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.totalDays }"
            >
            <p v-if="errors.totalDays" class="mt-1 text-sm text-red-600">{{ errors.totalDays }}</p>
          </div>
        </div>
      </div>

      <!-- Detalhes do Projeto -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Detalhes do Projeto</h2>
        
        <div class="mb-4">
          <label for="objective" class="block text-sm font-medium text-gray-700 mb-1">Objetivo do Projeto <span class="text-red-500">*</span></label>
          <textarea
            id="objective"
            v-model="project.objective"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.objective }"
          ></textarea>
          <p v-if="errors.objective" class="mt-1 text-sm text-red-600">{{ errors.objective }}</p>
        </div>
        
        <div class="mb-4">
          <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-1">Público-Alvo <span class="text-red-500">*</span></label>
          <textarea
            id="targetAudience"
            v-model="project.targetAudience"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.targetAudience }"
          ></textarea>
          <p v-if="errors.targetAudience" class="mt-1 text-sm text-red-600">{{ errors.targetAudience }}</p>
        </div>
        
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descrição das Atividades <span class="text-red-500">*</span></label>
          <textarea
            id="description"
            v-model="project.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>
      </div>

      <!-- Reflexão e Aprendizado -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Reflexão e Aprendizado</h2>
        
        <div class="mb-4">
          <label for="challenges" class="block text-sm font-medium text-gray-700 mb-1">Desafios Enfrentados</label>
          <textarea
            id="challenges"
            v-model="project.challenges"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label for="achievements" class="block text-sm font-medium text-gray-700 mb-1">Conquistas e Resultados</label>
          <textarea
            id="achievements"
            v-model="project.achievements"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div class="mb-4">
          <label for="learnings" class="block text-sm font-medium text-gray-700 mb-1">Aprendizados Adquiridos</label>
          <textarea
            id="learnings"
            v-model="project.learnings"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>

      <!-- Evidências -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Evidências</h2>
        
        <div class="mb-2">
          <p class="text-sm text-gray-600 mb-2">
            Adicione links para fotos, documentos ou relatórios que comprovem a realização do projeto.
          </p>
          
          <div v-for="(link, index) in project.evidenceLinks" :key="index" class="flex mb-2">
            <input
              v-model="project.evidenceLinks[index]"
              type="url"
              placeholder="https://exemplo.com/evidencia"
              class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <button 
              type="button" 
              @click="removeEvidenceLink(index)" 
              class="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              :disabled="project.evidenceLinks.length === 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <button 
            type="button" 
            @click="addEvidenceLink" 
            class="mt-2 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Adicionar outro link
          </button>
        </div>
      </div>

      <!-- Status do Projeto -->
      <div>
        <h2 class="text-xl font-semibold text-blue-700 mb-4">Status do Projeto</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Situação Atual</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="project.status" value="em_andamento" class="form-radio h-4 w-4 text-blue-600">
              <span class="ml-2">Em andamento</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="project.status" value="concluido" class="form-radio h-4 w-4 text-blue-600">
              <span class="ml-2">Concluído</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="project.status" value="cancelado" class="form-radio h-4 w-4 text-blue-600">
              <span class="ml-2">Cancelado</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          @click="router.push('/projects')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :class="{ 'opacity-75 cursor-not-allowed': isSubmitting }"
        >
          <span v-if="isSubmitting">Salvando...</span>
          <span v-else>Salvar Projeto</span>
        </button>
      </div>
    </form>
  </div>
</template>