import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/project.js'
import { auth } from './middleware/auth.js'

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Rota protegida acessada com sucesso' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})