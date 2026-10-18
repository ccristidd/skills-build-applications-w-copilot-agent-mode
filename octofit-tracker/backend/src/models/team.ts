import { model, Schema } from 'mongoose'

export interface Team {
  name: string
  description: string
}

const teamSchema = new Schema<Team>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

export const TeamModel = model<Team>('Team', teamSchema)
