"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

/**
 * The authentication context type.
 */
interface AuthContextType {
  session: Session | null
  user: User | null
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

/**
 * The authentication provider component.
 *
 * @param children - The children to render.
 * @returns The authentication provider component.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    /**
     * Gets the current session.
     */
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
    }

    getSession()

    // Listen for changes to the authentication state.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    // Unsubscribe from the authentication state listener when the component unmounts.
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  /**
   * Signs the user out.
   */
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * A hook to use the authentication context.
 *
 * @returns The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
