import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthContextType {
  userId: number | null
  username: string | null
  login: (id: number, username: string, token: string) => void
  logout: () => void
  isAuthenticated: boolean
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(() => {
    const storedId = localStorage.getItem('userId')
    return storedId ? Number(storedId) : null
  })
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'))
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      setUserId(null)
      setUsername(null)
      return
    }

    fetch('https://wizallet.onrender.com/api/auth/me', {
      headers: {
        Authorization: `Bearer ${t}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(data => {
        setUserId(data.id)
        setUsername(data.username)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        setToken(null)
        setUserId(null)
        setUsername(null)
      })
  }, [])

  const login = (id: number, username: string, newToken: string) => {
    setUserId(id)
    setUsername(username)
    setToken(newToken)
    localStorage.setItem('userId', id.toString())
    localStorage.setItem('username', username)
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    setUserId(null)
    setUsername(null)
    setToken(null)
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
  }

  const getToken = () => token || localStorage.getItem('token') || null

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        login,
        logout,
        isAuthenticated: !!userId,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
