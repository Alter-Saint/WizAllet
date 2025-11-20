import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

const SideBar = () => {
  const { username, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside>
      <h1>Wiz<span>Allet</span></h1>

      {isAuthenticated ? (
        <>
          <nav>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>
              Dashboard
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : undefined}>
              History
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : undefined}>
              Settings
            </NavLink>
          </nav>
          <div>
            <p>Hello {username}</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </>
      ) : (
        <div>
          <p>You are not logged in</p>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      )}
    </aside>
  )
}

export default SideBar
