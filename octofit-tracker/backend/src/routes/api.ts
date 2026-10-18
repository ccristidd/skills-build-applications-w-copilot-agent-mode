import { isValidObjectId, Model } from 'mongoose'
import { Request, Response, Router } from 'express'
import { ActivityModel } from '../models/activity'
import { LeaderboardModel } from '../models/leaderboard'
import { TeamModel } from '../models/team'
import { UserModel } from '../models/user'
import { WorkoutModel } from '../models/workout'

function isRequestBody(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

function createCrudRouter<T>(
  resourceName: string,
  resourceModel: Model<T>,
  sort: Record<string, 1 | -1>,
): Router {
  const router = Router()

  router.get('/', async (_request, response) => {
    response.json(await resourceModel.find().sort(sort))
  })

  router.post('/', async (request: Request, response: Response) => {
    if (!isRequestBody(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' })
      return
    }

    response.status(201).json(await resourceModel.create(request.body))
  })

  router.put('/:id', async (request, response) => {
    const { id } = request.params
    if (!isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid resource ID' })
      return
    }
    if (!isRequestBody(request.body)) {
      response.status(400).json({ error: 'Request body must be a JSON object' })
      return
    }

    const resource = await resourceModel.findByIdAndUpdate(
      id,
      { $set: request.body },
      { new: true, runValidators: true },
    )
    if (!resource) {
      response.status(404).json({ error: `${resourceName} not found` })
      return
    }
    response.json(resource)
  })

  router.delete('/:id', async (request, response) => {
    const { id } = request.params
    if (!isValidObjectId(id)) {
      response.status(400).json({ error: 'Invalid resource ID' })
      return
    }

    const resource = await resourceModel.findByIdAndDelete(id)
    if (!resource) {
      response.status(404).json({ error: `${resourceName} not found` })
      return
    }
    response.status(204).end()
  })

  return router
}

export const apiRouter = Router()

apiRouter.use('/users', createCrudRouter('User', UserModel, { name: 1 }))
apiRouter.use('/teams', createCrudRouter('Team', TeamModel, { name: 1 }))
apiRouter.use(
  '/activities',
  createCrudRouter('Activity', ActivityModel, { recordedAt: -1 }),
)
apiRouter.use(
  '/leaderboard',
  createCrudRouter('Leaderboard entry', LeaderboardModel, { score: -1 }),
)
apiRouter.use(
  '/workouts',
  createCrudRouter('Workout', WorkoutModel, { title: 1 }),
)
