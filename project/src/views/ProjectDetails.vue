<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projectStore'
import api from '../axios.js'
import { toast } from 'vue3-toastify';


const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const projectId = computed(() => route.params.id)
const project = ref(null)
const isEditing = ref(false)
const confirmDelete = ref(false)

const editForm = ref({})

onMounted(() => {
  loadProject()
})

const loadProject = () => {
  const foundProject = projectStore.getProject(projectId.value)
  if (foundProject) {
    project.value = foundProject
    editForm.value = { ...foundProject }
  } else {
    router.push('/projects')
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'em_andamento':
      return 'bg-blue-100 text-blue-800'
    case 'concluido':
      return 'bg-green-100 text-green-800'
    case 'cancelado':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'em_andamento':
      return 'Em andamento'
    case 'concluido':
      return 'Concluído'
    case 'cancelado':
      return 'Cancelado'
    default:
      return 'Desconhecido'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const formatDateCreateWhen = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const startEditing = () => {
  editForm.value = { ...project.value }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  confirmDelete.value = false
}

const saveChanges = async () => {
  try {
    const response = await api.put(`/projects/${project.value._id}`, editForm.value)
    project.value = response.data
    toast.success('Projeto editado com sucesso!', {
      autoClose: 1000
    })
    isEditing.value = false
  } catch (error) {
    console.error('Erro ao salvar alterações:', error)
  }
}

const deleteProject = async () => {
  try {
    await api.delete(`/projects/${project.value._id}`)
    toast.success('Projeto excluído com sucesso')
    setTimeout(() => {
      router.push('/projects')
    }, 1000)
  } catch (error) {
    console.error('Erro ao excluir projeto:', error)
  }
}

const addEvidenceLink = () => {
  if (!editForm.value.evidenceLinks) {
    editForm.value.evidenceLinks = []
  }
  editForm.value.evidenceLinks.push('')
}

const removeEvidenceLink = (index) => {
  editForm.value.evidenceLinks.splice(index, 1)
}
</script>

<template>
  <div v-if="project" class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button 
          @click="router.push('/projects')" 
          class="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Voltar
        </button>
        <h1 class="text-2xl font-bold text-blue-800">
          {{ isEditing ? 'Editar Projeto' : project.title }}
        </h1>
      </div>
      
      <div v-if="!isEditing" class="flex space-x-2">
        <button 
          @click="startEditing" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Editar
        </button>
      </div>
    </div>

    <!-- View Mode -->
    <div v-if="!isEditing" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ project.title }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              Criado em {{ formatDateCreateWhen(project.createdAt) }}
            </p>
          </div>
          <span :class="['px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full', getStatusClass(project.status)]">
            {{ getStatusText(project.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500">Data de Início</h3>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(project.startDate) }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Data de Término</h3>
            <p class="mt-1 text-sm text-gray-900">{{ project.endDate ? formatDate(project.endDate) : 'Em andamento' }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Horas por Semana</h3>
            <p class="mt-1 text-sm text-gray-900">{{ project.hoursPerWeek }} horas</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Total de Dias</h3>
            <p class="mt-1 text-sm text-gray-900">{{ project.totalDays }} dias</p>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Objetivo do Projeto</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.objective }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Público-Alvo</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.targetAudience }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Descrição das Atividades</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.description }}</p>
        </div>

        <div v-if="project.challenges" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Desafios Enfrentados</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.challenges }}</p>
        </div>

        <div v-if="project.achievements" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Conquistas e Resultados</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.achievements }}</p>
        </div>

        <div v-if="project.learnings" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Aprendizados Adquiridos</h3>
          <p class="text-sm text-gray-900 whitespace-pre-line">{{ project.learnings }}</p>
        </div>

        <div v-if="project.evidenceLinks && project.evidenceLinks.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 mb-2">Evidências</h3>
          <ul class="list-disc list-inside text-sm text-blue-600">
            <li v-for="(link, index) in project.evidenceLinks" :key="index" class="mb-1">
              <a :href="link" target="_blank" class="hover:underline">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="saveChanges">
        <!-- Basic Information -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
          
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
            <input
              id="title"
              v-model="editForm.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input
                id="startDate"
                v-model="editForm.startDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Data de Término</label>
              <input
                id="endDate"
                v-model="editForm.endDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>

        <!-- Duration -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Duração e Dedicação</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="hoursPerWeek" class="block text-sm font-medium text-gray-700 mb-1">Horas por Semana</label>
              <input
                id="hoursPerWeek"
                v-model="editForm.hoursPerWeek"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            
            <div>
              <label for="totalDays" class="block text-sm font-medium text-gray-700 mb-1">Total de Dias</label>
              <input
                id="totalDays"
                v-model="editForm.totalDays"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
        </div>

        <!-- Project Details -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalhes do Projeto</h2>
          
          <div class="mb-4">
            <label for="objective" class="block text-sm font-medium text-gray-700 mb-1">Objetivo do Projeto</label>
            <textarea
              id="objective"
              v-model="editForm.objective"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
            <textarea
              id="targetAudience"
              v-model="editForm.targetAudience"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Descrição das Atividades</label>
            <textarea
              id="description"
              v-model="editForm.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Reflection -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Reflexão e Aprendizado</h2>
          
          <div class="mb-4">
            <label for="challenges" class="block text-sm font-medium text-gray-700 mb-1">Desafios Enfrentados</label>
            <textarea
              id="challenges"
              v-model="editForm.challenges"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="achievements" class="block text-sm font-medium text-gray-700 mb-1">Conquistas e Resultados</label>
            <textarea
              id="achievements"
              v-model="editForm.achievements"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label for="learnings" class="block text-sm font-medium text-gray-700 mb-1">Aprendizados Adquiridos</label>
            <textarea
              id="learnings"
              v-model="editForm.learnings"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Evidence Links -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Evidências</h2>
          
          <div class="mb-2">
            <p class="text-sm text-gray-600 mb-2">
              Adicione links para fotos, documentos ou relatórios que comprovem a realização do projeto.
            </p>
            
            <div v-for="(link, index) in editForm.evidenceLinks" :key="index" class="flex mb-2">
              <input
                v-model="editForm.evidenceLinks[index]"
                type="url"
                placeholder="https://exemplo.com/evidencia"
                class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
              <button 
                type="button" 
                @click="removeEvidenceLink(index)" 
                class="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
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

        <!-- Status -->
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Status do Projeto</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Situação Atual</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="editForm.status" value="em_andamento" class="form-radio h-4 w-4 text-blue-600">
                <span class="ml-2">Em andamento</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="editForm.status" value="concluido" class="form-radio h-4 w-4 text-blue-600">
                <span class="ml-2">Concluído</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="editForm.status" value="cancelado" class="form-radio h-4 w-4 text-blue-600">
                <span class="ml-2">Cancelado</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Delete Project -->
        <div class="mb-6 border-t pt-6">
          <div v-if="!confirmDelete">
            <button 
              type="button" 
              @click="confirmDelete = true" 
              class="text-red-600 hover:text-red-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Excluir Projeto
            </button>
          </div>
          
          <div v-else class="bg-red-50 border-l-4 border-red-500 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
                </p>
                <div class="mt-4 flex space-x-4">
                  <button 
                    type="button" 
                    @click="confirmDelete = false" 
                    class="text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    @click="deleteProject" 
                    class="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Sim, excluir projeto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="cancelEditing"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  </div>
  <div v-else class="text-center py-12">
    <p>Carregando projeto...</p>
  </div>
</template>