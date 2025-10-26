import React, { createContext, useEffect, useState, ReactNode } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  accountType: 'Student' | 'Instructor'
  additionalDetails?: {
    dateOfBirth?: string
    about?: string
    contactNumber?: string
    gender?: string
  }
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  signup: (payload: any) => Promise<any>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { 
      setLoading(false)
      return 
    }

    api.get('/get')
      .then(res => setUser(res.data.data || res.data))
      .catch(() => { 
        localStorage.removeItem('token')
        setUser(null) 
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/login', { email, password })
    if (res.data?.token) localStorage.setItem('token', res.data.token)
    setUser(res.data?.Cuser || res.data?.user || res.data)
    return res
  }

  const signup = async (payload: any) => api.post('/signup', payload)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}