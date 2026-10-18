import { model, Schema, Types } from 'mongoose'

export interface User {
  name: string
  email: string
  team?: Types.ObjectId
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
)

export const UserModel = model<User>('User', userSchema)
