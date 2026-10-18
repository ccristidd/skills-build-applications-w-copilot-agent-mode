import mongoose from 'mongoose';
import { ActivityModel } from '../models/activity';
import { LeaderboardModel } from '../models/leaderboard';
import { TeamModel } from '../models/team';
import { UserModel } from '../models/user';
import { WorkoutModel } from '../models/workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString, { dbName: 'octofit_db' });

    console.log('Connected to octofit_db');

    const team = await TeamModel.findOneAndUpdate(
      { name: 'Trailblazers' },
      {
        $setOnInsert: {
          name: 'Trailblazers',
          description: 'A team for active explorers.',
        },
      },
      { upsert: true, new: true },
    );
    const user = await UserModel.findOneAndUpdate(
      { email: 'alex@example.com' },
      {
        $setOnInsert: {
          name: 'Alex Morgan',
          email: 'alex@example.com',
          team: team._id,
        },
      },
      { upsert: true, new: true },
    );

    await ActivityModel.updateOne(
      {
        user: user._id,
        activityType: 'running',
        recordedAt: new Date('2026-01-15T08:00:00.000Z'),
      },
      {
        $setOnInsert: {
          user: user._id,
          activityType: 'running',
          durationMinutes: 30,
          calories: 280,
          recordedAt: new Date('2026-01-15T08:00:00.000Z'),
        },
      },
      { upsert: true },
    );
    await LeaderboardModel.updateOne(
      {
        user: user._id,
        periodStart: new Date('2026-01-12T00:00:00.000Z'),
        periodEnd: new Date('2026-01-18T23:59:59.999Z'),
      },
      {
        $setOnInsert: {
          user: user._id,
          score: 280,
          periodStart: new Date('2026-01-12T00:00:00.000Z'),
          periodEnd: new Date('2026-01-18T23:59:59.999Z'),
        },
      },
      { upsert: true },
    );
    await WorkoutModel.updateOne(
      { title: 'Easy 30-minute run' },
      {
        $setOnInsert: {
          title: 'Easy 30-minute run',
          description: 'A steady-paced run to build aerobic endurance.',
          activityType: 'running',
          durationMinutes: 30,
          difficulty: 'beginner',
        },
      },
      { upsert: true },
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
