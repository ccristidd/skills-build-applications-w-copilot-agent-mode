import ResourceTable from './ResourceTable.jsx'
import { useApiCollection } from '../hooks/useApiCollection.js'

const columns = [
  { key: 'title', label: 'Workout' },
  { key: 'activityType', label: 'Activity' },
  { key: 'durationMinutes', label: 'Duration (minutes)' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'description', label: 'Description' },
]

function Workouts() {
  const { records, loading, error } = useApiCollection('/api/workouts/', fetch)

  return (
    <ResourceTable
      title="Workouts"
      description="Find a workout to match your goals and training level."
      columns={columns}
      records={records}
      loading={loading}
      error={error}
    />
  )
}

export default Workouts
