import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navigation = [
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  return (
    <>
      <header className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/activities">
            <img src={logo} alt="" className="brand-logo" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <nav className="navbar-nav flex-row flex-wrap gap-1" aria-label="Main navigation">
            {navigation.map(({ to, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`
                }
                key={to}
                to={to}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-4 py-md-5">
        <Routes>
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate replace to="/activities" />} />
        </Routes>
      </main>
      <footer className="border-top py-3 text-center text-body-secondary small">
        Track your movement. Celebrate your progress.
      </footer>
    </>
  )
}

export default App
