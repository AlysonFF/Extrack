<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projectStore'
import api from '../axios.js'
import { toast } from 'vue3-toastify'

const router = useRouter()
const projectStore = useProjectStore()
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedProjects = ref([])
const selectAll = ref(false)

const filteredProjects = computed(() => {
  let filtered = projectStore.projects

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(project => project.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.objective.toLowerCase().includes(query)
    )
  }

  return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProjects.value = filteredProjects.value.map(p => p._id)
  } else {
    selectedProjects.value = []
  }
}

const isSelected = (id) => selectedProjects.value.includes(id)

const toggleSelection = (id) => {
  if (isSelected(id)) {
    selectedProjects.value = selectedProjects.value.filter(pid => pid !== id)
  } else {
    selectedProjects.value.push(id)
  }
}

const deleteSelectedProjects = async () => {
  if (!selectedProjects.value.length) return
  if (!confirm('Tem certeza que deseja excluir os projetos selecionados?')) return

  try {
    await Promise.all(
      selectedProjects.value.map(id => api.delete(`/projects/${id}`))
    )
    projectStore.projects = projectStore.projects.filter(p => !selectedProjects.value.includes(p._id))
    toast.success('Projetos excluídos com sucesso!')
    selectedProjects.value = []
    selectAll.value = false
  } catch (error) {
    toast.error('Erro ao excluir projetos')
    console.error(error)
  }
}

const getStatusClass = (status) => {
  return {
    em_andamento: 'bg-blue-100 text-blue-800',
    concluido: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  return {
    em_andamento: 'Em andamento',
    concluido: 'Concluído',
    cancelado: 'Cancelado'
  }[status] || 'Desconhecido'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const viewProject = (id) => {
  router.push(`/projects/${id}`)
}

const createNewProject = () => {
  router.push('/projects/new')
}

onMounted(async () => {
  try {
    const response = await api.get('/projects')
    projectStore.projects = response.data
  } catch (err) {
    console.error('Erro ao carregar projetos:', err)
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-blue-800">Meus Projetos</h1>
      <button @click="createNewProject" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Novo Projeto</button>
    </div>

    <div class="mb-4 flex gap-4">
      <input v-model="searchQuery" type="text" placeholder="Buscar..." class="border px-3 py-2 rounded w-full" />
      <select v-model="statusFilter" class="border px-3 py-2 rounded">
        <option value="all">Todos</option>
        <option value="em_andamento">Em andamento</option>
        <option value="concluido">Concluídos</option>
        <option value="cancelado">Cancelados</option>
      </select>
      <button @click="deleteSelectedProjects" :disabled="!selectedProjects.length" class="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 whitespace-nowrap">Excluir Selecionados</button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <Table class="w-full text-normal">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th class="p-2 text-left">Projeto</th>
            <th class="p-2 text-left">Início</th>
            <th class="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project._id" class="hover:bg-gray-50">
            <td class="p-2">
              <input type="checkbox" :checked="isSelected(project._id)" @change="toggleSelection(project._id)" />
            </td>
            <td class="p-2 cursor-pointer text-blue-700" @click="viewProject(project._id)">{{ project.title }}</td>
            <td class="p-2">{{ formatDate(project.startDate) }}</td>
            <td class="p-2">
              <span :class="'px-2 py-1 rounded-full text-xs font-semibold ' + getStatusClass(project.status)">{{ getStatusText(project.status) }}</span>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  </div>
</template>
