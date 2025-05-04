<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToNewProject = () => {
  router.push('/projects/new')
}

const navigateToProjects = () => {
  router.push('/projects')
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-blue-800 mb-4">Gerenciador de Projetos de Extensão</h1>
      <p class="text-lg text-gray-600">
        Registre, acompanhe e documente seus projetos de extensão acadêmica de forma simples e organizada.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 class="text-2xl font-semibold text-blue-700 mb-4">O que são Projetos de Extensão?</h2>
      <p class="mb-4">
        Projetos de extensão são atividades acadêmicas que conectam o conhecimento universitário com a comunidade externa,
        promovendo a troca de saberes e experiências práticas que beneficiam tanto os estudantes quanto a sociedade.
      </p>
      <p>
        Através desta plataforma, você pode documentar todas as informações necessárias para validar suas horas de atividades
        complementares e manter um registro organizado de suas contribuições.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 class="text-xl font-semibold text-blue-700 mb-3">Registre seus Projetos</h3>
        <ul class="list-disc list-inside mb-4 text-gray-700">
          <li>Documentação completa das atividades</li>
          <li>Registro de horas dedicadas</li>
          <li>Descrição de objetivos e público-alvo</li>
          <li>Desafios e conquistas</li>
        </ul>
        <button @click="navigateToNewProject" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
          Criar Novo Projeto
        </button>
      </div>

      <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 class="text-xl font-semibold text-blue-700 mb-3">Gerencie seus Registros</h3>
        <ul class="list-disc list-inside mb-4 text-gray-700">
          <li>Visualize todos os seus projetos</li>
          <li>Acompanhe o status de cada atividade</li>
          <li>Edite informações quando necessário</li>
          <li>Prepare relatórios para submissão</li>
        </ul>
        <button @click="navigateToProjects" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
          Ver Meus Projetos
        </button>
      </div>
    </div>

    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Lembre-se de enviar seus relatórios de projeto através da plataforma, na seção de Projetos de Extensão.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>