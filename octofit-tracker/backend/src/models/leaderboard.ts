import { model, Schema, Types } from 'mongoose'

export interface LeaderboardEntry {
  user: Types.ObjectId
  score: number
  periodStart: Date
  periodEnd: Date
}

const leaderboardSchema = new Schema<LeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, min: 0, default: 0 },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
  },
  { timestamps: true },
)

leaderboardSchema.index({ user: 1, periodStart: 1, periodEnd: 1 }, { unique: true })

export const LeaderboardModel = model<LeaderboardEntry>(
  'LeaderboardEntry',
  leaderboardSchema,
)
