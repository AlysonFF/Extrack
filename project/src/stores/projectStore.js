import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref([])
  const nextId = ref(1)

  function addProject(project) {
    const newProject = {
      ...project,
      id: nextId.value++,
      createdAt: new Date().toISOString()
    }
    projects.value.push(newProject)
    saveToLocalStorage()
    return newProject.id
  }

  function getProject(id) {
  return projects.value.find(project => project._id === id)
  }

  function updateProject(id, updatedProject) {
    const index = projects.value.findIndex(project => project.id === parseInt(id))
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updatedProject }
      saveToLocalStorage()
      return true
    }
    return false
  }

  function deleteProject(id) {
    const index = projects.value.findIndex(project => project.id === parseInt(id))
    if (index !== -1) {
      projects.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  function saveToLocalStorage() {
    localStorage.setItem('extension-projects', JSON.stringify(projects.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('extension-projects')
    if (saved) {
      projects.value = JSON.parse(saved)
      if (projects.value.length > 0) {
        const maxId = Math.max(...projects.value.map(p => p.id))
        nextId.value = maxId + 1
      }
    }
  }

  loadFromLocalStorage()

  return {
    projects,
    addProject,
    getProject,
    updateProject,
    deleteProject
  }
})