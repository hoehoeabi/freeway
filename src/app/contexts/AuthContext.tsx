<<<<<<< HEAD
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
=======
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
>>>>>>> upstream/develop
import type { User } from '../services/auth'
import { authService } from '../services/auth'

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
    register: (
        email: string,
        password: string,
        name: string,
        accessibilityType: string,
    ) => Promise<{ success: boolean; message: string }>
    logout: () => void
    updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
<<<<<<< HEAD
        const initUser = async () => {
            const currentUser = await authService.getCurrentUser()
            setUser(currentUser)
        }
        initUser()
=======
        // 초기 세션 로드
        authService.getCurrentUser().then(setUser)

        // Supabase 인증 상태 변화 감지
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const user = await authService.getCurrentUser()
                setUser(user)
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
>>>>>>> upstream/develop
    }, [])

    const login = async (email: string, password: string) => {
        const result = await authService.login(email, password)
        if (result.success && result.user) {
            setUser(result.user)
        }
        return result
    }

    const register = async (email: string, password: string, name: string, accessibilityType: string) => {
        const result = await authService.register(email, password, name, accessibilityType)
        return result
    }

    const logout = async () => {
        await authService.logout()
        setUser(null)
    }

    const updateProfile = async (updates: Partial<User>) => {
        if (!user) {
            return { success: false, message: '로그인이 필요합니다.' }
        }
<<<<<<< HEAD
        const result = await authService.updateUser(updates)
=======
        const result = await authService.updateUser(user.id, updates)
>>>>>>> upstream/develop
        if (result.success) {
            setUser({ ...user, ...updates })
        }
        return result
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
