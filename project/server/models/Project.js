import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate:   { type: String, required: true },
  hoursPerWeek: Number,
  totalDays: Number,
  objective: String,
  targetAudience: String,
  description: String,
  challenges: String,
  achievements: String,
  learnings: String,
  evidenceLinks: [String],
  status: {
    type: String,
    enum: ['em_andamento', 'concluido', 'cancelado'],
    default: 'em_andamento'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Project', projectSchema)