
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from './types'
import { apiFetch } from './api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<any>
  loginWithGoogle: () => Promise<void>
  signup: (name: string, email: string, password: string, phone: string, lat?: number, lng?: number, address?: string, city?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser)
        // Ensure createdAt is Date
        if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt)
        setUser(parsed)
      } catch (e) {
        console.warn('Failed to parse stored user', e)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha: password })
      })

      const userData: any = {
        id: res.id,
        name: res.nome || res.name || '',
        email: res.email,
        phone: res.telefone || '',
        photoUrl: res.photoUrl || '/user-profile-illustration.png',
        location: (res.latitude && res.longitude) ? {
          lat: Number(res.latitude),
          lng: Number(res.longitude),
          address: '', // Backend doesn't return address text on login yet
          city: ''
        } : undefined,
        createdAt: new Date()
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      if (res.token) localStorage.setItem('token', res.token)
      return userData
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    // Placeholder: implement OAuth flow when backend supports it.
    const mockUser: User = {
      id: 'google-1',
      name: 'Usuario Google',
      email: 'usuario@gmail.com',
      phone: '+55 11 98765-4321',
      photoUrl: '/user-profile-illustration.png',
      createdAt: new Date(),
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string, phone: string, lat?: number, lng?: number, address?: string, city?: string) => {
    setIsLoading(true)
    try {
      // Cria o usuário
      await apiFetch('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify({ 
          nome: name, 
          email, 
          senha: password, 
          telefone: phone,
          latitude: lat,
          longitude: lng,
          // endereco: address, // Not yet supported by backend schema
          // cidade: city     // Not yet supported by backend schema
        })
      })

      // Efetua login automático para obter token e dados completos
      const loginRes: any = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha: password })
      })

      const userData: any = {
        id: loginRes.id,
        name: loginRes.nome || name,
        email: loginRes.email,
        phone: loginRes.telefone || phone,
        photoUrl: '/user-profile-illustration.png',
        createdAt: new Date()
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      if (loginRes.token) localStorage.setItem('token', loginRes.token)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
