import ResourceTable from './ResourceTable.jsx'
import { useApiCollection } from '../hooks/useApiCollection.js'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'team', label: 'Team ID' },
]

function Users() {
  const { records, loading, error } = useApiCollection('/api/users/', fetch)

  return (
    <ResourceTable
      title="Users"
      description="Browse OctoFit members and their team assignments."
      columns={columns}
      records={records}
      loading={loading}
      error={error}
    />
  )
}

export default Users
