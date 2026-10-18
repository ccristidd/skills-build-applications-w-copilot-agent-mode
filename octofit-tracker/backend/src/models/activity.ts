import { model, Schema, Types } from 'mongoose'

export const activityTypes = [
  'walking',
  'running',
  'cycling',
  'strength',
  'other',
] as const

export interface Activity {
  user: Types.ObjectId
  activityType: (typeof activityTypes)[number]
  durationMinutes: number
  calories: number
  recordedAt: Date
}

const activitySchema = new Schema<Activity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, enum: activityTypes, required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    calories: { type: Number, min: 0, default: 0 },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const ActivityModel = model<Activity>('Activity', activitySchema)
