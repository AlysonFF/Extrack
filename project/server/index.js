import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/project.js'
import { auth } from './middleware/auth.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config({ path: new URL('../server/.env', import.meta.url).pathname })

const app = express()

connectDB()

const allowedOrigins = [
  'http://localhost:5173',
  'https://extrack-dyga.onrender.com'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Rota protegida acessada com sucesso' })
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')

app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})