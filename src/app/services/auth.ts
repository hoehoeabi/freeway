<<<<<<< HEAD
import { supabase } from '../../lib/supabase'

export interface User {
  id: string;
  email: string;
  name: string;
  accessibilityType: string;
  createdAt: string;
}

/**
 * Supabase Auth 기반 인증 서비스
 */
class AuthService {
  /**
   * 새로운 사용자를 등록합니다. metadata에 name과 accessibilityType을 저장합니다.
   */
  async register(email: string, password: string, name: string, accessibilityType: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          accessibilityType,
        },
      },
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' }
  }

  /**
   * 이메일과 비밀번호로 로그인합니다.
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    const user = data.user
    if (!user) {
      return { success: false, message: '사용자 정보를 가져올 수 없습니다.' }
    }

    return {
      success: true,
      message: '로그인되었습니다.',
      user: this.mapSupabaseUserToLocalUser(user),
    }
  }

  /**
   * 로그아웃합니다.
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut()
  }

  /**
   * 현재 세션의 사용자 정보를 가져와 로컬 User 형식으로 변환합니다.
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return this.mapSupabaseUserToLocalUser(user)
  }

  /**
   * 사용자 프로필(metadata)을 업데이트합니다.
   */
  async updateUser(updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.updateUser({
      data: {
        ...updates
      }
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: '프로필이 업데이트되었습니다.' }
  }

  private mapSupabaseUserToLocalUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || '',
      accessibilityType: supabaseUser.user_metadata?.accessibilityType || '일반',
      createdAt: supabaseUser.created_at,
    }
  }
}

export const authService = new AuthService();
=======
import { supabase } from '../lib/supabase'

export interface User {
    id: string
    email: string
    name: string
    accessibilityType: string
    createdAt: string
}

class AuthService {
    async register(
        email: string,
        password: string,
        name: string,
        accessibilityType: string,
    ): Promise<{ success: boolean; message: string }> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, accessibilityType },
            },
        })

        if (error) {
            if (error.message.includes('already registered')) {
                return { success: false, message: '이미 등록된 이메일입니다.' }
            }
            return { success: false, message: error.message }
        }

        if (data.user && !data.session) {
            return { success: true, message: '이메일 인증 후 로그인해주세요.' }
        }

        return { success: true, message: '회원가입이 완료되었습니다.' }
    }

    async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
        }

        const user = this.mapSupabaseUser(data.user)
        return { success: true, message: '로그인되었습니다.', user }
    }

    async logout(): Promise<void> {
        await supabase.auth.signOut()
    }

    async getCurrentUser(): Promise<User | null> {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        return user ? this.mapSupabaseUser(user) : null
    }

    async updateUser(_userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
        const { error } = await supabase.auth.updateUser({
            data: {
                name: updates.name,
                accessibilityType: updates.accessibilityType,
            },
        })

        if (error) {
            return { success: false, message: error.message }
        }

        return { success: true, message: '프로필이 업데이트되었습니다.' }
    }

    private mapSupabaseUser(user: {
        id: string
        email?: string
        user_metadata?: Record<string, string>
        created_at?: string
    }): User {
        return {
            id: user.id,
            email: user.email ?? '',
            name: user.user_metadata?.name ?? '',
            accessibilityType: user.user_metadata?.accessibilityType ?? '일반',
            createdAt: user.created_at ?? new Date().toISOString(),
        }
    }
}

export const authService = new AuthService()
>>>>>>> upstream/develop
