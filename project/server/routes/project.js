import express from 'express'
import Project from '../models/Project.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user.id
    })
    await project.save()
    res.status(201).json(project)
  } catch (err) {
    console.error('Erro ao criar projeto:', err)
    res.status(500).json({ message: 'Erro ao criar projeto' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar projetos' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    )

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' })
    }

    res.json(project)
  } catch (err) {
    console.error('Erro ao atualizar projeto:', err)
    res.status(500).json({ message: 'Erro ao atualizar projeto' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' })
    }

    res.json({ message: 'Projeto excluído com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir projeto:', err)
    res.status(500).json({ message: 'Erro ao excluir projeto' })
  }
})

export default router
