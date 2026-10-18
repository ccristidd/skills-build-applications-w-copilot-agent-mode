import { model, Schema } from 'mongoose'
import { activityTypes } from './activity'

export const workoutDifficulties = ['beginner', 'intermediate', 'advanced'] as const

export interface Workout {
  title: string
  description: string
  activityType: (typeof activityTypes)[number]
  durationMinutes: number
  difficulty: (typeof workoutDifficulties)[number]
}

const workoutSchema = new Schema<Workout>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    activityType: { type: String, enum: activityTypes, required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    difficulty: { type: String, enum: workoutDifficulties, required: true },
  },
  { timestamps: true },
)

export const WorkoutModel = model<Workout>('Workout', workoutSchema)
