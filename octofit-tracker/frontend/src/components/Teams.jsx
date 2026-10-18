import ResourceTable from './ResourceTable.jsx'
import { useApiCollection } from '../hooks/useApiCollection.js'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'createdAt', label: 'Created' },
]

function Teams() {
  const { records, loading, error } = useApiCollection('/api/teams/', fetch)

  return (
    <ResourceTable
      title="Teams"
      description="Meet the teams training and competing together."
      columns={columns}
      records={records}
      loading={loading}
      error={error}
    />
  )
}

export default Teams
