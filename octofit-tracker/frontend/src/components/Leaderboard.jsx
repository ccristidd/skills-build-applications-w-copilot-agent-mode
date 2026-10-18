import ResourceTable from './ResourceTable.jsx'
import { useApiCollection } from '../hooks/useApiCollection.js'

const columns = [
  { key: 'user', label: 'User ID' },
  { key: 'score', label: 'Score' },
  { key: 'periodStart', label: 'Period starts' },
  { key: 'periodEnd', label: 'Period ends' },
]

function Leaderboard() {
  const { records, loading, error } = useApiCollection('/api/leaderboard/', fetch)

  return (
    <ResourceTable
      title="Leaderboard"
      description="See how members are scoring this competition period."
      columns={columns}
      records={records}
      loading={loading}
      error={error}
    />
  )
}

export default Leaderboard
