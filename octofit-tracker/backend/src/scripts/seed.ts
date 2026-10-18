import mongoose from 'mongoose'
import { connectDatabase } from '../config/database'
import { ActivityModel } from '../models/activity'
import { LeaderboardModel } from '../models/leaderboard'
import { TeamModel } from '../models/team'
import { UserModel } from '../models/user'
import { WorkoutModel } from '../models/workout'

const teamFixtures = [
  { name: 'Trailblazers', description: 'A team for active explorers.' },
  { name: 'Peak Performers', description: 'Building strength and endurance together.' },
  { name: 'City Striders', description: 'Making every city block count.' },
] as const

const userFixtures = [
  { name: 'Alex Morgan', email: 'alex@example.com', team: 'Trailblazers' },
  { name: 'Jamie Chen', email: 'jamie@example.com', team: 'Trailblazers' },
  { name: 'Morgan Patel', email: 'morgan@example.com', team: 'Peak Performers' },
  { name: 'Sam Rivera', email: 'sam@example.com', team: 'City Striders' },
  { name: 'Taylor Brooks', email: 'taylor@example.com', team: 'Peak Performers' },
] as const

const periodStart = new Date('2026-10-12T00:00:00.000Z')
const periodEnd = new Date('2026-10-18T23:59:59.999Z')

const activityFixtures = [
  {
    email: 'alex@example.com',
    activityType: 'running',
    durationMinutes: 35,
    calories: 320,
    recordedAt: '2026-10-12T08:00:00.000Z',
  },
  {
    email: 'alex@example.com',
    activityType: 'cycling',
    durationMinutes: 45,
    calories: 390,
    recordedAt: '2026-10-15T07:30:00.000Z',
  },
  {
    email: 'jamie@example.com',
    activityType: 'walking',
    durationMinutes: 50,
    calories: 220,
    recordedAt: '2026-10-13T17:00:00.000Z',
  },
  {
    email: 'jamie@example.com',
    activityType: 'strength',
    durationMinutes: 40,
    calories: 300,
    recordedAt: '2026-10-17T09:00:00.000Z',
  },
  {
    email: 'morgan@example.com',
    activityType: 'cycling',
    durationMinutes: 60,
    calories: 500,
    recordedAt: '2026-10-14T06:45:00.000Z',
  },
  {
    email: 'sam@example.com',
    activityType: 'running',
    durationMinutes: 25,
    calories: 240,
    recordedAt: '2026-10-16T18:15:00.000Z',
  },
  {
    email: 'taylor@example.com',
    activityType: 'strength',
    durationMinutes: 55,
    calories: 410,
    recordedAt: '2026-10-18T10:00:00.000Z',
  },
] as const

const workoutFixtures = [
  {
    title: 'Easy 30-minute run',
    description: 'A steady-paced run to build aerobic endurance.',
    activityType: 'running',
    durationMinutes: 30,
    difficulty: 'beginner',
  },
  {
    title: 'Tempo run intervals',
    description: 'Alternate brisk running with recovery intervals.',
    activityType: 'running',
    durationMinutes: 40,
    difficulty: 'intermediate',
  },
  {
    title: 'Full-body strength circuit',
    description: 'A balanced circuit of bodyweight strength exercises.',
    activityType: 'strength',
    durationMinutes: 35,
    difficulty: 'intermediate',
  },
  {
    title: 'Recovery walk',
    description: 'A relaxed walk to support active recovery.',
    activityType: 'walking',
    durationMinutes: 25,
    difficulty: 'beginner',
  },
  {
    title: 'Endurance ride',
    description: 'A sustained cycling session at a comfortable pace.',
    activityType: 'cycling',
    durationMinutes: 60,
    difficulty: 'advanced',
  },
] as const

/**
 * Seed the octofit_db database with test data.
 */
async function seedDatabase(): Promise<void> {
  await connectDatabase()

  try {
    const teamIds = new Map<string, mongoose.Types.ObjectId>()
    for (const fixture of teamFixtures) {
      const team = await TeamModel.findOneAndUpdate(
        { name: fixture.name },
        { $set: { description: fixture.description } },
        { upsert: true, new: true, runValidators: true },
      )
      teamIds.set(team.name, team._id)
    }

    const userIds = new Map<string, mongoose.Types.ObjectId>()
    for (const fixture of userFixtures) {
      const team = teamIds.get(fixture.team)
      if (!team) {
        throw new Error(`No team found for user ${fixture.email}`)
      }
      const user = await UserModel.findOneAndUpdate(
        { email: fixture.email },
        { $set: { name: fixture.name, team } },
        { upsert: true, new: true, runValidators: true },
      )
      userIds.set(user.email, user._id)
    }

    const activities = activityFixtures.map((fixture) => {
      const user = userIds.get(fixture.email)
      if (!user) {
        throw new Error(`No user found for activity ${fixture.email}`)
      }
      return {
        user,
        activityType: fixture.activityType,
        durationMinutes: fixture.durationMinutes,
        calories: fixture.calories,
        recordedAt: new Date(fixture.recordedAt),
      }
    })

    await ActivityModel.bulkWrite(
      activities.map((activity) => ({
        updateOne: {
          filter: {
            user: activity.user,
            activityType: activity.activityType,
            recordedAt: activity.recordedAt,
          },
          update: { $setOnInsert: activity },
          upsert: true,
        },
      })),
    )

    const scores = new Map<string, number>()
    for (const activity of activityFixtures) {
      scores.set(
        activity.email,
        (scores.get(activity.email) ?? 0) + activity.calories,
      )
    }

    await LeaderboardModel.bulkWrite(
      userFixtures.map((fixture) => {
        const user = userIds.get(fixture.email)
        if (!user) {
          throw new Error(`No user found for leaderboard entry ${fixture.email}`)
        }
        return {
          updateOne: {
            filter: { user, periodStart, periodEnd },
            update: { $set: { score: scores.get(fixture.email) ?? 0 } },
            upsert: true,
          },
        }
      }),
    )

    await WorkoutModel.bulkWrite(
      workoutFixtures.map((workout) => ({
        updateOne: {
          filter: { title: workout.title },
          update: { $setOnInsert: workout },
          upsert: true,
        },
      })),
    )

    console.log(
      `Database seeding complete: ${teamFixtures.length} teams, ${userFixtures.length} users, ${activities.length} activities, ${userFixtures.length} leaderboard entries, ${workoutFixtures.length} workouts.`,
    )
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error)
  process.exitCode = 1
})
