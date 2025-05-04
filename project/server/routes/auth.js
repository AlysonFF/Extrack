import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' })
    }

    user = new User({
      name,
      email,
      password
    })

    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000

    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Recuperação de Senha - Projeto de Extensão',
      text: `Você está recebendo este email porque você (ou alguém) solicitou a recuperação de senha.\n\n
        Por favor, clique no link a seguir ou cole-o no seu navegador para completar o processo:\n\n
        http://${req.headers.host}/reset-password/${resetToken}\n\n
        Se você não solicitou isso, por favor ignore este email e sua senha permanecerá inalterada.\n`
    }

    await transporter.sendMail(mailOptions)
    res.json({ message: 'Email de recuperação enviado' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar email de recuperação' })
  }
})

router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao redefinir senha' })
  }
})

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' })
  }
})

export default router