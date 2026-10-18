import ResourceTable from './ResourceTable.jsx'
import { useApiCollection } from '../hooks/useApiCollection.js'

const columns = [
  { key: 'activityType', label: 'Activity' },
  { key: 'user', label: 'User ID' },
  { key: 'durationMinutes', label: 'Duration (minutes)' },
  { key: 'calories', label: 'Calories' },
  { key: 'recordedAt', label: 'Recorded at' },
]

function Activities() {
  const { records, loading, error } = useApiCollection('/api/activities/', fetch)

  return (
    <ResourceTable
      title="Activities"
      description="Review the activities logged by OctoFit members."
      columns={columns}
      records={records}
      loading={loading}
      error={error}
    />
  )
}

export default Activities
